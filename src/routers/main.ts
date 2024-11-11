import { Router } from "express";
import * as pingController from "../controllers/ping";
import * as authController from "../controllers/auth";
import * as privateController from "../controllers/private";
import { privateJwt } from "../middlewares/auth";

export const mainRouter = Router();

mainRouter.get("/ping", pingController.ping);

mainRouter.post("/auth/signin", authController.signin)
mainRouter.post("/auth/signup", authController.signup)
mainRouter.post("/auth/useotp", authController.useOTP)

mainRouter.get("/private", privateJwt, privateController.test)