import { getAuth } from '@clerk/nextjs/server';
import Users from '../../../model/Users';
import db from '../../../lib/db';

export default async function handler(req, res) {
  // Connect to the database
  await db();

  // Authenticate the user using Clerk
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: Please log in.' });
  }

  // Extract data from the request body
  const { name, age } = req.body;

  // Validate the data
  if (!name || !age) {
    return res.status(400).json({ error: 'Name and age are required.' });
  }

  try {
    // Create a new user in your database
    const person = new Users({
      clerkUserId: userId, // Associate the Clerk user ID with the database entry
      name: name,
      age: age,
    });

    // Save the user to the database
    await person.save();

    console.log('User saved:', name, age);
    return res.status(200).json({ done: true });
  } catch (error) {
    console.error('Error saving user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
