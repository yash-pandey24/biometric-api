import { Module } from '@nestjs/common';
import { CsrService } from './csr.service';
import { CsrController } from './csr.controller';

@Module({
  providers: [CsrService],
  controllers: [CsrController],
})
export class CsrModule {}