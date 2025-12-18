import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService], // SHU SATRNI QO'SHING
})
export class UsersModule {}