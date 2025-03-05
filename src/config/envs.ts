import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars{
  PORT: number;
  ORDERS_MICROSERVICE_HOST: string;
  STRIPE_SECRET: string;
  SUCCESS_URL: string;
  CANCEL_URL: string;
  SECRET_ENDPOINT: string;
  NATS_SERVERS: string;
}

const envVarsSchema = joi.object({
  PORT: joi.number().required(),
  ORDERS_MICROSERVICE_HOST: joi.string().required(),
  STRIPE_SECRET: joi.string().required(),
  SUCCESS_URL: joi.string().required(),
  CANCEL_URL: joi.string().required(),
  SECRET_ENDPOINT: joi.string().required(),
  NATS_SERVERS: joi.string().required(),
})
.unknown(true);

const { error, value } = envVarsSchema.validate(process.env);


if (error) throw new Error(`Config validation error: ${error.message}`);
const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  host: envVars.ORDERS_MICROSERVICE_HOST,
  stripeSecret: envVars.STRIPE_SECRET,
  successUrl: envVars.SUCCESS_URL,
  cancelUrl: envVars.CANCEL_URL,
  secretEndpoint: envVars.SECRET_ENDPOINT,
  natsServers: envVars.NATS_SERVERS
};