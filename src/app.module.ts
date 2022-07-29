import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { TagModule } from './modules/tag/tag.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import MikroORMOptions from './configs/mikro-orm.config';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    TagModule,
    AuthModule,
    MikroOrmModule.forRoot(MikroORMOptions),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
