import ChatContainer from '@/components/Chat/ChatContainer';
import ChatHeader from '@/components/Chat/ChatHeader';
import MessageBar from '@/components/Chat/MessageBar';
import React from 'react';

export default function Chat() {
	return (
		<div className="border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col h-[95vh] z-10  ">
			<ChatHeader />
			<ChatContainer />
			<MessageBar />
		</div>
	);
}
