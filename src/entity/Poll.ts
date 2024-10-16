import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Poll {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  question!: string;

  @Column()
  option_one!: string;

  @Column()
  option_two!: string;

  @Column()
  option_three!: string;

  @Column()
  option_four!: string;

  @Column({default: 0})
  option_one_count?: number;

  @Column({default: 0})
  option_two_count?: number;

  @Column({default: 0})
  option_three_count?: number;

  @Column({default: 0})
  option_four_count?: number;

  @Column()
  userId!: string;

  @Column({default: 'Active'})
  status?: string;

  @Column({default: '[]'})
  votedBy?: string; // In a real-world scenario, ensure passwords are hashed
}
