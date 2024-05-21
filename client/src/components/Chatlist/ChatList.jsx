import { useStateProvider } from '@/context/StateContext';
import { reducerCases } from '@/context/constants';

import React, { useEffect, useState } from 'react';
import ChatListHeader from './ChatListHeader';
import ContactsList from './ContactsList';
import EditProfile from './EditProfile';
import List from './List';
import SearchBar from './SearchBar';
export default function ChatList() {
	const [{ contactsPage, editProfilePage, userInfo }, dispatch] =
		useStateProvider();
	const [pageType, setPageType] = useState('default');

	const handleEditProfileClose = () => {
		dispatch({ type: reducerCases.SET_DEFAULT_PAGE });
	};

	useEffect(() => {
		if (contactsPage) {
			setPageType('all-contacts');
		} else if (editProfilePage) {
			setPageType('edit-profile');
		} else {
			setPageType('default');
		}
	}, [contactsPage, editProfilePage]);

	const renderContent = () => {
		switch (pageType) {
			case 'default':
				return (
					<>
						<ChatListHeader />
						<SearchBar />
						<List />
					</>
				);
			case 'all-contacts':
				return <ContactsList />;
			case 'edit-profile':
				return (
					<EditProfile userInfo={userInfo} onClose={handleEditProfileClose} />
				);
			default:
				return null;
		}
	};

	return (
		<div className="bg-panel-header-background flex flex-col max-h-[95vh] h-[95vh] z-20 dark:bg-medium">
			{renderContent()}
		</div>
	);
}
