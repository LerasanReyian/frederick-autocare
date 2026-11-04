import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../server/nest-app.module.js";
import legacyApp, { ready } from "../server/index.js";

let handlerPromise;

async function createHandler() {
  const application = await NestFactory.create(AppModule, { bodyParser: false });
  await ready;
  application.use(legacyApp);
  await application.init();
  return application.getHttpAdapter().getInstance();
}

export default async function handler(request, response) {
  handlerPromise ??= createHandler();
  const application = await handlerPromise;
  return application(request, response);
}
