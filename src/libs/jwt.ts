import jwt from "jsonwebtoken";

/**
 * Cria um JSON Web Token (JWT) para o ID de usuário fornecido.
 *
 * @param {number} id - O ID do usuário a ser incluído no payload do JWT.
 * @returns {Promise<string>} Uma promise que resolve para o JWT assinado.
 */
export const createJWT = async (id: number): Promise<string> => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '365 days' })
}