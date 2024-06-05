import { Router } from 'express';
import {
	checkUser,
	generateToken,
	getAllUsers,
	onBoardUser,
	updateProfile,
} from '../controllers/AuthController.js';

const router = Router();

router.post('/check-user', checkUser);
router.post('/onBoardUser', onBoardUser);
router.get('/get-contacts', getAllUsers);
router.get('/generate-token/:userId', generateToken);
router.post('/update-profile', updateProfile);

export default router;
