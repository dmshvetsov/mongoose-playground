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
  organization: String,
});

const Course = mongoose.model("Course", courseSchema);

/**
 * Example code
 */

const example = async () => {
  await Course.create({
    name: "Mongoose 101",
    organization: "ACME University",
  });
  let found = await Course.findOne({
    name: "Mongoose 101",
    organization: null,
  }).lean();
  assert(
    found === null,
    "should found nothing, there are no records with organization = null"
  );

  found = await Course.findOne({
    name: "Mongoose 101",
    organization: undefined,
  }).lean();
  assert(
    found === null,
    "should found nothing, there are no records with organization = undefined"
  );

  found = await Course.findOne({
    name: "Mongoose 101",
  }).lean();
  assert(found !== null, "should found one");
};

dbPromise
  .then(({ connection }) => flushCollection(connection, "courses"))
  .then(() => example())
  .then(handleSuccess)
  .catch(handleError);
