import { Injectable } from '@nestjs/common';
import { ConfigService } from 'nestjs-config';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class AppService {
  redisClient;

  get configService() {
    return this.config;
  }

  constructor(
    private readonly config: ConfigService,
    private readonly redisService: RedisService,
  ) {
    this.redisClient = this.redisService.getClient();
  }
}
