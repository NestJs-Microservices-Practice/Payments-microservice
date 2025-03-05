import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { envs, SERVICES } from "src/config";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: SERVICES.PAYMENTS_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.host,
          port: envs.port
        }
      }
    ])
  ],
  exports: [
    ClientsModule.register([
      {
        name: SERVICES.PAYMENTS_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.host,
          port: envs.port
        }
      }
    ])
  ]
})
export class TcpPaymentsModule {}