import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';

export enum ReferralStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REWARDED = 'rewarded',
  EXPIRED = 'expired',
}

@Entity('referrals')
export class Referral {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  referralCode: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  referrerBonus: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  refereeBonus: number;

  @Column({
    type: 'enum',
    enum: ReferralStatus,
    default: ReferralStatus.PENDING,
  })
  status: ReferralStatus;

  @Column({ nullable: true })
  verifiedAt: Date;

  @Column({ nullable: true })
  rewardedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  conditions: {
    minimumPurchase: number;
    validityDays: number;
    requiresFirstPurchase: boolean;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.referrals)
  @JoinColumn({ name: 'referrer_id' })
  referrer: User;

  @Column()
  referrerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'referee_id' })
  referee: User;

  @Column()
  refereeId: string;
}