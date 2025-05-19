import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm'
import { User } from './User'
import { Game } from './Game'

@Entity()
@Unique(['game', 'fromUser', 'toUser'])
export class Rating {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => Game, { nullable: false, onDelete: 'CASCADE' })
  game!: Game

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  fromUser!: User

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  toUser!: User

  @Column({ type: 'decimal', precision: 2, scale: 1, nullable: true })
  rate!: number | null

  @Column({ type: 'timestamptz', nullable: true })
  ratedAt!: Date | null

  @Column({ type: 'timestamptz', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date
}
