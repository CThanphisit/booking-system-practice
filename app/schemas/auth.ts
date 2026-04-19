import z from "zod";

export const loginSchema = z.object({
  email: z.email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
});

export type FormState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
};
