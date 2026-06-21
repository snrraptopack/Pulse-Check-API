import { handleHeartBeat } from "./handlers/handleHeartBeat"
import { handlePause } from "./handlers/handlePause"
import { handleRegisterMonitor } from "./handlers/handleRegisterMonitor"

const server = Bun.serve({
  port: 8085,
  routes: {
    "/monitors": handleRegisterMonitor,
    "/monitors/:id/heartbeat": handleHeartBeat,
    "/monitors/:id/pause": handlePause,

    "/*": (e) => Response.json({ error: "Resource Not found" }, { status: 404 })
  }
})

console.log(`Server is running on ${server.url}`)
