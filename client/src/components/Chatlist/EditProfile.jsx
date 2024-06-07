import { UPDATE_PROFILE_ROUTE } from '@/utils/ApiRoutes';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { BiArrowBack, BiEdit, BiLogOut, BiSave } from 'react-icons/bi';
import { toast } from 'react-toastify';

export default function EditProfile({ userInfo, onClose }) {
	const router = useRouter();
	const [name, setName] = useState(userInfo.name);
	const [bio, setBio] = useState(userInfo.status);
	const [isEditing, setIsEditing] = useState(false);

	const handleNameChange = (e) => {
		setName(e.target.value);
	};

	const handleBioChange = (e) => {
		setBio(e.target.value);
	};

	const handleToggleEdit = () => {
		setIsEditing(!isEditing);
	};

	const handleSaveAndClose = async () => {
		try {
			const response = await fetch(UPDATE_PROFILE_ROUTE, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId: userInfo.id,
					name,
					bio,
					profilePicture: userInfo.profileImage,
				}),
			});
			if (response.ok) {
				const result = await response.json();
				toast.success(result.message);
				setIsEditing(false);
				onClose();
				window.location.reload();
			} else {
				const errorMessage = await response.text();
				toast.error(`Failed to update profile: ${errorMessage}`);
			}
		} catch (error) {
			toast.error(`Network error: ${error.message}`);
		}
	};

	const handleLogout = () => {
		router.push('/logout');
	};

	return (
		<div className="h-full flex flex-col bg-search-input-container-background dark:bg-white dark:text-black">
			<div className="h-16 flex items-center px-4 py-3 bg-panel-header-background dark:bg-gray-200">
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
				<div className="mt-10">
					{isEditing ? (
						<button
							onClick={handleSaveAndClose}
							className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-md mr-4"
						>
							<BiSave />
							Save
						</button>
					) : (
						<button
							onClick={handleToggleEdit}
							className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-md mr-4"
						>
							<BiEdit />
							Edit
						</button>
					)}
				</div>
			</div>
			<div className="text-left px-4">
				{isEditing ? (
					<div className="mb-4">
						<label
							htmlFor="name"
							className="block text-gray-400 dark:text-gray-600"
						>
							Name
						</label>
						<input
							id="name"
							type="text"
							value={name}
							onChange={handleNameChange}
							autoFocus
							className="w-full outline-none border border-gray-500 rounded-lg p-2 text-base mt-1 bg-panel-header-background text-white dark:bg-gray-200 dark:text-gray-900 "
						/>
					</div>
				) : (
					<p className="text-3xl text-gray-400 text-center mb-5 dark:text-gray-600">
						{userInfo.name}
					</p>
				)}

				<div className="mb-4">
					<span className="text-gray-400 dark:text-gray-600">Bio</span>
					{isEditing ? (
						<textarea
							value={bio}
							onChange={handleBioChange}
							className="w-full outline-none border border-gray-500 rounded-lg p-2 text-base resize-none mt-1 bg-panel-header-background text-white dark:bg-gray-200 dark:text-gray-900"
							rows={3}
						></textarea>
					) : (
						<p className="text-sm text-gray-300 ml-4 mb-4 dark:text-gray-400">
							{userInfo.status}
						</p>
					)}
				</div>

				<div className="mb-4">
					<span className="text-gray-400 dark:text-gray-600">Contact</span>
					<p className="text-sm text-gray-300 ml-4 pr-2 dark:text-gray-400">
						{userInfo.email}
					</p>
				</div>
			</div>

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
