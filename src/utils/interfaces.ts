export interface Env {
  PORT: number;
  LOCAL_DATABASE: string;
  DATABASE: string;
  SECRET_KEY: string;
  TOKEN_EXPIRATION: string;
  HOST: string;
  NODEMAILER_USERNAME: string;
  NODEMAILER_PASSWORD: string;
  NODE_ENV: string;
}
