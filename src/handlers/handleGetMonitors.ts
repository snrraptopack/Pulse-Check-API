/**
 *@fileoverview Responsible for retrieving all registered monitors
 */

import type { BunRequest } from "bun";
import { db } from "../db";

export async function handleGetMonitors(req: BunRequest<"/monitors">): Promise<Response> {
  const monitorsArray = Array.from(db.values());

  return Response.json({
    total: monitorsArray.length,
    data: monitorsArray
  }, { status: 200 });
}
