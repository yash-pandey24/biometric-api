import { Controller, Get } from '@nestjs/common';
import { CsrService } from './csr.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('CSR')   // shows in Swagger
@Controller('csr')
export class CsrController {
  constructor(private readonly service: CsrService) {}

  @Get()
  getCsr() {
    return this.service.getCsrData();
  }
}