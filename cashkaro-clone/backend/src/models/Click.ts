import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('clicks')
@Index(['userId', 'storeId', 'createdAt'])
export class Click {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  clickId: string;

  @Column()
  userId: string;

  @Column()
  storeId: string;

  @Column({ nullable: true })
  offerId: string;

  @Column()
  redirectUrl: string;

  @Column({ nullable: true })
  subId: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    userAgent: string;
    ipAddress: string;
    referrer: string;
    device: string;
    browser: string;
    os: string;
    country: string;
    city: string;
  };

  @Column({ default: false })
  converted: boolean;

  @Column({ nullable: true })
  conversionTime: Date;

  @CreateDateColumn()
  createdAt: Date;
}