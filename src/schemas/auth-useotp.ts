import { z } from "zod";

export const authUseOtpSchema = z.object({
    id: z.string({ message: "ID do OTP é obrigatório" }),
    code: z
        .string({ message: "Código é obrigatório" })
        .length(6, { message: "Código deve ter 6 dígitos" })
})