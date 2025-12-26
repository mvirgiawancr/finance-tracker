import { z } from "zod";

// ============ ACCOUNT VALIDATIONS ============

export const createAccountSchema = z.object({
    name: z.string().min(1, "Nama akun wajib diisi").max(50),
    type: z.enum(["bank", "e-wallet", "cash"], {
        description: "Tipe akun"
    }),
    balance: z.coerce.number().default(0),
    icon: z.string().optional(),
    color: z.string().optional(),
});

export const updateAccountSchema = createAccountSchema.partial();

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;

// ============ CATEGORY VALIDATIONS ============

export const createCategorySchema = z.object({
    name: z.string().min(1, "Nama kategori wajib diisi").max(50),
    type: z.enum(["income", "expense"], {
        description: "Tipe kategori"
    }),
    icon: z.string().optional(),
    color: z.string().optional(),
    keywords: z.string().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

// ============ TRANSACTION VALIDATIONS ============

export const createTransactionSchema = z.object({
    accountId: z.string().min(1, "Akun wajib dipilih"),
    categoryId: z.string().optional(),
    type: z.enum(["income", "expense"], {
        description: "Tipe transaksi"
    }),
    amount: z.coerce.number().positive("Nominal harus lebih dari 0"),
    description: z.string().optional(),
    merchant: z.string().optional(),
    transactionDate: z.coerce.date(),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const transactionQuerySchema = z.object({
    accountId: z.string().optional(),
    categoryId: z.string().optional(),
    type: z.enum(["income", "expense"]).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    limit: z.coerce.number().min(1).max(100).default(50),
    offset: z.coerce.number().min(0).default(0),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type TransactionQuery = z.infer<typeof transactionQuerySchema>;

// ============ INSIGHT VALIDATIONS ============

export const generateInsightSchema = z.object({
    type: z.enum(["monthly_summary", "spending_alert", "saving_tip"], {
        description: "Tipe insight"
    }),
    period: z.string().optional(), // e.g., '2024-01'
});

export type GenerateInsightInput = z.infer<typeof generateInsightSchema>;

// ============ AUTH VALIDATIONS ============

export const registerSchema = z.object({
    name: z.string().min(2, "Nama minimal 2 karakter").max(50),
    email: z.string().email("Email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
});

export const loginSchema = z.object({
    email: z.string().email("Email tidak valid"),
    password: z.string().min(1, "Password wajib diisi"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
