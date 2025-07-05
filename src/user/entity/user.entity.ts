import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id_user: number;

  @Column({ length: 100, unique: true })
  username: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 100 })
  password: string;

  @Column({ length: 255, nullable: true })
  google_id?: string;

  @Column({ length: 255, nullable: true })
  facebook_id?: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @Column({ type: 'datetime', nullable: true })
  deleted_at?: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @Column({ length: 100, nullable: true })
  fullname?: string;

  @Column({ length: 100, nullable: true })
  profile_img?: string;

  @Column({ length: 100, nullable: true })
  date_of_birth?: string;

  @Column({ length: 100, nullable: true })
  are_you_a?: string;

  @Column({ length: 100, nullable: true })
  timezone?: string;

  @Column({ type: 'datetime', nullable: true })
  verified_at?: Date;

  @Column({ length: 100, nullable: true })
  step?: string;
}
