import { type Monitor } from "./types"

/**
 *@fileoverview Serve as a validation utlity
 */

export function validateDeviceRegistration(input: Omit<Monitor, "last_ping" | "status">) {
  if (!input.id || !input.timeout || !input.alert_email) {
    return {success:false, message:"Missing Input or timeout or alert_email field"}
  }

  let result = Number(input.timeout + "")


  if (!input.alert_email.includes("@")) {
    return  {success:false, message: "Invalid alert_email provided"}
  }
  return {success:true}
}
