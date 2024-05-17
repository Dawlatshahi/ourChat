import React from 'react';
import { BiArrowBack } from 'react-icons/bi';

export default function EditProfile({ userInfo, onClose }) {
	return (
		<div className="h-full flex flex-col bg-search-input-container-background ">
			<div className="h-16 flex items-center px-4 py-3 bg-panel-header-background">
				<div className="flex items-center gap-12 text-white">
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
				<p className="text-3xl  text-gray-400 text-center mb-5">
					{userInfo.name}
				</p>

				<div className="ml-4">
					<span className="text-gray-400 mt-6">Bio</span>
					<p className="text-sm text-gray-300 ml-4 mb-4">{userInfo.status}</p>

					<span className="text-gray-400">Contact</span>
					<p className="text-sm text-gray-300 ml-4 pr-2">{userInfo.email}</p>
				</div>
			</div>
		</div>
	);
}
