// /schemas/expenseSchema.ts (opcionalmente lo podés separar)
import { z } from "zod";

export const ExpenseSchema = z.object({
  phone: z.string().min(8), // número de teléfono como ID de usuario
  amount: z.number().positive(),
  category: z.string().min(1),
  description: z.string().optional(),
  date: z.string().transform((val) => new Date(val)), // ISO date desde el frontend
});

export type ExpenseType = z.infer<typeof ExpenseSchema>;
