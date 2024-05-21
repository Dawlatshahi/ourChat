import { useStateProvider } from '@/context/StateContext';
import { reducerCases } from '@/context/constants';

import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { RiChatNewFill } from 'react-icons/ri';
import Avatar from '../common/Avatar';
import ContextMenu from '../common/ContextMenu';

export default function ChatListHeader() {
	const [{ userInfo }, dispatch] = useStateProvider();
	const router = useRouter();
	const [contextMenuCoordinates, setContextMenuCoordinates] = useState({
		x: 0,
		y: 0,
	});
	const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);

	const showContextMenu = (e) => {
		e.preventDefault();
		setContextMenuCoordinates({ x: e.pageX, y: e.pageY });
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

	const handleEditProfilePage = () => {
		dispatch({ type: reducerCases.SET_EDIT_PROFILE_PAGE });
	};

	return (
		<div className="h-16 px-4 py-3 flex justify-between items-center z-20 w-full bg-panel-header-background dark:bg-white  dark:text-black ">
			<div className="cursor-pointer" onClick={handleEditProfilePage}>
				<Avatar type="sm" image={userInfo?.profileImage} />
			</div>
			<div className="flex gap-6">
				<RiChatNewFill
					className="text-panel-header-icon cursor-pointer text-2xl  dark:text-black"
					title="New chat"
					onClick={handleAllContactsPage}
				/>
				<>
					<BsThreeDotsVertical
						className="text-panel-header-icon cursor-pointer text-2xl  dark:text-black"
						title="Menu"
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
				</>
			</div>
		</div>
	);
}
