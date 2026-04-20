import { Controller, Get } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';

@Controller('enrollment')
export class EnrollmentController {
  constructor(private readonly service: EnrollmentService) {}

  @Get()
  getEnrollment() {
    return this.service.getData();
  }
}