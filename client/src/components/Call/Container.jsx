import { useStateProvider } from '@/context/StateContext';
import { reducerCases } from '@/context/constants';
import { GET_CALL_TOKEN } from '@/utils/ApiRoutes';
import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { MdOutlineCallEnd } from 'react-icons/md';

function Container({ data }) {
	const [{ socket, userInfo }, dispatch] = useStateProvider();
	const [localStream, setLocalStream] = useState(undefined);
	const [publishStream, setPublishStream] = useState(undefined);
	const [token, setToken] = useState(undefined);
	const [zgVar, setZgVar] = useState(undefined);
	const [callStarted, setCallStarted] = useState(false);
	const [callAccepted, setCallAccepted] = useState(false);
	const [callStartTime, setCallStartTime] = useState(null);
	const [callDuration, setCallDuration] = useState(0);
	const [remoteStreamID, setRemoteStreamID] = useState(null);

	useEffect(() => {
		const timer = setInterval(() => {
			if (callAccepted && callStartTime) {
				const duration = Math.floor((Date.now() - callStartTime) / 1000);
				setCallDuration(duration);
			}
		}, 1000);

		return () => clearInterval(timer);
	}, [callAccepted, callStartTime]);

	useEffect(() => {
		if (data.type === 'out-going') {
			socket.current.on('accept-call', () => {
				const startTime = Date.now();
				socket.current.emit('call-start-time', startTime);
				setCallAccepted(true);
				setCallStartTime(startTime);
			});
		} else {
			setTimeout(() => {
				setCallAccepted(true);
				setCallStartTime(Date.now());
			}, 1000);
		}
	}, [data, socket]);

	useEffect(() => {
		socket.current.on('call-start-time', (startTime) => {
			setCallAccepted(true);
			setCallStartTime(startTime);
		});
	}, [socket]);

	useEffect(() => {
		const getToken = async () => {
			try {
				const {
					data: { token },
				} = await axios.get(`${GET_CALL_TOKEN}/${userInfo.id}`);
				setToken(token);
			} catch (err) {
				console.log(err);
			}
		};
		if (callAccepted) {
			getToken();
		}
	}, [callAccepted, userInfo.id]);
	useEffect(() => {
		let isMounted = true;

		const startCall = async () => {
			import('zego-express-engine-webrtc').then(
				async ({ ZegoExpressEngine }) => {
					const zg = new ZegoExpressEngine(
						process.env.NEXT_PUBLIC_ZEGO_APP_ID,
						process.env.NEXT_PUBLIC_ZEGO_SERVER_ID
					);
					setZgVar(zg);

					zg.on(
						'roomStreamUpdate',
						async (roomId, updateType, streamList, extendedData) => {
							if (updateType === 'ADD' && isMounted && callAccepted) {
								const rmVideo = document.getElementById('remote-video');
								const vd = document.createElement(
									data.callType === 'video' ? 'video' : 'audio'
								);
								vd.id = streamList[0].streamID;
								vd.autoplay = true;
								vd.playsInline = true;
								vd.muted = false;
								rmVideo.appendChild(vd); // Append the child element
								zg.startPlayingStream(streamList[0].streamID, {
									audio: true,
									video: true,
								}).then((stream) => {
									vd.srcObject = stream;
								});
							} else if (updateType === 'DELETE') {
								if (zg && localStream && streamList[0].streamID) {
									zg.destroyStream(localStream);
									zg.logoutRoom(data.roomId.toString());
									setRemoteStreamID(null);
								}

								zg.stopPublishingStream(streamList[0].streamID);
								dispatch({ type: reducerCases.END_CALL });
							}
						}
					);
					await zg.loginRoom(
						data.roomId.toString(),
						token,
						{ userID: userInfo.id.toString(), userName: userInfo.name },
						{ userUpdate: true }
					);

					setTimeout(async () => {
						if (isMounted && callAccepted) {
							const localStream = await zg.createStream({
								camera: {
									audio: true,
									video: data.callType === 'video' ? true : false,
								},
							});
							setLocalStream(localStream);

							const localAudio = document.getElementById('local-video');
							const videoElement = document.createElement(
								data.callType === 'video' ? 'video' : 'audio'
							);
							videoElement.id = 'audio-local';
							videoElement.className = 'h-28 w-32';
							videoElement.autoplay = true;
							videoElement.muted = false;
							videoElement.playsInline = true;
							localAudio.appendChild(videoElement);

							const td = document.getElementById('audio-local');
							td.srcObject = localStream;
							const streamID = '123' + Date.now();
							setPublishStream(streamID);
							zg.startPublishingStream(streamID, localStream);
						}
					}, 1000);
				}
			);
		};
		if (token && !callStarted) {
			startCall();
			setCallStarted(true);
		}

		return () => {
			isMounted = false;
		};
	}, [token, callAccepted]);

	const endCall = () => {
		const id = data.id;
		socket.current.emit('reject-voice-call', {
			from: id,
		});

		if (zgVar && localStream && publishStream) {
			zgVar.destroyStream(localStream);
			zgVar.stopPublishingStream(publishStream);
			zgVar.logoutRoom(data.roomId.toString());
		}

		dispatch({ type: reducerCases.END_CALL });
	};

	return (
		<div
			className="border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col h-[100vh] overflow-hidden
items-center justify-center text-white "
		>
			<div className="flex flex-col gap-3 items-center">
				<span className="text-4xl">{data.name}</span>
				<span className="text-lg">
					{callAccepted && data.callType !== 'video' ? (
						<>
							On going call
							<br />
							<span style={{ textAlign: 'center', display: 'block' }}>
								{Math.floor(callDuration / 60)}:{callDuration % 60}
							</span>
						</>
					) : (
						'Calling'
					)}
				</span>
			</div>

			{(!callAccepted || data.callType === 'audio') && (
				<div className="my-24">
					<Image
						src={data?.profilePicture}
						alt="avatar"
						height={350}
						width={350}
						className="rounded-full"
					/>
				</div>
			)}
			<div className="my-5 relative" id="remote-video">
				<div className="absolute bottom-5 right-5" id="local-video">
					{' '}
				</div>
			</div>

			<div
				className="rounded-full h-16 w-16 bg-red-600 flex items-center justify-center"
				onClick={endCall}
			>
				<MdOutlineCallEnd className="text-3xl cursor-pointer" />
			</div>
		</div>
	);
}

export default Container;
