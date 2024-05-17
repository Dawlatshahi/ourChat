import Image from 'next/image';
import React from 'react';
import { IoLogoWechat } from 'react-icons/io5';

function Empty() {
	return (
		<div className="border-conversation-border border-l w-full bg-panel-header-background flex flex-col h-[100vh] border-b-4 border-b-empty-border items-center justify-center">
			<span className="text-gray-300">Select a chat to start messaging</span>
			<IoLogoWechat className="text-gray-400 h-32 w-auto mt-4" />
		</div>
	);
}

export default Empty;
