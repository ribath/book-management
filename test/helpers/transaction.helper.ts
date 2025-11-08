import { DataSource, QueryRunner } from 'typeorm';

export class TransactionHelper {
  private queryRunner: QueryRunner;

  constructor(private dataSource: DataSource) {}

  async start(): Promise<void> {
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
  }

  async rollback(): Promise<void> {
    if (this.queryRunner) {
      await this.queryRunner.rollbackTransaction();
      await this.queryRunner.release();
    }
  }
}
