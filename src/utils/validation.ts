/**
 *@fileoverview Serve as a device registration validation utlity
 */

import { type ValidationResult } from "../types"
import { isValidEmail } from "./checkEmail"

export function validateDeviceRegistration(input: any): ValidationResult {

  if (!input || typeof input !== "object") {
    return { success: false, message: "Invalid payload structure" }
  }

  const { id, timeout, alert_email } = input

  if (typeof id !== "string" || id.trim() === "") {
    return { success: false, message: "id must be non-empty string" }
  }

  if (typeof alert_email !== "string" || !isValidEmail(alert_email)) {

    return { success: false, message: "alert_email must be a valid email address" }
  }

  const parsedTimeOut = Number(timeout)

  if (isNaN(parsedTimeOut) || !Number.isInteger(parsedTimeOut) || parsedTimeOut <= 0) {
    return { success: false, message: "timeout must be a positive integer" }
  }

  return {
    success: true,
    data: {
      id: id.trim(),
      timeout: parsedTimeOut,
      alert_email: alert_email.trim().toLowerCase()
    }
  }
}
