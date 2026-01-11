import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IDataSource } from "./data-source.interface";
import { DatabaseDataSource } from "./database.data-source";
import { MockDataSource } from "./mock.data-source";

/**
 * Типы источников данных
 */
export enum DataSourceType {
  DATABASE = "database",
  MOCK = "mock",
}
interface IDataSourceFactory {
  createDataSource(): IDataSource;
}
/**
 * Абстрактная фабрика для создания источников данных
 * Реализует паттерн Abstract Factory
 */
@Injectable()
export abstract class DataSourceFactory implements IDataSourceFactory {
  /**
   * Создать источник данных
   */
  abstract createDataSource(): IDataSource;
}

/**
 * Фабрика для создания источника данных на основе конфигурации
 * Реализует паттерн Factory Method
 */
@Injectable()
export class DataSourceFactoryImpl
  extends DataSourceFactory
  implements IDataSourceFactory
{
  constructor(
    private readonly configService: ConfigService,
    private readonly databaseDataSource: DatabaseDataSource,
    private readonly mockDataSource: MockDataSource,
  ) {
    super();
  }

  createDataSource(): IDataSource {
    const dataSourceType = (this.configService.get<string>(
      "DATA_SOURCE_TYPE",
      "database",
    ) || "database") as DataSourceType;

    switch (dataSourceType) {
      case DataSourceType.MOCK:
        return this.mockDataSource;
      case DataSourceType.DATABASE:
      default:
        return this.databaseDataSource;
    }
  }

  createDataSourceByType(type: DataSourceType): IDataSource {
    switch (type) {
      case DataSourceType.MOCK:
        return this.mockDataSource;
      case DataSourceType.DATABASE:
      default:
        return this.databaseDataSource;
    }
  }
}
