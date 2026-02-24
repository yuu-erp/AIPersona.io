import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly configService: ConfigService) {
    // 1. Lấy connection string từ ConfigService (đã setup ở bước trước)
    const connectionString = configService.get<string>('database.url');

    // 2. Thiết lập Pool kết nối của pg
    const pool = new Pool({ connectionString });

    // 3. Khởi tạo Adapter cho Prisma v7
    const adapter = new PrismaPg(pool);

    // 4. Truyền adapter vào constructor của PrismaClient
    super({ adapter });
  }

  async onModuleInit() {
    // Trong Prisma v7 với Adapter, việc connect sẽ được quản lý tự động tốt hơn,
    // nhưng gọi $connect() vẫn giúp kiểm tra kết nối ngay khi startup.
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
