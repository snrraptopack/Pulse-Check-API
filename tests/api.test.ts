import { describe, it, expect, beforeEach } from "bun:test";
import { db, activeTimer } from "../src/db";
import { handleRegisterMonitor } from "../src/handlers/handleRegisterMonitor";
import { handleHeartBeat } from "../src/handlers/handleHeartBeat";
import { handlePause } from "../src/handlers/handlePause";
import { handleGetMonitors } from "../src/handlers/handleGetMonitors";

describe("Pulse Check API State & Handlers", () => {
  beforeEach(() => {
    // Teardown: clear the db and timers before each test to ensure isolation
    for (const id of activeTimer.keys()) {
      clearTimeout(activeTimer.get(id));
    }
    activeTimer.clear();
    db.clear();
  });

  it("should register a monitor successfully and start the timer", async () => {
    const mockReq = {
      method: "POST",
      json: async () => ({ id: "test-device", timeout: 60, alert_email: "test@domain.com" })
    } as any;

    const res = await handleRegisterMonitor(mockReq);
    expect(res.status).toBe(201);
    
    // Verify State Updates
    expect(db.has("test-device")).toBe(true);
    expect(db.get("test-device")?.status).toBe("active");
    expect(activeTimer.has("test-device")).toBe(true);
  });

  it("should fail to register an invalid payload (missing timeout)", async () => {
    const mockReq = {
      method: "POST",
      json: async () => ({ id: "test-device", alert_email: "test@domain.com" })
    } as any;

    const res = await handleRegisterMonitor(mockReq);
    expect(res.status).toBe(400);
    expect(db.has("test-device")).toBe(false);
  });

  it("should successfully pause a monitor and securely clear its timer", async () => {
    // 1. Manually setup the state
    db.set("test-device", { id: "test-device", timeout: 60, alert_email: "test@domain.com", status: "active", last_ping: Date.now() });
    activeTimer.set("test-device", setTimeout(() => {}, 60000));

    const mockReq = {
      params: { id: "test-device" }
    } as any;

    // 2. Perform the pause action
    const res = await handlePause(mockReq);
    expect(res.status).toBe(200);
    
    // 3. Verify the pause effect
    expect(db.get("test-device")?.status).toBe("paused");
    expect(activeTimer.has("test-device")).toBe(false);
  });

  it("should restart timer on heartbeat and switch status from paused to active", async () => {
    // 1. Setup a snoozed device
    db.set("test-device", { id: "test-device", timeout: 60, alert_email: "test@domain.com", status: "paused", last_ping: Date.now() });

    const mockReq = {
      params: { id: "test-device" }
    } as any;

    // 2. Heartbeat the device
    const res = await handleHeartBeat(mockReq);
    expect(res.status).toBe(200);
    
    // 3. Verify it auto-recovered
    expect(db.get("test-device")?.status).toBe("active");
    expect(activeTimer.has("test-device")).toBe(true);
  });

  it("should reject a heartbeat if the device is legally marked as 'down'", async () => {
    // 1. Setup a broken device
    db.set("test-device", { id: "test-device", timeout: 60, alert_email: "test@domain.com", status: "down", last_ping: Date.now() });

    const mockReq = {
      params: { id: "test-device" }
    } as any;

    // 2. Heartbeat the device
    const res = await handleHeartBeat(mockReq);
    
    // 3. It should fail to heartbeat
    expect(res.status).toBe(400);
    expect(activeTimer.has("test-device")).toBe(false);
  });

  it("should return all monitors on GET /monitors", async () => {
    // 1. Setup multiple records
    db.set("test-1", { id: "test-1", timeout: 60, alert_email: "t1@domain.com", status: "active", last_ping: Date.now() });
    db.set("test-2", { id: "test-2", timeout: 30, alert_email: "t2@domain.com", status: "paused", last_ping: Date.now() });
    
    const mockReq = {
      method: "GET"
    } as any;

    // 2. Execute GET
    const res = await handleGetMonitors(mockReq);
    expect(res.status).toBe(200);
    
    // 3. Verify output
    const body = await res.json() as any;
    expect(body.total).toBe(2);
    expect(body.data[0].id).toBe("test-1");
  });
});
