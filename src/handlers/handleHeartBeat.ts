/**
 *@fileoverview Responsible for handling device heart beat
 */

import type { BunRequest } from "bun"

export async function handleHeartBeat(req: BunRequest<"/monitors/:id/heartbeat">): Promise<Response> {
  return Response.json({ message: "heart beat endpoint" })
}
