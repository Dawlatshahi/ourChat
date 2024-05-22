import { useStateProvider } from '@/context/StateContext';
import { reducerCases } from '@/context/constants';

import React, { useState } from 'react';
import { BiSearchAlt2 } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaCircle } from 'react-icons/fa';
import { IoArrowBack, IoVideocam } from 'react-icons/io5';
import { MdCall } from 'react-icons/md';
import Avatar from '../common/Avatar';
import ContextMenu from '../common/ContextMenu';

export default function ChatHeader() {
	const [{ userInfo, currentChatUser, onlineUsers }, dispatch] =
		useStateProvider();

	const [contextMenuCoordinates, setContextMenuCoordinates] = useState({
		x: 0,
		y: 0,
	});
	const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);

	const showContextMenu = (e) => {
		e.preventDefault();
		setContextMenuCoordinates({ x: e.pageX - 70, y: e.pageY - 15 });
		setIsContextMenuVisible(true);
	};

	const contextMenuOptions = [
		{
			name: 'Exit',
			callBack: async () => {
				setIsContextMenuVisible(false);
				dispatch({ type: reducerCases.SET_EXIT_CHAT });
			},
		},
	];

	const handleVideoCall = () => {
		dispatch({
			type: reducerCases.SET_VIDEO_CALL,
			videoCall: {
				...currentChatUser,
				type: 'out-going',
				callType: 'video',
				roomId: Date.now(),
			},
		});
	};

	const handleVoiceCall = () => {
		dispatch({
			type: reducerCases.SET_VOICE_CALL,
			voiceCall: {
				...currentChatUser,
				type: 'out-going',
				callType: 'audio',
				roomId: Date.now(),
			},
		});
	};

	return (
		<div className="h-16 px-4 py-3 flex justify-between items-center bg-panel-header-background z-10 mt-0 sm:p-1 dark:bg-gray-200">
			<div className="flex items-center gap-2 sm:gap-6 relative">
				<div className="relative">
					<Avatar type="sm" image={currentChatUser?.profilePicture} />
					{onlineUsers.includes(currentChatUser.id) && (
						<FaCircle
							className="text-green-500 absolute bottom-0 right-0 "
							style={{ fontSize: '0.6rem' }}
						/>
					)}
				</div>
				<div className="flex flex-col">
					<span className="text-primary-strong dark:text-gray-900">
						{currentChatUser?.name}
					</span>
					<span className="text-secondary text-sm">
						{onlineUsers.includes(currentChatUser.id) ? 'online' : 'offline'}
					</span>
				</div>
			</div>
			<div className="flex gap-6">
				<MdCall
					className="text-panel-header-icon cursor-pointer text-xl dark:text-gray-900"
					onClick={handleVoiceCall}
				/>
				<IoVideocam
					className="text-panel-header-icon cursor-pointer text-xl dark:text-gray-900"
					onClick={handleVideoCall}
				/>
				<BiSearchAlt2
					className="text-panel-header-icon cursor-pointer text-xl dark:text-gray-900"
					onClick={() => dispatch({ type: reducerCases.SET_MESSAGES_SEARCH })}
				/>
				<BsThreeDotsVertical
					className="text-panel-header-icon cursor-pointer text-xl dark:text-gray-900"
					onClick={(e) => showContextMenu(e)}
					id="context-opener"
				/>

				{isContextMenuVisible && (
					<ContextMenu
						options={contextMenuOptions}
						coordinates={contextMenuCoordinates}
						contextMenu={isContextMenuVisible}
						setContextMenu={setIsContextMenuVisible}
					/>
				)}
			</div>
		</div>
	);
}
