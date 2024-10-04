import { auth } from "lib/firebaseAdmin"; // Ensure your Firebase admin setup is correct

export async function POST(req) {
  try {
    const { uid, newPassword } = await req.json(); // Parse the JSON request body

    if (!uid || !newPassword) {
      return new Response(JSON.stringify({ message: 'Missing uid or newPassword.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update the user's password
    await auth.updateUser(uid, { password: newPassword });

    // Return a successful response
    return new Response(JSON.stringify({ message: 'Password updated successfully.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    // Handle errors and return a failure response
    return new Response(JSON.stringify({ message: `Error updating password: ${error.message}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
