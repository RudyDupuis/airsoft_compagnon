import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm'
import { Game } from './Game'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'varchar', unique: true, nullable: false })
  email!: string

  @Column({ type: 'varchar', nullable: false })
  passwordHash!: string

  @Column({ type: 'timestamptz', nullable: false })
  dateOfBirth!: Date

  @Column({ type: 'varchar', nullable: false })
  firstName!: string

  @Column({ type: 'varchar', nullable: false })
  lastName!: string

  @Column({ type: 'varchar', nullable: false })
  pseudo!: string

  @Column({ type: 'decimal', precision: 2, scale: 1, nullable: true })
  reputation!: number

  @Column({ type: 'boolean', default: false })
  isVerified!: boolean

  @Column({ type: 'boolean', default: false })
  isAdmin!: boolean

  @Column({ type: 'boolean', default: false })
  isBanned!: boolean

  @Column({ type: 'timestamptz', nullable: false })
  createdAt!: Date

  @Column({ type: 'integer', nullable: false })
  gamesPlayed!: number

  @ManyToMany(() => Game, (game) => game.participants)
  participatingGames!: Game[]
}
