import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: 'Anonymous' })
  role!: string;

  @Column({ unique: true, nullable: true})
  username?: string;

  @Column({nullable: true})
  password?: string; // In a real-world scenario, ensure passwords are hashed
}
