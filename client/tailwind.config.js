/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			backgroundImage: {
				'chat-background': "url('/chat-bg.png')",
				'chat-light-bg': "url('/bg-light1.jpg')",
			},
			colors: {
				dark: '#D3D3D3',
				medium: '#293245',

				secondary: '#8696a0',
				'teal-light': '#7ae3c3',
				'photopicker-overlay-background': 'rgba(30,42,49,0.8)',
				'dropdown-background': '#1b2433',
				'dropdown-background-hover': '#182229',
				'input-background': ' #141f29',
				'primary-strong': '#e9edef',
				'panel-header-background': '#1e3347',
				'panel-header-icon': '#aebac1',
				'icon-lighter': '#8696a0',
				'icon-green': '#00a884',
				'search-input-container-background': '#121c29',
				'conversation-border': 'rgba(134,150,160,0.15)',
				'conversation-panel-background': '#111b29',
				'background-default-hover': '#1e3347',
				'incoming-background': '#1f2938',
				'outgoing-background': '#033a5c',
				'bubble-meta': 'hsla(0,0%,100%,0.6)',
				'icon-ack': '#53bdeb',
				'login-bg': '#0c2844',
				'empty-border': '#123566',
			},
			gridTemplateColumns: {
				main: '1fr 2.4fr',
			},
		},
	},
	plugins: [],
	darkMode: 'class',
};
