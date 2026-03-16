export default async (req) => {
  const data = await req.json();

  // Validate required fields
  if (!data.type || !data.amount) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Here you'd save to a database (Supabase, Firebase, etc.)
  // For now, just acknowledge receipt
  console.log("Entry received:", data);

  return Response.json({ success: true, message: "Entry saved" });
};