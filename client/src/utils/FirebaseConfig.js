import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyALtbw3_SUBbz3jG5itzMuy1YrhAILjWPQ',
	authDomain: 'chittr-dfd87.firebaseapp.com',
	projectId: 'chittr-dfd87',
	storageBucket: 'chittr-dfd87.appspot.com',
	messagingSenderId: '518083603401',
	appId: '1:518083603401:web:e0b87d5e997eb0404ad618',
	measurementId: 'G-75QRYH8T1Y',
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
