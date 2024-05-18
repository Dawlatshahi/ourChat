import { Router } from 'express';
import multer from 'multer';
import {
	addAudioMessage,
	addImageMessage,
	addMessage,
	deleteMessage,
	getInitialContactsWithMessages,
	getMessages,
} from '../controllers/MessageController.js';

const upload = multer({ dest: 'uploads/recordings/' });
const uploadImage = multer({ dest: 'uploads/images/' });

const router = Router();

router.post('/add-message', addMessage);
router.get('/get-messages/:from/:to', getMessages);
router.get('/get-initial-contacts/:from', getInitialContactsWithMessages);

router.post('/add-audio-message', upload.single('audio'), addAudioMessage);
router.post('/add-image-message', uploadImage.single('image'), addImageMessage);

router.delete('/delete-message/:id', deleteMessage);

export default router;
