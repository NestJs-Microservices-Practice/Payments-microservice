import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { envs, SERVICES } from "../config";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: SERVICES.PRODUCT_SERVICE,
        transport: Transport.TCP,
        options: {
          host: "localhost",
          port: 3001
        }
      }
    ])
  ],
  exports: [
    ClientsModule.register([
      {
        name: SERVICES.PRODUCT_SERVICE,
        transport: Transport.TCP,
        options: {
          host: "localhost",
          port: 3001
        }
      }
    ])
  ]
})
export class TcpProductsModule {}