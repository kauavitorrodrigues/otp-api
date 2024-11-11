import { User } from "@prisma/client";
import { prisma } from "../libs/prisma";

/**
 * Busca um usuário no banco de dados pelo email.
 *
 * @param {string} email - O email do usuário a ser buscado.
 * @returns {Promise<User | null>} Retorna uma promise que retorna um usuário encontrado ou null.
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {

    // Buscar usuário no banco de dados
    const user = await prisma.user.findFirst({
        where: { email}
    })

    return user

}

/**
 * Busca um usuário no banco de dados pelo ID.
 *
 * @param {number} id - O ID do usuário a ser buscado.
 * @returns {Promise<User | null>} Retorna uma promise que retorna um usuário encontrado ou null.
 */
export const getUserById = async (id: number): Promise<User | null> => {

    // Buscar usuário no banco de dados
    const user = await prisma.user.findFirst({
        where: { id }
    })

    return user

}

/**
 * Cria um novo usuário no banco de dados.
 *
 * @param {string} name - O nome do usuário.
 * @param {string} email - O email do usuário.
 * @returns {Promise<User>} O usuário criado.
 */
export const createUser = async (name: string, email: string): Promise<User> => {

    // Criar usuário no banco de dados
    const user = await prisma.user.create({
        data: { name, email }
    })

    return user
    
}