import mongoose from "mongoose";
import keys from "../config/keys";

mongoose.Promise = global.Promise;

before((done) => {
  mongoose.connect(keys.mongoURI);
  mongoose.connection
    .once("open", () => { done(); })
    .on("error", error => {
      console.warn("Warning", error);
    });
});

beforeEach(done => {
  mongoose.connection.collections.authors.drop(() => {
    //ready to run the next test
    done();
  });
});
