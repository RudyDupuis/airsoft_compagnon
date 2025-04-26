import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './User'

export enum GameType {
  DOMINICAL = 'dominical',
  OP = 'op'
}

export enum ValidationType {
  AUTO = 'auto',
  MANUAL = 'manual'
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

  @Column({ type: 'text', nullable: true })
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

  @Column({ type: 'text', nullable: true })
  allowedConsumables!: string

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price!: number

  @Column({
    type: 'enum',
    enum: ValidationType,
    default: ValidationType.MANUAL
  })
  validationType!: ValidationType

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
  maxPlayers!: number

  @ManyToMany(() => User)
  @JoinTable({
    name: 'game_participants',
    joinColumn: { name: 'game_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' }
  })
  participants!: User[]
}
