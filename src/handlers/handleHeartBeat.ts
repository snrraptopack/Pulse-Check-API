/**
 *@fileoverview Responsible for handling device heart beat
 */

import type { BunRequest } from "bun"
import { db } from "../db"
import { startTimer } from "../utils/timer"

export async function handleHeartBeat(req: BunRequest<"/monitors/:id/heartbeat">): Promise<Response> {
  const id = req.params.id
  const monitor = db.get(id)

  if (!monitor) {
    return Response.json({error:"Device ID not found"},{status:404})
  }

  if (monitor.status === "down") {
    return Response.json({error:"Cannot heartbeat a down monitor. Manual reset required."},{status:400})
  }

  startTimer(id, monitor.timeout) // reset the timer clock
  monitor.last_ping = Date.now()

  return Response.json({ message: "Timer restarted" },{status:200})
}
