import { useStateProvider } from '@/context/StateContext';
import { reducerCases } from '@/context/constants';
import { ADD_IMAGE_MESSAGE_ROUTE, ADD_MESSAGE_ROUTE } from '@/utils/ApiRoutes';
import axios from 'axios';
import EmojiPicker from 'emoji-picker-react';
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import { BsEmojiSmile } from 'react-icons/bs';
import { FaMicrophone } from 'react-icons/fa';
import { ImAttachment } from 'react-icons/im';
import { MdSend } from 'react-icons/md';
import { encrypt } from '../../services/encryption.service';
import PhotoPicker from '../common/PhotoPicker';

const CaptureAudio = dynamic(() => import('@/components/common/CaptureAudio'), {
	ssr: false,
});

export default function MessageBar() {
	const [message, setMessage] = useState('');
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [showAudioRecorder, setShowAudioRecorder] = useState(false);
	const [grabImage, setGrabImage] = useState(false);

	const photoPickerOnChange = async (e) => {
		const file = e.target.files[0];

		try {
			const formData = new FormData();
			formData.append('image', file);
			const response = await axios.post(ADD_IMAGE_MESSAGE_ROUTE, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				params: {
					from: userInfo.id,
					to: currentChatUser.id,
				},
			});
			if (response.status === 201) {
				socket.current.emit('send-msg', {
					to: currentChatUser.id,
					from: userInfo.id,
					message: response.data.message,
				});
				dispatch({
					type: reducerCases.ADD_MESSAGE,
					newMessage: {
						...response.data.message,
					},
					fromSelf: true,
				});
			}
		} catch (err) {
			console.log(err);
		}
	};

	const [{ socket, currentChatUser, userInfo }, dispatch] = useStateProvider();
	const sendMessage = async () => {
		if (message.trim().length === 0) {
			return;
		}
		try {
			let encrypted = encrypt(message);
			console.log('Encrypted message size:', encrypted.length);
			setMessage('');
			const { data } = await axios.post(ADD_MESSAGE_ROUTE, {
				to: currentChatUser.id,
				from: userInfo.id,
				message: encrypted,
			});
			socket.current.emit('send-msg', {
				to: currentChatUser.id,
				from: userInfo.id,
				message: data.message,
			});
			data.message.message = message;
			dispatch({
				type: reducerCases.ADD_MESSAGE,
				newMessage: {
					...data.message,
				},
				fromSelf: true,
			});
		} catch (err) {
			console.log('Error sending message:', err);
		}
	};

	const handleEmojiModal = () => {
		setShowEmojiPicker(!showEmojiPicker);
	};

	const handleEmojiClick = (emoji, event) => {
		setMessage((prevMessage) => (prevMessage += emoji.emoji));
	};

	const emojiPickerRef = useRef(null);
	useEffect(() => {
		const handleOutsideClick = (event) => {
			if (event.target.id !== 'emoji-open') {
				if (
					emojiPickerRef.current &&
					!emojiPickerRef.current.contains(event.target)
				) {
					setShowEmojiPicker(false);
				}
			}
		};

		document.addEventListener('click', handleOutsideClick);

		return () => {
			document.removeEventListener('click', handleOutsideClick);
		};
	}, []);

	useEffect(() => {
		setMessage('');
	}, [currentChatUser]);

	useEffect(() => {
		if (grabImage) {
			const data = document.getElementById('photo-picker');
			data.click();
			document.body.onfocus = (e) => {
				setTimeout(() => {
					setGrabImage(false);
				}, 1000);
			};
		}
	}, [grabImage]);

	return (
		<div className="bg-panel-header-background  h-20 px-4 flex items-center gap-6  relative dark:bg-gray-200">
			{!showAudioRecorder && (
				<>
					<div className="flex gap-6">
						<BsEmojiSmile
							className="text-panel-header-icon cursor-pointer text-xl dark:text-black"
							title="Emoji"
							onClick={handleEmojiModal}
							id="emoji-open"
						/>
						{showEmojiPicker && (
							<div
								className="absolute bottom-24 left-16 z-40"
								ref={emojiPickerRef}
							>
								<EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
							</div>
						)}
						<ImAttachment
							className="text-panel-header-icon cursor-pointer text-xl dark:text-black"
							title="Attach"
							onClick={() => setGrabImage(true)}
						/>
					</div>
					<div className="w-full rounded-lg h-10 flex items-center">
						<input
							type="text"
							placeholder="Type message here"
							className="bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg pl-5 pr-5 py-4 w-full dark:bg-gray-50 dark:text-black"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							onKeyPress={(e) => {
								if (e.key === 'Enter') {
									sendMessage();
								}
							}}
						/>
					</div>
					<div className=" w-10 flex items-center justify-center">
						{message.length ? (
							<button onClick={sendMessage}>
								<MdSend
									className="text-panel-header-icon cursor-pointer text-xl dark:text-black"
									title="Send"
								/>
							</button>
						) : (
							<FaMicrophone
								className="text-panel-header-icon cursor-pointer text-xl dark:text-black"
								title="Record"
								onClick={() => setShowAudioRecorder(true)}
							/>
						)}
					</div>
				</>
			)}
			{showAudioRecorder && <CaptureAudio hide={setShowAudioRecorder} />}
			{grabImage && <PhotoPicker onChange={photoPickerOnChange} />}
		</div>
	);
}
