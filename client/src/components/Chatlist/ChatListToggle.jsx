import React from 'react';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';

export default function ChatListToggle({ showChatList, toggleChatList }) {
	return (
		<button
			onClick={toggleChatList}
			className="toggle-button bg-search-input-container-background text-dropdown-background items-center w-screen h-8 "
			style={{ marginTop: 0, marginBottom: 0 }}
		>
			{showChatList ? <FaAngleDoubleLeft /> : <FaAngleDoubleRight />}
		</button>
	);
}
