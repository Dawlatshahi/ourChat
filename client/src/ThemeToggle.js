'use client';

import { useEffect, useState } from 'react';
import { BsSunFill } from 'react-icons/bs';
import { FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
	const [darkMode, setDarkMode] = useState(() => {
		if (typeof window !== 'undefined') {
			const theme = localStorage.getItem('theme');
			return theme === 'dark';
		}
		return false;
	});

	useEffect(() => {
		if (darkMode) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	}, [darkMode]);

	return (
		<div
			className="relative w-10 h-6 flex items-center dark:bg-gray-600 bg-gray-600 cursor-pointer rounded-full p-1 z-40"
			onClick={() => setDarkMode(!darkMode)}
		>
			<BsSunFill className="text-yellow-400 dark:text-white" size={12} />
			<div
				className="absolute dark:bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 bg-gray-100"
				style={darkMode ? { left: '2px' } : { right: '2px' }}
			></div>
			<FaMoon className="ml-auto text-white" size={12} />
		</div>
	);
};

export default ThemeToggle;
