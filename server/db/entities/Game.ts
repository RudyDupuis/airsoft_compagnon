import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'varchar', nullable: false })
  name!: string

  @Column({ type: 'varchar' })
  description!: string

  @Column({ type: 'date', nullable: false })
  date!: Date

  @Column({ type: 'int', nullable: false })
  paf!: number
}
