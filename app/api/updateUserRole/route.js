import User from "../../../lib/modules/user.module";  // Assuming User model exists

export async function POST(req) {
  const { userId, newRole } = await req.json();

  try {
    const user = await User.findById(userId);
    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404 }
      );
    }

    user.role = newRole;
    await user.save();

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to update user role" }),
      { status: 500 }
    );
  }
}
