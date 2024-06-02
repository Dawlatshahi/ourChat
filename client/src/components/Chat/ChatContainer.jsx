import { useStateProvider } from '@/context/StateContext';
import { DELETE_MESSAGE_ROUTE } from '@/utils/ApiRoutes';
import { calculateTime } from '@/utils/CalculateTime';
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import { BsTrash } from 'react-icons/bs';
import MessageStatus from '../common/MessageStatus';
import ImageMessage from './ImageMessage';

const VoiceMessage = dynamic(() => import('@/components/Chat/VoiceMessage'), {
	ssr: false,
});

export default function ChatContainer() {
	const [{ messages, currentChatUser, userInfo, dispatch }] =
		useStateProvider();

	const containerRef = useRef(null);
	const [isInitialLoad, setIsInitialLoad] = useState(true);

	const [displayedMessages, setDisplayedMessages] = useState([]);
	const [page, setPage] = useState(1);
	const MESSAGES_PER_PAGE = 15;

	useEffect(() => {
		setDisplayedMessages(messages.slice(-MESSAGES_PER_PAGE));
		setPage(1);
		setIsInitialLoad(true);
	}, [messages]);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const handleScroll = () => {
			if (
				container.scrollTop === 0 &&
				displayedMessages.length < messages.length
			) {
				loadAllMessages();
			}
		};

		container.addEventListener('scroll', handleScroll);
		return () => {
			container.removeEventListener('scroll', handleScroll);
		};
	}, [displayedMessages]);

	const loadAllMessages = () => {
		const container = containerRef.current;
		if (!container) return;

		const previousScrollHeight = container.scrollHeight;
		const previousScrollTop = container.scrollTop;
		const wasAtBottom =
			container.scrollHeight - container.clientHeight <=
			container.scrollTop + 1;

		setDisplayedMessages((prevMessages) => {
			const newMessages = messages.slice(
				0,
				messages.length - prevMessages.length
			);
			const updatedMessages = [...newMessages, ...prevMessages];

			setTimeout(() => {
				if (wasAtBottom) {
					container.scrollTop = container.scrollHeight - container.clientHeight;
				} else {
					container.scrollTop =
						previousScrollTop + (container.scrollHeight - previousScrollHeight);
				}
			}, 0);

			return updatedMessages;
		});

		setPage((prevPage) => prevPage + 1);
	};

	const [deletedMessages, setDeletedMessages] = useState({});

	const confirmAndDeleteMessage = async (messageId, messageType) => {
		const confirmed = window.confirm(
			'Are you sure you want to delete this message?'
		);
		if (!confirmed) return;

		try {
			const response = await fetch(`${DELETE_MESSAGE_ROUTE}/${messageId}`, {
				method: 'DELETE',
			});
			if (response.ok) {
				setDeletedMessages((prevDeletedMessages) => ({
					...prevDeletedMessages,
					[messageId]: true,
				}));
			} else {
				console.error('Error deleting message:', response.statusText);
			}
		} catch (error) {
			console.error('Error deleting message:', error);
		}
	};

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const handleInitialLoad = () => {
			container.scrollTop = container.scrollHeight - container.clientHeight;
		};

		if (isInitialLoad) {
			setTimeout(handleInitialLoad, 0);
			setIsInitialLoad(false);
		}
	}, [isInitialLoad]);

	useEffect(() => {
		const container = containerRef.current;
		if (container && !isInitialLoad) {
			container.scrollTop = container.scrollHeight - container.clientHeight;
		}
	}, [messages]);

	return (
		<div
			ref={containerRef}
			className="h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar dark:bg-gray-50"
		>
			<div className="bg-chat-background bg-fixed opacity-5 h-full w-full fixed left-0 top-0 z-0 mt-14  dark:bg-chat-light-bg dark:opacity-50"></div>
			<div className="mx-10 my-6 relative bottom-0 z-40 left-0">
				<div className="flex w-full">
					<div className="flex flex-col justify-end w-full gap-1 overflow-auto">
						{displayedMessages.map((message, index) => (
							<div
								key={index}
								className={`flex ${
									message.senderId === currentChatUser.id
										? 'justify-start'
										: 'justify-end'
								}`}
							>
								{!deletedMessages[message.id] && (
									<>
										{message.type === 'text' && (
											<div
												className={`text-white px-2 py-[2px] text-sm rounded-md flex flex-col gap-1 items-start max-w-[70%] overflow-x-hidden relative dark:text-white ${
													message.senderId === currentChatUser.id
														? 'bg-incoming-background dark:bg-gray-500'
														: 'bg-outgoing-background dark:bg-gray-700'
												}`}
											>
												{message.senderId === userInfo.id && (
													<button
														onClick={() =>
															confirmAndDeleteMessage(message.id, message.type)
														}
														className="text-gray-300 text-xs ml-auto mt-2 flex items-center p-1"
													>
														<BsTrash size={14} className="cursor-pointer" />
													</button>
												)}
												<span className="break-all">{message.message}</span>
												<div className="flex gap-2 ml-auto">
													<span className="text-bubble-meta text-[11px] items-end">
														{calculateTime(message.createdAt)}
													</span>
													{message.senderId === userInfo.id && (
														<>
															<span className="items-center">
																<MessageStatus
																	messageStatus={message.messageStatus}
																/>
															</span>
														</>
													)}
												</div>
											</div>
										)}
										{message.type === 'image' && (
											<div className="relative">
												<ImageMessage message={message} />
												{message.senderId === userInfo.id && (
													<div className=" bg-gray-500 ">
														<button
															onClick={() =>
																confirmAndDeleteMessage(
																	message.id,
																	message.type
																)
															}
															className="absolute top-2 right-2 text-gray-300 text-xs ml-2 flex items-center bg-outgoing-background p-1 rounded"
														>
															<BsTrash size={14} className="cursor-pointer" />
														</button>
													</div>
												)}
											</div>
										)}
										{message.type === 'audio' && (
											<div className="relative">
												<VoiceMessage message={message} />
												{message.senderId === userInfo.id && (
													<button
														onClick={() =>
															confirmAndDeleteMessage(message.id, message.type)
														}
														className="absolute top-2 right-2 text-gray-300 text-xs ml-1 flex items-center p-1"
													>
														<BsTrash size={14} className="cursor-pointer" />
													</button>
												)}
											</div>
										)}
									</>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
