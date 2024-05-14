import { useStateProvider } from '@/context/StateContext';
import { reducerCases } from '@/context/constants';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from 'react-icons/bs';
import Avatar from '../common/Avatar';
import ContextMenu from '../common/ContextMenu';

export default function ChatListHeader() {
	const [{ userInfo }, dispatch] = useStateProvider();
	const router = useRouter();
	const [contextMenuCordinates, setContextMenuCordinates] = useState({
		x: 0,
		y: 0,
	});
	const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);

	const showContextMenu = (e) => {
		e.preventDefault();
		setContextMenuCordinates({ x: e.pageX, y: e.pageY });
		setIsContextMenuVisible(true);
	};

	const contextMenuOptions = [
		{
			name: 'Logout',
			callBack: async () => {
				setIsContextMenuVisible(false);
				router.push('/logout');
			},
		},
	];

	const handleAllContactsPage = () => {
		dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE });
	};

	return (
		<div className="h-16 px-4 py-3 flex justify-between items-center">
			<div className="flex items-center cursor-pointer">
				<Avatar type="sm" image={userInfo?.profileImage} />
				{userInfo?.name && (
					<span className="ml-2 text-sm font-medium dark:text-white">
						{userInfo.name}
					</span>
				)}
			</div>
			<div className="flex gap-6 ">
				<BsFillChatLeftTextFill
					className="text-panel-header-icon cursor-pointer text-xl"
					title="New chat"
					onClick={handleAllContactsPage}
				/>
				<>
					<BsThreeDotsVertical
						className="text-panel-header-icon cursor-pointer text-xl"
						title="Menu"
						onClick={(e) => showContextMenu(e)}
						id="context-opener"
					/>
					{isContextMenuVisible && (
						<ContextMenu
							options={contextMenuOptions}
							cordinates={contextMenuCordinates}
							contextMenu={isContextMenuVisible}
							setContextMenu={setIsContextMenuVisible}
						/>
					)}
				</>
			</div>
		</div>
	);
}
