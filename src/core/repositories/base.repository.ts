import { AbstractRepository, ObjectLiteral } from 'typeorm';

export abstract class BaseRepository<Entity extends ObjectLiteral> extends AbstractRepository<Entity> {}
