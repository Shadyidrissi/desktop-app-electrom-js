// user.action.js
import User from "../modules/user.module";  // تأكد من أن المسار هنا صحيح
import { connect } from "../db";  // تأكد من أن الاتصال بقاعدة البيانات صحيح

export async function createUser(user) {
  try {
    await connect();
    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));  // إعادة تحويل البيانات إلى JSON إذا كانت من Mongoose
  } catch (error) {
    console.log(error);
  }
}
  