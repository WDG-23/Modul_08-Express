import { z } from 'zod/v4';

const validate = (schema) => (req, res, next) => {
  const { success, error, data } = schema.safeParse(req.body);
  if (!success) {
    const message = z.prettifyError(error);
    throw Error(message, { cause: 400 });
  }
  req.body = data;
  next();
};

export default validate;
