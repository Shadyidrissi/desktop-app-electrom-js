import mongoose from "mongoose";

let isConnected = false;

export async function connect() {
  if (isConnected) {
    console.log("تم الاتصال بقاعدة البيانات مسبقًا");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log("تم الاتصال بقاعدة البيانات");
  } catch (error) {
    console.error("فشل الاتصال بقاعدة البيانات:", error);
    throw new Error("فشل الاتصال بقاعدة البيانات");
  }
}
