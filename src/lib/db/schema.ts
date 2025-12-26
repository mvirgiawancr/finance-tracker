import {
    pgTable,
    text,
    timestamp,
    decimal,
    boolean,
    date,
    primaryKey,
    integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { AdapterAccountType } from "next-auth/adapters";

// ============ AUTH TABLES (NextAuth) ============

export const users = pgTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    password: text("password"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const accounts = pgTable(
    "account",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccountType>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => [
        primaryKey({ columns: [account.provider, account.providerAccountId] }),
    ]
);

export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (verificationToken) => [
        primaryKey({
            columns: [verificationToken.identifier, verificationToken.token],
        }),
    ]
);

// ============ APP TABLES ============

export const financeAccounts = pgTable("finance_account", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    type: text("type").notNull(), // 'bank', 'e-wallet', 'cash'
    balance: decimal("balance", { precision: 15, scale: 2 }).default("0").notNull(),
    icon: text("icon"),
    color: text("color"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const categories = pgTable("category", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    type: text("type").notNull(), // 'income', 'expense'
    icon: text("icon"),
    color: text("color"),
    keywords: text("keywords"), // comma-separated keywords for auto-categorization
    isDefault: boolean("is_default").default(false).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const transactions = pgTable("transaction", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    accountId: text("account_id")
        .notNull()
        .references(() => financeAccounts.id, { onDelete: "cascade" }),
    categoryId: text("category_id").references(() => categories.id, {
        onDelete: "set null",
    }),
    type: text("type").notNull(), // 'income', 'expense'
    amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
    description: text("description"),
    merchant: text("merchant"),
    transactionDate: date("transaction_date", { mode: "date" }).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const insights = pgTable("insight", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(), // 'monthly_summary', 'spending_alert', 'saving_tip'
    title: text("title").notNull(),
    content: text("content").notNull(),
    period: text("period"), // e.g., '2024-01' for monthly insights
    isRead: boolean("is_read").default(false).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

// ============ RELATIONS ============

export const usersRelations = relations(users, ({ many }) => ({
    financeAccounts: many(financeAccounts),
    categories: many(categories),
    transactions: many(transactions),
    insights: many(insights),
}));

export const financeAccountsRelations = relations(
    financeAccounts,
    ({ one, many }) => ({
        user: one(users, {
            fields: [financeAccounts.userId],
            references: [users.id],
        }),
        transactions: many(transactions),
    })
);

export const categoriesRelations = relations(categories, ({ one, many }) => ({
    user: one(users, {
        fields: [categories.userId],
        references: [users.id],
    }),
    transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
    user: one(users, {
        fields: [transactions.userId],
        references: [users.id],
    }),
    account: one(financeAccounts, {
        fields: [transactions.accountId],
        references: [financeAccounts.id],
    }),
    category: one(categories, {
        fields: [transactions.categoryId],
        references: [categories.id],
    }),
}));

export const insightsRelations = relations(insights, ({ one }) => ({
    user: one(users, {
        fields: [insights.userId],
        references: [users.id],
    }),
}));

// ============ TYPES ============

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type FinanceAccount = typeof financeAccounts.$inferSelect;
export type NewFinanceAccount = typeof financeAccounts.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;

export type Insight = typeof insights.$inferSelect;
export type NewInsight = typeof insights.$inferInsert;
