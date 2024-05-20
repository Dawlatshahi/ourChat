import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

import Chat from '@/components/Chat/Chat';
import ChatList from '@/components/Chatlist/ChatList';
import { useStateProvider } from '@/context/StateContext';
import { reducerCases } from '@/context/constants';
import { CHECK_USER_ROUTE, GET_MESSAGES_ROUTE, HOST } from '@/utils/ApiRoutes';
import axios from 'axios';
import { useRouter } from 'next/router';
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
				if (data.message.type == 'text')
					data.message.message = decrypt(data.message.message);
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
			for (var i = 0; i < messages.length; i++) {
				if (messages[i].type == 'text')
					messages[i].message = decrypt(messages[i].message);
			}
			dispatch({ type: reducerCases.SET_MESSAGES, messages });
		};
		if (
			currentChatUser &&
			userContacts.findIndex((contact) => contact.id === currentChatUser.id) !==
				-1
		) {
			getMessages();
		}
	}, [currentChatUser]);

	return (
		<div>
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
				<div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden border border-gray-700 sm:w-auto">
					<ChatList />
					{currentChatUser ? (
						<div
							className={
								messageSearch ? 'grid grid-cols-2' : 'grid-cols-2 flex'
							}
						>
							<Chat />
							{messageSearch && <SearchMessages />}
						</div>
					) : (
						<Empty className=" sm:w-screen" />
					)}
				</div>
			)}
		</div>
	);
}
