import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbProvider } from './db.provider';

@Global()
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [DbProvider],
  exports: [DbProvider],
})
export class DbModule {}