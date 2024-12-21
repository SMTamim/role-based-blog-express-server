import { z } from 'zod';

const blogValidationSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'title is required' }),
    content: z.string({ required_error: 'content is required' }),
  }),
});

export const BlogValidations = {
  blogValidationSchema,
};
