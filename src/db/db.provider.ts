import { Provider } from '@nestjs/common';
import { db } from './db';

export const DRIZZLE_DB = 'DRIZZLE_DB';

export const DbProvider: Provider = {
  provide: DRIZZLE_DB,
  useValue: db,
};