import { NextFunction, Response } from "express";
import { ExtendedRequest } from "../types/ExtendedRequest";
import jwt from "jsonwebtoken";

/**
 * Middleware para verificar o JWT (JSON Web Token) em uma requisição.
 * 
 * @param req - O objeto de requisição estendido que contém os headers e outras informações.
 * @param res - O objeto de resposta que será usado para enviar a resposta ao cliente.
 * @param next - A função de callback que passa o controle para o próximo middleware.
 * 
 * @returns Retorna uma resposta com status 401 e uma mensagem de erro se o token não for fornecido ou for inválido.
 * 
 * @remarks
 * Este middleware verifica o header de autorização da requisição para um token JWT.
 * Se o token for válido, o ID do usuário será anexado ao objeto de requisição e o controle será passado para o próximo middleware.
 * Caso contrário, uma resposta de acesso negado será enviada.
 */
export const privateJwt = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    
    const authHeader = req.headers["authorization"]

    if (!authHeader) {
        res.status(401).json({ error: "Acesso Negado" })
        return
    }

    const token = authHeader.split(" ")[1]

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded: any) => {

        if (err) {
            return res.status(401).json({ error: "Acesso Negado" })
        }

        req.userId = decoded.id
        next()
        
    })

}