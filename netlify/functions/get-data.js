export default async (req) => {
  // This function will serve your dashboard data
  // You can query your database (Supabase, Firebase, etc.) here
  
  // For now, return mock data
  const data = {
    entries: [],
    summary: {
      totalAmount: 0,
      entryCount: 0
    }
  };

  return Response.json(data);
};