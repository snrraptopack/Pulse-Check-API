/**
 *@fileoverview Serve as a timer  utlity
 */


import { db, activeTimer } from "../db";

export function startTimer(id: string, timeoutSeconds: number) {
  clearTimer(id) // clears exisiting timer before

  const timer = setTimeout(() => {
    const monitor = db.get(id)

    if (monitor) {
      monitor.status = "down"
      console.log(JSON.stringify({ALERT: `Device ${id} is down`, time: Date.now()}))
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
