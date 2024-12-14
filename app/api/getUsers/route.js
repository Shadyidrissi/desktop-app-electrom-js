// pages/api/getUser.js
import { connect } from "../../lib/db";
import User from "../../lib/modules/user.module";

export default async function handler(req, res) {
  try {
    await connect(); // Ensure your database connection is established
    const { clerkId } = req.query; // Retrieve clerkId from the request
    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
