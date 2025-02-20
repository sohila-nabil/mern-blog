import { Router } from "express";
import {
  signup,
  signin,
  signWithGoogle,
  signout,
} from "../controllers/authCtrl.js";

const authRouter = Router();

authRouter.post("/sign-up", signup);
authRouter.post("/sign-in", signin);
authRouter.post("/google", signWithGoogle);
authRouter.post("/sign-out", signout);

export default authRouter;
