import axios from 'axios';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React, { useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { firebaseAuth } from '../utils/FirebaseConfig';

import { useStateProvider } from '@/context/StateContext';
import { reducerCases } from '@/context/constants';
import { CHECK_USER_ROUTE } from '@/utils/ApiRoutes';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Login() {
	const router = useRouter();
	const [{ userInfo, newUser }, dispatch] = useStateProvider();
	useEffect(() => {
		if (userInfo?.id && !newUser) router.push('/');
	}, [userInfo, newUser, router]);
	const login = async () => {
		const provider = new GoogleAuthProvider();
		const {
			user: { displayName: name, email, photoURL: profileImage },
		} = await signInWithPopup(firebaseAuth, provider);

		try {
			if (email) {
				const { data } = await axios.post(CHECK_USER_ROUTE, {
					email,
				});

				if (!data.status) {
					dispatch({ type: reducerCases.SET_NEW_USER, newUser: true });
					dispatch({
						type: reducerCases.SET_USER_INFO,
						userInfo: {
							name,
							email,
							profileImage,
							status: 'Available',
						},
					});
					router.push('/onboarding');
				} else {
					dispatch({
						type: reducerCases.SET_USER_INFO,
						userInfo: {
							id: data.data.id,
							email: data.data.email,
							name: data.data.name,
							profileImage: data.data.profilePicture,
							status: data.data.about,
						},
					});
					router.push('/');
				}
			}
		} catch (error) {
			console.log({ error });
		}
	};
	return (
		<div className="relative h-screen w-screen bg-white flex flex-col justify-center items-center">
			<div className="bg-panel-header-background text-white h-40 w-full absolute top-0 flex justify-center items-center lg:h-48 xl:h-55 md:h-40"></div>
			<div className="flex flex-col items-center gap-2 text-search-input-container-background pl-10 pr-10 pt-10 m-10 shadow-2xl rounded-lg bg-white w-100 mx-auto h-100 pb-20 lg:pl-40 lg:pr-40 xl:pt-20 absolute">
				<span className="text-panel-header-background items-start text-2xl ">
					Welcome to <b>ourChat</b>!
				</span>
				<hr className="text-panel-header-background"></hr>
				<div className="flex items-center justify-center  mt-20 lg:ml-40 lg:mr-40 md:ml-20 md:mr-20">
					<Image
						src="/bwbg.png"
						alt="logo-gif"
						height={200}
						width={200}
						className="sm:w-auto sm:h-auto"
					/>
					<span className="text-5xl sm:text-7xl pl-4 sm:pl-10 ">ourChat</span>
				</div>

				<div className="flex justify-center mt-20">
					<button
						className="flex items-center justify-center gap-7 bg-panel-header-background p-5 rounded-lg"
						onClick={login}
					>
						<FcGoogle className="text-4xl" />
						<span className="text-white text-2xl">Login With Google</span>
					</button>
				</div>
			</div>
		</div>
	);
}
