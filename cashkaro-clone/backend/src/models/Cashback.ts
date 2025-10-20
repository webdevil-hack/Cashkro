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
import { Store } from './Store';

export enum CashbackStatus {
  PENDING = 'pending',
  TRACKED = 'tracked',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  PAID = 'paid',
}

@Entity('cashbacks')
export class Cashback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  transactionId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  purchaseAmount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  cashbackRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cashbackAmount: number;

  @Column({
    type: 'enum',
    enum: CashbackStatus,
    default: CashbackStatus.PENDING,
  })
  status: CashbackStatus;

  @Column({ nullable: true })
  clickId: string;

  @Column({ nullable: true })
  orderId: string;

  @Column({ nullable: true })
  subId: string;

  @Column({ type: 'jsonb', nullable: true })
  orderDetails: {
    items: any[];
    couponUsed: string;
    paymentMethod: string;
  };

  @Column({ nullable: true })
  expectedConfirmDate: Date;

  @Column({ nullable: true })
  confirmedAt: Date;

  @Column({ nullable: true })
  paidAt: Date;

  @Column({ nullable: true })
  cancellationReason: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    userAgent: string;
    ipAddress: string;
    referrer: string;
    affiliateData: any;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.cashbacks)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Store, (store) => store.cashbacks)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column()
  storeId: string;
}