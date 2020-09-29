import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm'

@Entity()
export class Segmentation {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ type: 'date', nullable: true })
  birthDateBefore?: Date

  @Column({ type: 'date', nullable: true })
  birthDateAfter?: Date

  @Column({ type: 'date', nullable: true })
  admissionDateBefore?: Date

  @Column({ type: 'date', nullable: true })
  admissionDateAfter?: Date

  @Column({ type: 'boolean', nullable: true })
  isActive?: boolean

  @Column({ enum: ['male', 'female'], nullable: true })
  sex?: 'male' | 'female'

  @Column({ type: 'timestamptz', nullable: true })
  lastSignInDateBefore?: Date

  @Column({ type: 'timestamptz', nullable: true })
  lastSignInDateAfter?: Date

  @Column({ nullable: true })
  tagId?: number

  parentSegmentationId: number

  @ManyToOne((type) => Segmentation)
  parentSegmentation: Segmentation

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date
}
