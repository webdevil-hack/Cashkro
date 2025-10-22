import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Store } from './Store';

export enum OfferType {
  COUPON = 'coupon',
  DEAL = 'deal',
  CASHBACK = 'cashback',
}

export enum OfferStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  UPCOMING = 'upcoming',
  PAUSED = 'paused',
}

@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: OfferType,
    default: OfferType.COUPON,
  })
  type: OfferType;

  @Column({ nullable: true })
  code: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discount: number;

  @Column({ nullable: true })
  discountType: string; // percentage, fixed, cashback

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  minimumPurchase: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  maximumDiscount: number;

  @Column({ nullable: true })
  validFrom: Date;

  @Column({ nullable: true })
  validTill: Date;

  @Column({ type: 'jsonb', nullable: true })
  terms: string[];

  @Column({ default: false })
  isExclusive: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({
    type: 'enum',
    enum: OfferStatus,
    default: OfferStatus.ACTIVE,
  })
  status: OfferStatus;

  @Column({ default: 0 })
  usageCount: number;

  @Column({ default: 0 })
  successCount: number;

  @Column({ default: 0 })
  priority: number;

  @Column({ type: 'jsonb', nullable: true })
  targetCategories: string[];

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    source: string;
    externalId: string;
    lastVerified: Date;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Store, (store) => store.offers)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column()
  storeId: string;
}