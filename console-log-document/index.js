/**
 * Example to console.log with Mongoose using lean
 *
 * Made for a discussion on reddit
 * https://www.reddit.com/r/node/comments/mi4us7/can_you_help_me_with_this_problem_when_console/
 *
 * @example
 *    // console.log output
 *    // {
 *    //   _id: 60667ae0e0e8822225f9fad4,
 *    //   name: 'Mongoose tiny console.log course',
 *    //   __v: 0
 *    // }
 *    node console-log-document/index.js
 */

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

const flushCollection = (connection, collectionName) => connection.db.collection(collectionName).deleteMany();

/**
 * Setup
 */

const dbPromise = mongoose.connect("mongodb://localhost:27017/playground", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const courseSchema = new mongoose.Schema({
  name: String,
});

const Course = mongoose.model('Course', courseSchema);

/**
 * Action
 */

const mongooseCourseId = '60667d3ac808712762bd35f8';

dbPromise.then(
  ({ connection }) => flushCollection(connection, 'courses')
).then(
  () => Course.create({ _id: mongooseCourseId, name: 'Mongoose tiny console.log course' })
).then(() => {
  // Simulate that we searching course by ID as a string
  // NOTE: in general there is no need to wrap strings
  // console.log(mongoose.Types.ObjectId(mongooseCourseId));
  // NOTE: console.loging works fine even without `.lean()`
  // return Course.findById(mongoose.Types.ObjectId(mongooseCourseId)).then(console.log);
  return Course.findById(mongooseCourseId).lean().then(console.log);
})
  .then(handleSuccess)
  .catch(handleError);
