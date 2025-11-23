import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { WelcomeController } from './welcome.controller';
import { ModulesModule } from './modules/modules.module';

@Module({
  imports: [CommonModule, ModulesModule],
  controllers: [WelcomeController],
  providers: [],
})
export class AppModule {}
