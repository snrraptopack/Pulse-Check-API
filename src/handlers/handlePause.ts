/**
 *@fileoverview Responsible for handling device heart beat
 */

 import type { BunRequest } from "bun";

export async function handlePause(req: BunRequest): Promise<Response>{
  return Response.json({message:"pause endpoint"})
}
