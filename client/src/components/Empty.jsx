import Image from 'next/image';
import React from 'react';
import { IoLogoWechat } from 'react-icons/io5';

function Empty() {
	return (
		<div className="border-conversation-border border-l  h-[95vh]  w-full flex flex-col  z-10 bg-panel-header-background  border-b-4 border-b-empty-border  md:w-full  items-center justify-center  dark:bg-white dark:text-gray-900">
			<span className="text-gray-300 dark:text-gray-600">
				Select a chat to start messaging
			</span>
			<IoLogoWechat className="text-gray-400 h-32 w-auto mt-4 dark:text-gray-600" />
		</div>
	);
}

export default Empty;
