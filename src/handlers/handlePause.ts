/**
 *@fileoverview Responsible for handling device heart beat
 */

import type { BunRequest } from "bun";
import { db } from "../db";
import { clearTimer } from "../utils/timer";

export async function handlePause(req: BunRequest<"/monitors/:id/pause">): Promise<Response>{
  const id = req.params.id
  const monitor = db.get(id)

  if (!monitor) {
    return Response.json({error:"Device not found"},{status:404})
  }

  if (monitor.status === "down") {
    return Response.json({error:"Can not pause a broken device"},{status:400})
  }

  if (monitor.status === "paused") {
      return Response.json({message:"Monitor paused already"},{status:200})
  }
  clearTimer(id) // stops the countdown

  monitor.status = "paused"

  return Response.json({message:"Monitor paused successfully"},{status:200})
}
