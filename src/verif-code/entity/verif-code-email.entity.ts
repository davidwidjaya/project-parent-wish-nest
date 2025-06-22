// verif-code-email.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('verif_code_email')
export class VerifCodeEmail {
  @PrimaryGeneratedColumn()
  id_verif_code_email: number;

  @Column()
  code: number;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @DeleteDateColumn({ type: 'datetime', nullable: true })
  deleted_at?: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: true })
  updated_at?: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  expired_at?: string;

  @Column({ type: 'int', nullable: true })
  user_id?: number;
}
