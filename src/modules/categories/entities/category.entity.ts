import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'bigint', default: 0 })
  parent_id: number;

  @Column({ type: 'tinyint', width: 1, default: 1 })
  is_active: boolean;

  @CreateDateColumn()
  create_dt: Date;

  @UpdateDateColumn()
  update_dt: Date;
}
