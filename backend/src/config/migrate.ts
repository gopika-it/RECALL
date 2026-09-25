import { migrate } from './db.js';

migrate()
  .then(() => {
    console.log('RECALL migrations applied');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Migration failed', err);
    process.exit(1);
  });
