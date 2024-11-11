import { Otp, User } from "@prisma/client"
import { prisma } from "../libs/prisma"
import { v4 as uuid } from "uuid"

/**
 * Gera um código OTP (One-Time Password) para um usuário específico.
 *
 * @param {number} userId - O ID do usuário para o qual o OTP será gerado.
 * @returns {Promise<Otp>} Retorna uma promise que resolve para o objeto OTP criado.
 *
 * O código OTP é um número de 6 dígitos gerado aleatoriamente e tem uma validade de 30 minutos.
 * O OTP gerado é salvo no banco de dados com um ID único, o código OTP, o ID do usuário e a data de expiração.
 */
export const generateOTP = async (userId: number): Promise<Otp> => {

    let otpArray: number[] = []

    for(let i = 0; i < 6; i++) {
        otpArray.push(Math.floor(Math.random() * 9))
    }

    // Gerar código OTP e definir data de expiração
    let code = otpArray.join('')
    let expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 30)

    // Salvar OTP no banco de dados
    const otp = await prisma.otp.create({
        data: {
            id: uuid(),
            code,
            userId,
            expiresAt
        }
    })

    return otp

}

/**
 * Valida um código OTP (One-Time Password) para um usuário específico.
 *
 * @param {string} id - O ID do OTP a ser validado.
 * @param {string} code - O código OTP a ser validado.
 * @returns {Promise<User | false>} Retorna o usuário associado ao OTP ou false. 
 *
 */
export const validateOTP = async (id: string, code: string): Promise<User | false> => {
    
    // Buscar OTP no banco de dados
    const otp = await prisma.otp.findFirst({
        select: {
            user: true
        },
        where: { 
            id, 
            code, 
            expiresAt: { 
                gte: new Date() 
            },
            used: false
        }
    })

    // Marcar OTP como usado e retornar usuário
    if(otp && otp.user) {
        await prisma.otp.update({
            where: { id },
            data: { used: true }
        })
        return otp.user
    }

    return false

}