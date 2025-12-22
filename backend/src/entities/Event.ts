import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('events')
@Index(['eventType', 'timestamp'])
@Index(['userId', 'timestamp'])
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  eventType!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  userId?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  sessionId?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ type: 'varchar', length: 100, nullable: true })
  page?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  browser?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  device?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country?: string;

  @CreateDateColumn()
  timestamp!: Date;
}

