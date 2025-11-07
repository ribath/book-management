import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateBooksTable1762184873370 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'books',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'isbn',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'publishedDate',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'genre',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'authorId',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'bigint',
            default: `EXTRACT(EPOCH FROM now()) * 1000`,
          },
          {
            name: 'updatedAt',
            type: 'bigint',
            default: `EXTRACT(EPOCH FROM now()) * 1000`,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'books',
      new TableForeignKey({
        columnNames: ['authorId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'authors',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('books');
    const foreignKey = table!.foreignKeys.find((fk) =>
      fk.columnNames.includes('authorId'),
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('books', foreignKey);
    }

    await queryRunner.dropTable('books');
  }
}
