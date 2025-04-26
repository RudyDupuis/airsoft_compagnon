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

  @Column({ type: 'boolean', default: false })
  isVerified!: boolean

  @ManyToMany(() => Game, (game) => game.participants)
  participatingGames!: Game[]
}
