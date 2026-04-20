import { Controller, Get } from '@nestjs/common';
import { DeletedService } from './deleted.service';

@Controller('deleted')
export class DeletedController {
  constructor(private readonly service: DeletedService) {}

  @Get()
  getDeleted() {
    return this.service.getAll();
  }
}