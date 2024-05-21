import { useRouter } from 'next/router';
import React from 'react';
import { BiArrowBack, BiLogOut } from 'react-icons/bi';

export default function EditProfile({ userInfo, onClose }) {
	const router = useRouter();

	const handleLogout = () => {
		router.push('/logout');
	};

	return (
		<div className="h-full flex flex-col bg-search-input-container-background dark:bg-white dark:text-black">
			<div className="h-16 flex items-center px-4 py-3 bg-panel-header-background dark:bg-gray-100 ">
				<div className="flex items-center gap-12 text-white dark:text-gray-700">
					<BiArrowBack className="cursor-pointer text-xl" onClick={onClose} />
					<span className="text-lg">Profile</span>
				</div>
			</div>
			<div className="flex flex-col justify-center items-center p-4 custom-scrollbar">
				<div className="mb-0">
					{userInfo.profileImage && (
						<img
							src={userInfo.profileImage}
							alt="Profile"
							className="w-40 h-40 rounded-full object-cover border border-gray-500 p-1"
						/>
					)}
				</div>
			</div>
			<div className="text-left">
				<p className="text-3xl  text-gray-400 text-center mb-5 dark:text-gray-600">
					{userInfo.name}
				</p>

				<div className="ml-4">
					<span className="text-gray-400 mt-6 dark:text-gray-600">Bio</span>
					<p className="text-sm text-gray-300 ml-4 mb-4 dark:text-gray-400">
						{userInfo.status}
					</p>

					<span className="text-gray-400 dark:text-gray-600">Contact</span>
					<p className="text-sm text-gray-300 ml-4 pr-2 dark:text-gray-400">
						{userInfo.email}
					</p>
				</div>
			</div>
			{/* Logout Button */}
			<div className="flex ml-4 mt-auto mb-8">
				<button
					onClick={handleLogout}
					className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-md"
				>
					<BiLogOut />
					Logout
				</button>
			</div>
		</div>
	);
}
