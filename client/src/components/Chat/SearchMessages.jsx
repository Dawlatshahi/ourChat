import { useStateProvider } from '@/context/StateContext';
import { reducerCases } from '@/context/constants';
import { calculateTime } from '@/utils/CalculateTime';
import React, { useEffect, useState } from 'react';
import { BiArrowBack, BiFilter, BiSearchAlt2 } from 'react-icons/bi';
import { IoClose } from 'react-icons/io5';

function SearchMessages() {
	const [{ currentChatUser, messages }, dispatch] = useStateProvider();
	const [searchBarFocus, setSearchBarFocus] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [searchedMessages, setSearchedMessages] = useState([]);
	useEffect(() => {
		const lowerCaseSearchTerm = searchTerm.toLowerCase();
		if (lowerCaseSearchTerm) {
			const filteredMessages = messages.filter(
				(message) =>
					message.type === 'text' &&
					message.message.toLowerCase().includes(lowerCaseSearchTerm)
			);
			setSearchedMessages(filteredMessages);
		} else {
			setSearchedMessages([]);
		}
	}, [searchTerm]);

	return (
		<div className="border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col  z-10 max-h-screen ">
			<div className="h-16 px-4 py-5 flex  gap-10 items-center bg-panel-header-background text-primary-strong dark:bg-gray-200 dark:text-gray-800">
				<IoClose
					className="cursor-pointer text-icon-lighter text-2xl dark:text-gray-800"
					onClick={() => dispatch({ type: reducerCases.SET_MESSAGES_SEARCH })}
				/>
				<span>Search Messages</span>
			</div>
			<div className="overflow-auto custom-scrollbar h-full dark:bg-white">
				<div className="flex items-center flex-col w-full">
					<div className=" flex  px-5 items-center gap-3 h-14 w-full">
						<div className="bg-panel-header-background flex items-center gap-5 px-3 py-[6px] rounded-lg flex-grow dark:bg-gray-200">
							<div>
								{searchBarFocus ? (
									<BiArrowBack className="text-icon-green cursor-pointer text-l" />
								) : (
									<BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-l dark:text-gray-700" />
								)}
							</div>
							<div className="">
								<input
									type="text"
									placeholder="Search messages"
									className="bg-transparent text-sm focus:outline-none text-white w-full dark:text-black"
									onFocus={() => setSearchBarFocus(true)}
									onBlur={() => setSearchBarFocus(false)}
									onChange={(e) => setSearchTerm(e.target.value)}
									value={searchTerm}
								/>
							</div>
						</div>
					</div>

					<span className="mt-10 text-secondary">
						{!searchTerm.length &&
							` Search for messages with ${currentChatUser.name}`}
					</span>
				</div>
				<div className="flex justify-center h-full flex-col">
					{searchTerm.length > 0 && !searchedMessages.length && (
						<span className="text-secondary w-full flex justify-center">
							No messages found
						</span>
					)}
					<div className="flex flex-col w-full h-full  ">
						{searchedMessages.map((message) => (
							<div className="flex cursor-pointer flex-col justify-center hover:bg-background-default-hover w-full dark:hover:bg-gray-200 px-5  border-b-[0.1px]  border-secondary py-5">
								<div className="text-sm text-secondary">
									{calculateTime(message.createdAt)}
								</div>
								<div className="text-icon-green">{message.message}</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default SearchMessages;
