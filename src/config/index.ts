import commonConfig from './common.config';
import databaseConfig from './database.config';
import googleConfig from './google.config';
import jwtConfig from './jwt.config';
import mailConfig from './mail.config';

export default [
  commonConfig,
  jwtConfig,
  databaseConfig,
  googleConfig,
  mailConfig,
];
