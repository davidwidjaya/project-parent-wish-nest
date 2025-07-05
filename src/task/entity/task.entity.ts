import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id_task: number;

  @Column({ length: 100, nullable: true })
  task_name: string;


  @Column({ length: 100, nullable: true })
  task_desc: string;

  
  @Column({ length: 100, nullable: true })
  task_category: string;

  
  @Column({ length: 100, nullable: true })
  task_frequntly: string;

  
  @Column({ length: 200, nullable: true })
  task_vidio_url: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @DeleteDateColumn({ type: 'datetime', nullable: true })
  deleted_at?: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: true })
  updated_at?: Date;

  @Column({ type: 'int', nullable: true })
  user_id?: number;

}
