import { Author } from '../../authors/entities/author.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeUpdate,
} from 'typeorm';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  isbn: string;

  @Column({ type: 'date', nullable: true })
  publishedDate?: Date;

  @Column({ type: 'varchar', nullable: true })
  genre?: string;

  @Column({ type: 'bigint', nullable: false })
  authorId: number;

  @ManyToOne(() => Author, (author) => author.books, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author: Author;

  @Column({
    type: 'bigint',
    default: () => 'EXTRACT(EPOCH FROM now()) * 1000',
  })
  createdAt: number;

  @Column({
    type: 'bigint',
    default: () => 'EXTRACT(EPOCH FROM now()) * 1000',
  })
  updatedAt: number;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = Date.now();
  }
}
