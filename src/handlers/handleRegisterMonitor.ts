/**
 *@fileoverview Responsible for handling monitor registration
 */

import type { BunRequest } from "bun"
import { validateDeviceRegistration } from "../utils/validation"
import { db } from "../db"
import type { Monitor } from "../types"

export async function handleRegisterMonitor(req: BunRequest<"/monitors">): Promise<Response> {

  if (req.method !== "POST") {
    return Response.json({ error: "Only Post method is allowed" }, { status: 405 })
  }

  let body: any

  try {
    body = await req.json()
  } catch (e) {
    return Response.json({ error: "Invalid JSON body provided" }, { status: 400 })
  }

  const validation = validateDeviceRegistration(body)

  if (!validation.success) {
    return Response.json({ error: validation.message }, { status: 400 })
  }

  const { id, timeout, alert_email } = validation.data

  if (db.has(id)) {
    return Response.json({ error: `Monitor with ID '${id}' already exists` }, { status: 409 });
  }

  const newMonitor: Monitor = {
    id,
    timeout,
    alert_email,
    status: "active",
    last_ping: Date.now()
  }

  db.set(id, newMonitor)

  return Response.json({ message: "Monitor Successfully registered", data: newMonitor }, { status: 201 })

}
