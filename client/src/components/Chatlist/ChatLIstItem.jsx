import { useStateProvider } from '@/context/StateContext';
import { reducerCases } from '@/context/constants';
import { calculateTime } from '@/utils/CalculateTime';
import React from 'react';
import { BsCheckAll, BsCheckLg } from 'react-icons/bs';
import { FaCamera, FaCircle, FaMicrophone } from 'react-icons/fa';
import { decrypt } from '../../services/encryption.service';
import Avatar from '../common/Avatar';
import MessageStatus from '../common/MessageStatus';

export default function ChatListItem({ data, isContactPage = false }) {
	const [{ userInfo, currentChatUser, onlineUsers }, dispatch] =
		useStateProvider();

	const handleContactClick = () => {
		if (currentChatUser?.id === data?.id) {
			return;
		}

		if (!isContactPage) {
			dispatch({
				type: reducerCases.CHANGE_CURRENT_CHAT_USER,
				user: {
					name: data.name,
					about: data.about,
					profilePicture: data.profilePicture,
					email: data.email,
					id: userInfo.id === data.senderId ? data.recieverId : data.senderId,
				},
			});
		} else {
			dispatch({
				type: reducerCases.CHANGE_CURRENT_CHAT_USER,
				user: { ...data },
			});
			dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE });
		}
	};
	function trydecrypt(message) {
		try {
			return decrypt(message);
		} catch {
			return message;
		}
	}

	return (
		<div
			className={`flex cursor-pointer items-center ${
				currentChatUser?.id === data.id && !isContactPage
					? 'bg-background-default-hover'
					: 'hover:bg-background-default-hover'
			}`}
			onClick={handleContactClick}
		>
			<div className="relative mr-4 ml-2">
				<div className="h-12 w-14 mb-3">
					<Avatar
						type="lg"
						image={data?.profilePicture}
						className="object-cover "
					/>
				</div>
				{onlineUsers.includes(data.id) && (
					<FaCircle
						className="text-green-500 absolute bottom-4 right-0 transform translate-x-1/4 translate-y-1/4"
						style={{ fontSize: '0.6rem' }}
					/>
				)}
			</div>
			<div className="flex flex-col justify-center mt-3 pr-2 w-full">
				<div className="flex justify-between">
					<div>
						<span className="text-white text-md">{data?.name}</span>
					</div>
					{!isContactPage && (
						<div>
							<span
								className={`${
									!data.totalUnreadMessages > 0
										? 'text-secondary'
										: 'text-icon-green'
								} text-sm`}
							>
								{calculateTime(data.createdAt)}
							</span>
						</div>
					)}
				</div>
				<div className="flex border-b border-conversation-border pb-2 pt-1 pr-2">
					<div className="flex justify-between w-full">
						<span className="text-secondary line-clamp-1 text-sm">
							{isContactPage ? (
								data?.about || '\u00A0'
							) : (
								<div className="flex items-center gap-1 max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[200px] xl:max-w-[300px]">
									{data.senderId === userInfo.id && (
										<MessageStatus messageStatus={data.messageStatus} />
									)}
									{data.type === 'text' && (
										<span className="truncate">
											{trydecrypt(data.message)
												.split(' ')
												.slice(0, 3)
												.join(' ')}
											{trydecrypt(data.message).split(' ').length > 3 && ' ...'}
										</span>
									)}
									{data.type === 'audio' && (
										<span className="flex gap-1 items-center">
											<FaMicrophone className="text-panel-header-icon" />
											Audio
										</span>
									)}
									{data.type === 'image' && (
										<span className="flex gap-1 items-center">
											<FaCamera className="text-panel-header-icon" />
											Image
										</span>
									)}
								</div>
							)}
						</span>

						{data.totalUnreadMessages > 0 && (
							<span className="bg-icon-green px-[5px] rounded-full text-sm">
								{data.totalUnreadMessages}
							</span>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
