import verifyUser from "../utils/verifyUser.js";
import { Router } from "express";
import { updateUser ,deleteUser} from "../controllers/userCtrl.js";
const userRouter = Router();

userRouter.put("/update/:id", verifyUser, updateUser);
userRouter.delete("/delete/:id", verifyUser, deleteUser);

export default userRouter;