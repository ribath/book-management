import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import { Book } from '../../books/entities/book.entity';

@Entity('authors')
export class Author {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ type: 'varchar', nullable: false })
  firstName: string;

  @Column({ type: 'varchar', nullable: false })
  lastName: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ type: 'date', nullable: true })
  birthDate?: Date;

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

  @OneToMany(() => Book, (book) => book.author)
  books: Book[];
}
