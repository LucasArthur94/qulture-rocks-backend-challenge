import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { User } from './user.entity'

@Entity()
export class Tag {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ unique: true })
  name: string

  userIds: number[]

  @ManyToMany((type) => User)
  @JoinTable()
  users: User[]

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date
}
