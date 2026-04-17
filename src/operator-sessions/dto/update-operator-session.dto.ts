import { PartialType } from '@nestjs/mapped-types';
import { CreateOperatorSessionDto } from './create-operator-session.dto';

export class UpdateOperatorSessionDto extends PartialType(CreateOperatorSessionDto) {}