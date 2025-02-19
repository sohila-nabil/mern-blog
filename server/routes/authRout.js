import { Router } from "express";
import { signup } from "../controllers/authCtrl.js";

const authRouter = Router();

authRouter.post("/sign-up", signup);

export default authRouter;
