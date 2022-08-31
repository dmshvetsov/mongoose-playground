const assert = require("assert");
const mongoose = require("mongoose");

/**
 * Helpers
 */

const handleSuccess = (msg) => {
  if (msg) console.info(msg);
  console.info("Play is completed 👌");
  process.exit(0);
};

const handleError = (err) => {
  console.error(err);
  console.info("Play end up with an error ❗️");
  process.exit(1);
};

const flushCollection = (connection, collectionName) =>
  connection.db.collection(collectionName).deleteMany();

/**
 * Setup
 */

const dbPromise = mongoose.connect("mongodb://localhost:27017/playground", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const courseSchema = new mongoose.Schema({
  name: String,
  startsAt: Date,
});

const Course = mongoose.model("Course", courseSchema);

/**
 * Example code
 */

const example = async () => {
  const date = new Date("2022-03-07T00:00");
  const docA = await Course.create({
    name: "Mongoose Basics",
    startsAt: date,
  });

  const docB = await Course.create({
    name: "Mongoose Advance",
    startsAt: date.toISOString(),
  });

  console.log(typeof docA, docA.startsAt, '/', typeof docB, docB.startsAt);
};

dbPromise
  .then(({ connection }) => flushCollection(connection, "courses"))
  .then(() => example())
  .then(handleSuccess)
  .catch(handleError);
