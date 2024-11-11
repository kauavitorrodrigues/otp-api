import { z } from "zod";

export const authSignupSchema = z.object({
    name: z.string({ message: "Nome é obrigatório" }),
    email: z
        .string({ message: "Email é obrigatório" })
        .email("Email inválido")
})