import { MailtrapClient } from "mailtrap"

/**
 * Envia um email usando o serviço Mailtrap.
 *
 * @param {string} to - O endereço de email do destinatário.
 * @param {string} subject - O assunto do email.
 * @param {string} body - O corpo do email.
 * @returns {Promise<boolean>} Retorna uma promessa que resolve para true se o email for enviado com sucesso, ou false se ocorrer um erro.
 */
export const sendEmail = async (to: string, subject: string, body: string): Promise<boolean> => {

    const mailtrap = new MailtrapClient({
        token: process.env.MAILTRAP_TOKEN as string,
        testInboxId: 3269411
    })

    try {
        await mailtrap.testing.send({
            from: { name: "FLOWE", email: "suporte@flowe.com"},
            to: [{ email: to }],
            subject,
            text: body
        })
        return true
    } catch (err) {
        return false
    }

}