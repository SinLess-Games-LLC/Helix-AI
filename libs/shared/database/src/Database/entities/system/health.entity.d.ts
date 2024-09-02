import { BaseEntity } from '../base.entity'
export declare class Health extends BaseEntity {
  systemStatus: string
  systemVersion: string
  systemUptime: string
  systemCPU: string
  systemMemory: string
  latency: string
  day: Date
}
