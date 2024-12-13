import mongoose from 'mongoose';

export const connect = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  }
  mongoose.connect(MONGODB_URL
    , {
    dbName: "clerkauthv5",
    bufferCommands: false,
    connectTimeoutMS: 30000,
  });
  console.log("done DB")
};

export default connect;
