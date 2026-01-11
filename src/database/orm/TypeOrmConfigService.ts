import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { User } from "src/users/entities/user.entity";
import { Category } from "src/categories/entities/category.entity";
import { Transaction } from "src/transactions/entities/transaction.entity";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: "postgres",
      host: this.config.get<string>("DATABASE_HOST"),
      port: this.config.get<number>("DATABASE_PORT"),
      username: this.config.get<string>("DATABASE_USER"),
      password: this.config.get<string>("DATABASE_PASSWORD"),
      database: this.config.get<string>("DATABASE_NAME"),
      entities: [User, Category, Transaction],
      autoLoadEntities: this.config.get("NODE_ENV") !== "development",
      synchronize: this.config.get("NODE_ENV") !== "production",
      ssl: false,
    };
  }
}
