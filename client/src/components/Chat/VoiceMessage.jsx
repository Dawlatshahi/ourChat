import { useStateProvider } from '@/context/StateContext';
import { HOST } from '@/utils/ApiRoutes';
import { calculateTime } from '@/utils/CalculateTime';
import React, { useEffect, useRef, useState } from 'react';
import { FaPlay, FaStop } from 'react-icons/fa';
import WaveSurfer from 'wavesurfer.js';
import Avatar from '../common/Avatar';
import MessageStatus from '../common/MessageStatus';

function VoiceMessage({ message }) {
	const [{ currentChatUser, userInfo }] = useStateProvider();
	const [audioMessage, setAudioMessage] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [waveformReady, setWaveformReady] = useState(false);
	const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
	const [totalDuration, setTotalDuration] = useState(0);
	const waveformRef = useRef(null);
	const waveform = useRef(null);

	useEffect(() => {
		if (waveform.current === null) {
			waveform.current = WaveSurfer.create({
				container: waveformRef.current,
				waveColor: '#ccc',
				progressColor: '#4a9eff',
				cursorColor: '#7ae3c3',
				barWidth: 2,
				barHeight: 5,
				height: 20,
				responsive: true,
			});
			waveform.current.on('finish', () => {
				setIsPlaying(false);
			});
		}
		return () => {
			waveform.current.destroy();
		};
	}, []);

	useEffect(() => {
		const audioURL = `${HOST}/${message.message}`;
		const audio = new Audio(audioURL);
		setAudioMessage(audio);
		setWaveformReady(true);
		waveform.current.load(audioURL);
		waveform.current.on('ready', () => {
			setTotalDuration(waveform.current.getDuration());
		});
	}, [message.message]);

	const handlePlayAudio = () => {
		if (audioMessage) {
			waveform.current.stop();
			waveform.current.play();
			audioMessage.play();
			setIsPlaying(true);
		}
	};

	const handlePauseAudio = () => {
		if (audioMessage) {
			waveform.current.stop();
			audioMessage.pause();
			setIsPlaying(false);
		}
	};

	useEffect(() => {
		if (audioMessage) {
			const updatePlaybackTime = () => {
				setCurrentPlaybackTime(audioMessage.currentTime);
			};
			audioMessage.addEventListener('timeupdate', updatePlaybackTime);
			return () => {
				audioMessage.removeEventListener('timeupdate', updatePlaybackTime);
			};
		}
	}, [audioMessage]);

	const formatTime = (time) => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes.toString().padStart(2, '0')}:${seconds
			.toString()
			.padStart(2, '0')}`;
	};

	return (
		<div
			className={`flex items-center gap-5 text-white px-4  py-8 text-sm rounded-md h-14   ${
				message.senderId === currentChatUser.id
					? 'bg-incoming-background dark:bg-gray-500'
					: 'bg-outgoing-background dark:bg-gray-700'
			}`}
		>
			{/* <div>
				<Avatar type="sm" image={currentChatUser?.profilePicture} />
			</div> */}
			<div className="cursor-pointer text-xl">
				{!isPlaying ? (
					<FaPlay onClick={handlePlayAudio} className="text-sm" />
				) : (
					<FaStop onClick={handlePauseAudio} className="text-sm" />
				)}
			</div>
			<div className="relative">
				<div className="w-60 " ref={waveformRef} />
				<div className="text-bubble-meta text-[11px] pt-1  flex justify-between absolute bottom-[-22px] w-full ">
					<span>
						{formatTime(isPlaying ? currentPlaybackTime : totalDuration)}
					</span>
					<div className="flex gap-1">
						<span>{calculateTime(message.createdAt)}</span>
						{message.senderId === userInfo.id && (
							<MessageStatus messageStatus={message.messageStatus} />
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default VoiceMessage;
