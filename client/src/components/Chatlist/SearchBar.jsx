import { useStateProvider } from '@/context/StateContext';
import { reducerCases } from '@/context/constants';
import { useState } from 'react';
import { BiArrowBack, BiFilter, BiSearchAlt2 } from 'react-icons/bi';

export default function SearchBar() {
	const [{ contactSearch }, dispatch] = useStateProvider();

	return (
		<div className="bg-search-input-container-background flex py-3 pl-3 pr-3 items-center gap-3 h-14 dark:bg-white">
			<div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow dark:bg-gray-300 dark:text-gray-900">
				<div>
					<BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-l dark:text-gray-900" />
				</div>
				<div className="">
					<input
						type="text"
						placeholder="Search for chat"
						className="bg-transparent text-sm focus:outline-none text-white w-full dark:text-gray-900"
						value={contactSearch}
						onChange={(e) =>
							dispatch({
								type: reducerCases.SET_CONTACT_SEARCH,
								contactSearch: e.target.value,
							})
						}
					/>
				</div>
			</div>
		</div>
	);
}
