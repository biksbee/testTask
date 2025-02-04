import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

(async function bootstrap() {
  const PORT = process.env.PORT || 30110


  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Документация по Flight App Api')
    .setDescription('Документация REST API')
    .setVersion('1.0.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/api/docs', app, document)

  app.enableCors()

  await app.listen(PORT, () => {
    console.log(`Swagger docs: http://localhost:${PORT}/api/docs`)
    console.log(`Listen port ${PORT}`)
  })
})()
