/**
 *@fileoverview Serve as a timer  utlity
 */

import { db, activeTimer } from "../db";
import { sendAlertEmail } from "./email";
const API_KEY = Bun.env.RESEND_API_KEY

export function startTimer(id: string, timeoutSeconds: number) {
  clearTimer(id) // clears exisiting timer before

  const timer = setTimeout(() => {
    const monitor = db.get(id)

    if (monitor) {
      monitor.status = "down"
      sendAlertEmail(monitor.alert_email, monitor.id, API_KEY)
    }

    activeTimer.delete(id)
  }, timeoutSeconds * 1000)

  activeTimer.set(id, timer)
}

export function clearTimer(id: string) {
  const existingTimer = activeTimer.get(id)
  if (existingTimer) {
    clearTimeout(existingTimer)
    activeTimer.delete(id)
  }
}
