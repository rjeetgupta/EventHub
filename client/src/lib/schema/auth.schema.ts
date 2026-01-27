import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters"),
  email: z
    .email("Invalid email address"),
  studentID: z
    .string().min(5, "Student ID is required"),
  departmentId: z
    .uuid("Please select your department"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
  confirmNewPassword: z.string(),
}).refine(
  (data) => data.newPassword === data.confirmNewPassword,
  {
    path: ["confirmNewPassword"],
    message: "Passwords do not match",
  }
);


export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;