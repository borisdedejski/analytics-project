import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('metrics')
@Index(['metricName', 'timestamp'])
export class Metric {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  metricName!: string;

  @Column({ type: 'float' })
  value!: number;

  @Column({ type: 'jsonb', nullable: true })
  dimensions?: Record<string, any>;

  @Column({ type: 'timestamp' })
  timestamp!: Date;
}

