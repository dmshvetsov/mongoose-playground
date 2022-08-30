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
  const courseMongoose101 = await Course.create({
    name: "Mongoose 101",
    organization: "ACME University",
  });

  await Course.bulkWrite([
    {
      updateOne: {
        filter: {
          name: "Mongoose 101",
        },
        update: {
          $set: {
            name: "Mongoose 101 Course",
            organization: undefined,
          },
        },
        upsert: true,
      },
    },
  ]);

  const found = await Course.findOne(courseMongoose101._id).lean();
  assert(
    found.organization !== undefined,
    `organization should beign updated, new value is not set, expected undefined got \`${courseMongoose101.organization}\``
  );
};

dbPromise
  .then(({ connection }) => flushCollection(connection, "courses"))
  .then(() => example())
  .then(handleSuccess)
  .catch(handleError);
