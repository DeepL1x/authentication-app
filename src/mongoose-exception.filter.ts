import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch()
export class MongooseExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    let status = HttpStatus.BAD_REQUEST;
    console.log(exception);

    switch (exception.code) {
      case 11000:
        status = HttpStatus.CONFLICT;
        response.status(status).json({
          statusCode: status,
          message: 'MongoDB Error',
          error: 'Duplicate key',
        });
        return;
      default:
        response.status(status).json({
          statusCode: status,
          message: exception.message,
          error: exception.message,
        });
    }
  }
}
