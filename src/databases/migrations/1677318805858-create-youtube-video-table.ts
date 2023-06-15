import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateYouTubeVideoTable1677318805858 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        await queryRunner.createTable(
            new Table({
                name: 'YouTubeVideo',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()'
                    },
                    { name: 'userId', type: 'varchar' },
                    { name: 'title', type: 'varchar' },
                    { name: 'description', type: 'varchar' },
                    { name: 'url', type: 'varchar' },
                    { name: 'thumbnailUrl', type: 'varchar' },
                    { name: 'status', type: 'varchar' },
                    { name: 'createdAt', type: 'timestamp', default: 'now()' },
                    { name: 'updatedAt', type: 'timestamp', default: 'now()' },
                    { name: 'deletedAt', type: 'timestamp', isNullable: true }
                ]
            })
        );

        // create foreign key
        await queryRunner.createForeignKey(
            'YouTubeVideo',
            new TableForeignKey({
                columnNames: ['userId'],
                referencedTableName: 'User',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE'
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('YouTubeVideo');
    }
}
