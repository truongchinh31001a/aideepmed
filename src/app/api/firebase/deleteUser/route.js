import { auth } from "lib/firebaseAdmin";

export async function POST(req) {

  try {
    const { uid } = await req.json(); // Parse the JSON request body

    if (!uid) {
      return new Response(JSON.stringify({ message: 'Missing uid.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Delete the user with the provided UID
    await auth.deleteUser(uid);

    // Return a successful response
    return new Response(JSON.stringify({ message: `User ${uid} deleted successfully.` }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    // Handle any errors and return a failure response
    return new Response(JSON.stringify({ message: `Error deleting user: ${error.message}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
