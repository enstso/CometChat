import { Test, TestingModule } from '@nestjs/testing';
import { AppResolver } from './app.resolver';
import AppServ
describe('AppController', () => {
  let AppResolver: AppResolver;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [AppService, AppResolver],
    }).compile();

    appController = app.get<AppResolver>(AppResolver);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
