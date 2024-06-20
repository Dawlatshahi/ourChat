import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

import ThemeToggle from '@/ThemeToggle';
import Chat from '@/components/Chat/Chat';
import ChatList from '@/components/Chatlist/ChatList';
import { useStateProvider } from '@/context/StateContext';
import { reducerCases } from '@/context/constants';
import { CHECK_USER_ROUTE, GET_MESSAGES_ROUTE, HOST } from '@/utils/ApiRoutes';
import axios from 'axios';
import { useRouter } from 'next/router';
import { IoMdArrowBack, IoMdChatbubbles } from 'react-icons/io';
import { IoLogoWechat } from 'react-icons/io5';
import { decrypt } from '../services/encryption.service';
import { firebaseAuth } from '../utils/FirebaseConfig';
import VideoCall from './Call/VideoCall';
import VoiceCall from './Call/VoiceCall';
import SearchMessages from './Chat/SearchMessages';
import Empty from './Empty';
import IncomingCall from './common/IncomingCall';
import IncomingVideoCall from './common/IncomingVideoCall';

export default function Main() {
	const [
		{
			userInfo,
			currentChatUser,
			videoCall,
			voiceCall,
			incomingVoiceCall,
			incomingVideoCall,
			messageSearch,
			userContacts,
		},
		dispatch,
	] = useStateProvider();
	const router = useRouter();
	const socket = useRef();
	const [redirectLogin, setRedirectLogin] = useState(false);
	const [socketEvent, setSocketEvent] = useState(false);
	const [isChatListVisible, setIsChatListVisible] = useState(true);
	const [isSmallScreen, setIsSmallScreen] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			setIsSmallScreen(window.innerWidth < 768);
		};
		handleResize();
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	useEffect(() => {
		if (redirectLogin) router.push('/login');
	}, [redirectLogin]);

	onAuthStateChanged(firebaseAuth, async (currentUser) => {
		if (!currentUser) setRedirectLogin(true);
		if (!userInfo && currentUser?.email) {
			const { data } = await axios.post(CHECK_USER_ROUTE, {
				email: currentUser.email,
			});
			if (!data.status) {
				router.push('/login');
			}

			dispatch({
				type: reducerCases.SET_USER_INFO,
				userInfo: {
					id: data?.data?.id,
					email: data?.data?.email,
					name: data?.data?.name,
					profileImage: data?.data?.profilePicture,
					status: data?.data?.about,
				},
			});
		}
	});

	useEffect(() => {
		if (userInfo) {
			socket.current = io(HOST);
			socket.current.emit('add-user', userInfo.id);
			dispatch({ type: reducerCases.SET_SOCKET, socket });
		}
	}, [userInfo]);

	useEffect(() => {
		if (socket.current && !socketEvent) {
			socket.current.on('msg-recieve', (data) => {
				if (data.message.type === 'text') {
					data.message.message = decrypt(data.message.message);
				}
				dispatch({
					type: reducerCases.ADD_MESSAGE,
					newMessage: {
						...data.message,
					},
				});
			});

			socket.current.on('online-users', ({ onlineUsers }) => {
				dispatch({
					type: reducerCases.SET_ONLINE_USERS,
					onlineUsers,
				});
			});

			socket.current.on('mark-read-recieve', ({ id, recieverId }) => {
				dispatch({
					type: reducerCases.SET_MESSAGES_READ,
					id,
					recieverId,
				});
			});

			socket.current.on('incoming-voice-call', ({ from, roomId, callType }) => {
				dispatch({
					type: reducerCases.SET_INCOMING_VOICE_CALL,
					incomingVoiceCall: { ...from, roomId, callType },
				});
			});

			socket.current.on('voice-call-rejected', () => {
				dispatch({
					type: reducerCases.SET_INCOMING_VOICE_CALL,
					incomingVoiceCall: undefined,
				});
				dispatch({
					type: reducerCases.SET_VOICE_CALL,
					voiceCall: undefined,
				});
			});

			socket.current.on('incoming-video-call', ({ from, roomId, callType }) => {
				dispatch({
					type: reducerCases.SET_INCOMING_VIDEO_CALL,
					incomingVideoCall: { ...from, roomId, callType },
				});
			});

			socket.current.on('video-call-rejected', () => {
				dispatch({
					type: reducerCases.SET_INCOMING_VIDEO_CALL,
					incomingVideoCall: undefined,
				});
				dispatch({
					type: reducerCases.SET_VIDEO_CALL,
					videoCall: undefined,
				});
			});

			setSocketEvent(true);
		}
	}, [socket.current]);

	useEffect(() => {
		const getMessages = async () => {
			const {
				data: { messages },
			} = await axios.get(
				`${GET_MESSAGES_ROUTE}/${userInfo.id}/${currentChatUser.id}`
			);
			for (let i = 0; i < messages.length; i++) {
				if (messages[i].type === 'text') {
					messages[i].message = decrypt(messages[i].message);
				}
			}
			dispatch({ type: reducerCases.SET_MESSAGES, messages });
		};
		if (
			currentChatUser &&
			userContacts.findIndex((contact) => contact.id === currentChatUser.id) !==
				-1
		) {
			getMessages();
			if (window.innerWidth < 768) {
				setIsChatListVisible(false);
			}
		}
	}, [currentChatUser]);

	const toggleChatListVisibility = () => {
		setIsChatListVisible(!isChatListVisible);
	};

	return (
		<div className="dark:bg-white bg-panel-header-background min-w-screen sm:w-auto">
			{!voiceCall && !videoCall && (
				<div className="flex flex-1 justify-between dark:bg-gray-200 bg-panel-header-background h-[6vh] p-2 pt-2 border dark:border-gray-300 border-gray-700 w-screen sm:w-auto pr-4 ">
					<button
						className="flex items-center sm:block md:hidden text-white dark:text-black mt-1"
						onClick={toggleChatListVisibility}
					>
						{isChatListVisible ? (
							<div className="flex items-center">
								<IoMdArrowBack className="h-6 w-6 mr-1" />
							</div>
						) : (
							<div className="flex items-center">
								<IoMdChatbubbles className="h-6 w-6 mr-1" />
								<span className="text-sm">Chat List</span>
							</div>
						)}
					</button>
					<IoLogoWechat className="text-gray-400 h-8 w-auto dark:text-gray-600 pl-8" />
					<div className="mt-1">
						<ThemeToggle className="" />
					</div>
				</div>
			)}
			{incomingVoiceCall && <IncomingCall />}
			{incomingVideoCall && <IncomingVideoCall />}

			{videoCall && (
				<div className="h-screen w-screen max-h-full max-w-full overflow-hidden">
					<VideoCall />
				</div>
			)}
			{voiceCall && (
				<div className="h-screen w-screen max-h-full max-w-full overflow-hidden">
					<VoiceCall />
				</div>
			)}
			{!videoCall && !voiceCall && (
				<div className="grid md:grid-cols-main sm:grid-cols-1 w-screen max-w-screen lg:w-auto md:w-auto sm:w-auto">
					{isChatListVisible || (currentChatUser && !isSmallScreen) ? (
						<ChatList className="block md:block sm:hidden" />
					) : null}
					{!isChatListVisible || currentChatUser ? (
						<div
							className={
								messageSearch ? 'grid grid-cols-2 w-full' : 'grid-cols-1 '
							}
						>
							{currentChatUser ? <Chat /> : <Empty />}
							{messageSearch && <SearchMessages />}
						</div>
					) : (
						!currentChatUser && <Empty />
					)}
				</div>
			)}
		</div>
	);
}
