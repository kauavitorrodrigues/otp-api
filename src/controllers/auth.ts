import { RequestHandler } from "express";
import { sendEmail } from "../libs/mailtrap";
import { createJWT } from "../libs/jwt";
import { authSigninSchema } from "../schemas/auth-signin";
import { authSignupSchema } from "../schemas/auth-signup";
import { authUseOtpSchema } from "../schemas/auth-useotp";
import { generateOTP, validateOTP } from "../services/otp";
import { createUser, getUserByEmail } from "../services/user";

/**
 * Handler para o endpoint de login.
 * 
 * Este handler realiza as seguintes operações:
 * 1. Valida os dados recebidos no corpo da request.
 * 2. Verifica se o usuário existe no banco de dados com o email fornecido.
 * 3. Gera um código OTP para o usuário.
 * 4. Envia o código OTP para o email do usuário.
 * 5. Retorna o ID do OTP gerado.
 * 
 * @returns Retorna um JSON com o ID do OTP gerado ou um erro caso ocorra alguma falha.
 */
export const signin: RequestHandler = async (req, res) => {

    // Validar dados recebidos
    const data = authSigninSchema.safeParse(req.body)
    if(!data.success) { 
        res.json({ error: data.error.flatten().fieldErrors }) 
        return
    }

    // Verificar usuário no banco de dados com o email recebido
    const user = await getUserByEmail(data.data.email)
    if(!user) {
        res.json({ error: "Usuário não encontrado!" })
        return
    }

    // Gerar código OTP para o usuário
    const otp = await generateOTP(user.id)

    // Enviar código OTP para o usuário via email
    await sendEmail(
        user.email, 
        `Seu código de verificação é: ${otp.code}`, 
        `Digite seu código: ${otp.code}`
    )

    // Retornar ID do OTP
    res.json({ id: otp.id })

}

/**
 * Handler para a rota de signup.
 * 
 * @returns Retorna uma resposta JSON com os dados do usuário criado ou um erro.
 * 
 * @remarks
 * Este handler realiza as seguintes operações:
 * 1. Valida os dados recebidos no corpo da request.
 * 2. Verifica se já existe um usuário com o email fornecido.
 * 3. Cria um novo usuário no banco de dados.
 * 4. Retorna os dados do usuário criado.
 * 
 * @throws
 * Retorna um erro JSON se os dados de entrada forem inválidos ou se o email já estiver em uso.
 */
export const signup: RequestHandler = async (req, res) => {
    
    // Validar dados recebidos
    const data = authSignupSchema.safeParse(req.body)
    if(!data.success) { 
        res.json({ error: data.error.flatten().fieldErrors }) 
        return
    }

    // Verificar se o usuário já existe
    const user = await getUserByEmail(data.data.email)
    if(user) {
        res.json({ error: "Já existe um usuário com esse email!" })
        return
    }

    // Criar usuário no banco de dados
    const newUser = await createUser(data.data.name, data.data.email)

    // Retornar dados do usuário criado
    res.status(201).json({ user: newUser })

}

/**
 * Handler de requisição para uso de OTP (One-Time Password).
 * 
 * @param req - Objeto de requisição do Express.
 * @param res - Objeto de resposta do Express.
 * 
 * @returns Retorna um token JWT e os dados do usuário se o OTP for válido.
 * 
 */
export const useOTP: RequestHandler = async (req, res) => {
    
    // Validar dados recebidos
    const data = authUseOtpSchema.safeParse(req.body)
    if(!data.success) { 
        res.json({ error: data.error.flatten().fieldErrors }) 
        return
    }

    // Verificar se o OTP existe
    const user = await validateOTP(data.data.id, data.data.code)
    if(!user) {
        res.json({ error: "Código inválido ou expirado!" })
        return
    }

    // Criar o token JWT
    const token = await createJWT(user.id)

    // Retornar o token JWT e os dados do usuário
    res.json({ token, user })

}