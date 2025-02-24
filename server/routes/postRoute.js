import {Router} from 'express';
import { createPost,getposts } from '../controllers/postCtrl.js';
import verifyUser from '../utils/verifyUser.js';
const postRouter = Router();

postRouter.post('/create', verifyUser,createPost);
postRouter.get('/getposts', getposts);

export default postRouter;