/**
 * Defines the health api route.
 * 
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

export async function GET() {
  return Response.json({ message: 'API is running!' })
}
