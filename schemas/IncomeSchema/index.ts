// /schemas/expenseSchema.ts (opcionalmente lo podés separar)
import { z } from "zod";

export const IncomeSchema = z.object({
  phone: z.string().min(8), // número de teléfono como ID de usuario
  amount: z.number().positive(),
});

export type IncomeType = z.infer<typeof IncomeSchema>;
