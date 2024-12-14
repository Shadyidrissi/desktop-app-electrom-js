import { connect } from "../../../lib/db";  // assuming you have this helper function
import Post from "../../../lib/modules/post.module"; // your Post model
import { useAuth } from "@clerk/nextjs";  // for checking user's role

export async function POST(req) {
  const { title, content, city, phone, categorie } = await req.json();
  
  // Ensure the user has the "blogger" role
  const { user } = useAuth();
  if (user?.role !== "blogger") {
    return new Response(
      JSON.stringify({ error: "You don't have permission to create a post." }),
      { status: 403 }
    );
  }

  // Validate incoming data
  if (!title || !content || !city || !phone || !categorie) {
    return new Response(
      JSON.stringify({ error: "All fields are required." }),
      { status: 400 }
    );
  }

  try {
    // Connect to the database
    const { db } = await connect();

    // Create a new post
    const post = await Post.create({
      title,
      content,
      city,
      phone,
      categorie,
      createdBy: user.id, // Using user ID from Clerk or the appropriate field
    });

    return new Response(
      JSON.stringify({ success: true, postId: post._id }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to create post." }),
      { status: 500 }
    );
  }
}
