
export type MonitorStatus = 'active' | 'paused' | 'down';

export type Monitor ={
  id: string;
  timeout: number; // Duration in seconds before it fails
  status: MonitorStatus;
  last_ping: number; // Exact timestamp in milliseconds
  alert_email:String
}
