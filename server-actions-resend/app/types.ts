import { z } from "zod";

export const formSchema = z.object({
  email: z.string().email(),
  message: z.string().min(3).max(100),
});

export interface FormFields extends z.infer<typeof formSchema> {}
