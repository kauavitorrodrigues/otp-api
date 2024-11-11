import { Response } from "express";
import { ExtendedRequest } from "../types/ExtendedRequest";
import { getUserById } from "../services/user";

export const test = async (req: ExtendedRequest, res: Response) => {

    if (!req.userId) {
        res.status(401).send("Acesso Negado");
        return
    }

    const user = await getUserById(req.userId);

    if (!user) {
        res.status(404).send("Acesso Negado");
        return
    }

    res.json({ user })

};