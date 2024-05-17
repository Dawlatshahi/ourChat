import { useStateProvider } from '@/context/StateContext';
import { reducerCases } from '@/context/constants';
import React, { useEffect, useState } from 'react';
import ChatListHeader from './ChatListHeader';
import ContactsList from './ContactsList';
import EditProfile from './EditProfile';
import List from './List';
import SearchBar from './SearchBar';

export default function ChatList() {
	const [pageType, setPageType] = useState('default');
	const [{ contactsPage, editProfilePage, userInfo }, dispatch] =
		useStateProvider();

	useEffect(() => {
		if (contactsPage) {
			setPageType('all-contacts');
		} else if (editProfilePage) {
			setPageType('edit-profile');
		} else {
			setPageType('default');
		}
	}, [contactsPage, editProfilePage]);

	const handleEditProfileClose = () => {
		dispatch({ type: reducerCases.SET_DEFAULT_PAGE });
	};

	return (
		<div className="bg-panel-header-background flex flex-col max-h-screen z-20 ">
			{pageType === 'default' && (
				<>
					<ChatListHeader />
					<SearchBar />
					<List />
				</>
			)}
			{pageType === 'all-contacts' && <ContactsList />}
			{pageType === 'edit-profile' && (
				<EditProfile userInfo={userInfo} onClose={handleEditProfileClose} />
			)}
		</div>
	);
}
