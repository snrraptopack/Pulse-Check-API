import type { Monitor } from "./types";

export const db = new Map<string, Monitor>();

export const activeTimer = new Map<string, ReturnType<typeof setTimeout>>()
