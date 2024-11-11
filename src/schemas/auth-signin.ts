import { z } from "zod";

export const authSigninSchema = z.object({
    email: z
        .string({ message: "Email é obrigatório" })
        .email("Email inválido")
})