import { EntityRepository, Repository } from 'typeorm';
import { AuthenticationEntity } from '../entities/authentication.entity';

@EntityRepository(AuthenticationEntity)
export class AuthenticationRepository extends Repository<AuthenticationEntity> {}
