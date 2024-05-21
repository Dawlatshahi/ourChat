'use client';

import { useEffect, useState } from 'react';
import { BsSunFill } from 'react-icons/bs';
import { FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
	const [darkMode, setDarkMode] = useState(true);

	useEffect(() => {
		const theme = localStorage.getItem('theme');
		if (theme === 'dark') setDarkMode(true);
	}, []);

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
			className="relative w-16 h-8 flex items-center dark:bg-gray-600 bg-gray-600 cursor-pointer rounded-full p-1 z-40"
			onClick={() => setDarkMode(!darkMode)}
		>
			<BsSunFill className="text-yellow-400 dark:text-white" size={18} />
			<div
				className="absolute bg-white  dark:bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300"
				style={darkMode ? { left: '2px' } : { right: '2px' }}
			></div>
			<FaMoon className="ml-auto text-white " size={18} />
		</div>
	);
};

export default ThemeToggle;
