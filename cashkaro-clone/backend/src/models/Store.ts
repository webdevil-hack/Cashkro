import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Offer } from './Offer';
import { Cashback } from './Cashback';
import { Category } from './Category';

export enum StoreStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  banner: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  affiliateUrl: string;

  @Column({ nullable: true })
  trackingUrl: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  cashbackRate: number;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: false })
  isPopular: boolean;

  @Column({ default: false })
  isNew: boolean;

  @Column({
    type: 'enum',
    enum: StoreStatus,
    default: StoreStatus.ACTIVE,
  })
  status: StoreStatus;

  @Column({ type: 'jsonb', nullable: true })
  cashbackRates: {
    default: number;
    categories: {
      [key: string]: number;
    };
  };

  @Column({ type: 'jsonb', nullable: true })
  terms: string[];

  @Column({ type: 'jsonb', nullable: true })
  howToClaim: string[];

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    affiliateNetwork: string;
    merchantId: string;
    programId: string;
    deepLinkEnabled: boolean;
    cookieDuration: number;
    averageApprovalTime: number;
  };

  @Column({ default: 0 })
  totalClicks: number;

  @Column({ default: 0 })
  totalOrders: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalRevenue: number;

  @Column({ default: 0 })
  priority: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Offer, (offer) => offer.store)
  offers: Offer[];

  @OneToMany(() => Cashback, (cashback) => cashback.store)
  cashbacks: Cashback[];

  @ManyToMany(() => Category, (category) => category.stores)
  @JoinTable({
    name: 'store_categories',
    joinColumn: { name: 'store_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];
}