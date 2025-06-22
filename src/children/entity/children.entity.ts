import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('childrens')
export class Children {
  @PrimaryGeneratedColumn()
  id_children: number;

  @Column({ type: 'varchar', length: 100 })
  fullname: string;

  @Column({ length: 100, nullable: true })
  profile_img?: string;
  
  @Column({ type: 'varchar', length: 100 })
  gender: string;

  @Column({ type: 'varchar', length: 100 })
  age_category: string;

  @Column({ type: 'varchar', length: 100 })
  school_day: string;

  @Column({ type: 'time' })
  start_school_time: string;

  @Column({ type: 'time' })
  end_school_time: string;

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @Column({ type: 'int', nullable: true })
  user_id?: number;
}
