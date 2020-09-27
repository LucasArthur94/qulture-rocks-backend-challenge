import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { Tag } from './tag.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ unique: true })
  email: string

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column({ type: 'date' })
  birthDate: Date

  @Column({ type: 'date' })
  admissionDate: Date

  @Column({ type: 'boolean' })
  isActive: boolean

  @Column({ enum: ['male', 'female'] })
  sex: 'male' | 'female'

  @Column({ type: 'timestamptz' })
  lastSignInAt: Date

  tagIds: number[]

  @ManyToMany((type) => Tag)
  @JoinTable()
  tags: Tag[]

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date
}
