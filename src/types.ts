
export type MonitorStatus = 'active' | 'paused' | 'down';

export type Monitor ={
  id: string;
  timeout: number; // Duration in seconds before it fails
  status: MonitorStatus;
  last_ping: number; // Exact timestamp in milliseconds
  alert_email:string
}

export type ValidatedRegistration  = {
  id: string,
  timeout: number
  alert_email:string
}

export type ValidationResult =
  | { success: true, data: ValidatedRegistration }
  | {success:false, message:string}
