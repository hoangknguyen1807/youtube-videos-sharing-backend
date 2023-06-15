import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserTable1677143444403 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        await queryRunner.createTable(
            new Table({
                name: 'User',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()'
                    },
                    { name: 'email', type: 'varchar', isUnique: true },
                    { name: 'password', type: 'varchar', isNullable: true },
                    { name: 'refreshToken', type: 'varchar', isNullable: true },
                    { name: 'lastLoginAt', type: 'timestamp', isNullable: true },
                    { name: 'createdAt', type: 'timestamp', default: 'now()' },
                    { name: 'updatedAt', type: 'timestamp', default: 'now()' },
                    { name: 'deletedAt', type: 'timestamp', isNullable: true }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('User');
    }
}
