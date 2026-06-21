import type { Monitor } from "./types"
import { validateDeviceRegistration } from "./validation"

const server = Bun.serve({
  port: 8085,
  routes: {
    "/monitors": (req) => {

      if (req.method !== "POST") {
        return Response.json({ error: "only Post method allowed" })
      }

      const body = req.body?.json()
      if (!body) {
         return Response.json({error:"No body provided"})
      }

      const valdatebody = validateDeviceRegistration(body as Monitor)

      if (!valdatebody.success) {
        return Response.json({error:valdatebody.message})
      }
      return Response.json({data:"hello"})
    },
    "/*": (e) => {
      let request = e.body
      console.log(request)
      return Response.json({error:"not found"})
    }
  }
})

console.log(`Server is running on ${server.url}`)
