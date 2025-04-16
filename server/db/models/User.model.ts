import { Table, Column, Model, Unique, AllowNull, DataType } from 'sequelize-typescript'

@Table
export class User extends Model {
  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  email!: string

  @AllowNull(false)
  @Column(DataType.STRING)
  passwordHash!: string

  @AllowNull(false)
  @Column(DataType.DATE)
  dateOfBirth!: Date

  @AllowNull(false)
  @Column(DataType.STRING)
  firstName!: string

  @AllowNull(false)
  @Column(DataType.STRING)
  lastName!: string

  @AllowNull(false)
  @Column(DataType.STRING)
  pseudo!: string
}
