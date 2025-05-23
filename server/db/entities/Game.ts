import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './User'

export enum GameType {
  DOMINICAL = 'dominical',
  OP = 'op'
}

export enum PrivacyType {
  PRIVATE = 'private',
  PUBLIC = 'public'
}

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'varchar', nullable: false })
  name!: string

  @Column({ type: 'text', nullable: false })
  description!: string

  @Column({ type: 'timestamptz', nullable: false })
  startDateTime!: Date

  @Column({ type: 'timestamptz', nullable: false })
  endDateTime!: Date

  @Column({
    type: 'enum',
    enum: GameType,
    nullable: false
  })
  gameType!: GameType

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: false })
  latitude!: number

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: false })
  longitude!: number

  @Column({ type: 'text', nullable: false })
  address!: string

  @Column({ type: 'text', nullable: false })
  allowedConsumables!: string

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price!: number

  @Column({ type: 'integer', nullable: false })
  minimalReputation!: number

  @Column({ type: 'boolean', default: true })
  allowedNotRated!: boolean

  @Column({ type: 'boolean', default: false })
  hasAmenities!: boolean

  @Column({ type: 'boolean', default: false })
  hasParking!: boolean

  @Column({ type: 'boolean', default: false })
  hasEquipmentRental!: boolean

  @Column({
    type: 'enum',
    enum: PrivacyType,
    default: PrivacyType.PUBLIC
  })
  privacyType!: PrivacyType

  @Column({ type: 'integer', nullable: false })
  maxParticipants!: number

  @ManyToMany(() => User)
  @JoinTable({
    name: 'game_participants',
    joinColumn: { name: 'game_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' }
  })
  participants!: User[]

  @Column({ type: 'timestamptz', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date

  @ManyToOne(() => User, { nullable: false })
  createdBy!: User

  @Column({ type: 'boolean', default: false })
  hasGeneratedRatings!: boolean
}
