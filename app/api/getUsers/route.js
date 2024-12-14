import User from "../../../lib/modules/user.module";  // Assuming User model exists

export async function GET(req) {
  try {
    const users = await User.find();
    return new Response(
      JSON.stringify(users),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch users" }),
      { status: 500 }
    );
  }
}
