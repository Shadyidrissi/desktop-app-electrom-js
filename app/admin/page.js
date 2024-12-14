// import { currentUser } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import {connect} from "../../lib/db"; // Your MongoDB connection utility
import User from "../../lib/modules/user.module"; // Your MongoDB User schema
import AdminDashborad from "./AdminDashborad";

export default async function AdminDashboardPage() {
  const user = await currentUser();

  if (!user) {
    return <p>Please log in to access the admin dashboard.</p>;
  }

  await connect(); // Ensure MongoDB is connected

  // Fetch the user's role from MongoDB
  const dbUser = await User.findOne({ clerkId: user.id }); // Assuming `clerkId` is saved in your MongoDB User schema

  if (!dbUser) {
    return <p>User not found in the database. Contact support.</p>;
  }

  const serializedUser = JSON.parse(
    JSON.stringify({
      id: user.id,
      email: user.emailAddresses?.[0]?.emailAddress,
      role: dbUser.role, // Get the role from MongoDB
    })
  );

  return <AdminDashborad user={serializedUser} />;
}
