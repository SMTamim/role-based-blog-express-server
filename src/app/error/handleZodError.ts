import { ZodError, ZodIssue } from 'zod';
import { TGenericErrorResponse } from '../interface/error';
import config from '../config';

const handleZodError = (error: ZodError): TGenericErrorResponse => {
  const errorSources = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue?.path.length - 1].toString(),
      message: issue.message,
    };
  });

  return {
    statusCode: 400,
    message: 'Validation Error',
    errorSources,
    stack: config.NODE_ENV === 'development' ? error.stack : undefined,
  };
};
export default handleZodError;