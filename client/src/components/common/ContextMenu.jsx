import React, { useEffect, useRef } from 'react';

export default function ContextMenu({
	options,
	coordinates,
	contextMenu,
	setContextMenu,
}) {
	const contextMenuRef = useRef(null);

	useEffect(() => {
		const handleOutsideClick = (event) => {
			if (event.target.id !== 'context-opener') {
				if (
					contextMenuRef.current &&
					!contextMenuRef.current.contains(event.target)
				) {
					setContextMenu(false);
				}
			}
		};

		document.addEventListener('click', handleOutsideClick);

		return () => {
			document.removeEventListener('click', handleOutsideClick);
		};
	}, []);

	useEffect(() => {
		const handleKeyPress = (e) => {
			if (e.key === 'Escape') {
				if (contextMenu) setContextMenu(false);
			}
		};
		window.addEventListener('keyup', handleKeyPress);
		return () => window.removeEventListener('keyup', handleKeyPress);
	}, []);

	const handleClick = (e, callBack) => {
		e.stopPropagation();
		callBack();
	};

	return (
		<div
			className={`bg-dropdown-background fixed py-2 z-[100]`}
			ref={contextMenuRef}
			style={{
				boxShadow:
					'0 2px 5px 0 rgba(var(11,20,26),.26),0 2px 10px 0 rgba(11,20,26;),.16)',
				top: coordinates.y,
				left: coordinates.x,
			}}
		>
			<ul>
				{options.map(({ name, callBack }, index) => (
					<li
						key={index}
						className="hover:bg-background-default-hover px-5 py-2 cursor-pointer"
					>
						<span
							className="text-white"
							onClick={(e) => handleClick(e, callBack)}
						>
							{name}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}
