import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

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

  @Column({ type: 'boolean', default: false })
  isAdmin!: boolean

  @Column({ type: 'boolean', default: false })
  isBanned!: boolean

  @Column({ type: 'timestamptz', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date

  @Column({ type: 'decimal', precision: 2, scale: 1, nullable: true })
  computedReputation!: number | null

  @Column({ type: 'integer', nullable: false, default: 0 })
  gamesPlayedCount!: number
}
