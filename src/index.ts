import { connect } from 'mongoose';

import { bootstrap } from './app';
import { ENV } from './config';

async function main() {
  await connect(ENV.MONGODB_URL);

  const app = bootstrap();

  app.listen(ENV.PORT);
}

main();
