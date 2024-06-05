import getPrismaInstance from '../utils/PrismaClient.js';
import { generateToken04 } from '../utils/TokenGenerator.js';

export const checkUser = async (request, response, next) => {
	try {
		const { email } = request.body;
		if (!email) {
			return response.json({ msg: 'Email is required', status: false });
		}
		const prisma = getPrismaInstance();
		const user = await prisma.user.findUnique({ where: { email } });

		if (!user) {
			return response.json({ msg: 'User not found', status: false });
		} else
			return response.json({ msg: 'User Found', status: true, data: user });
	} catch (error) {
		next(error);
	}
};

export const onBoardUser = async (request, response, next) => {
	try {
		const {
			email,
			name,
			about = 'Available',
			image: profilePicture,
		} = request.body;
		if (!email || !name || !profilePicture) {
			return response.json({
				msg: 'Email, Name and Image are required',
			});
		} else {
			const prisma = getPrismaInstance();
			await prisma.user.create({
				data: { email, name, about, profilePicture },
			});
			return response.json({ msg: 'Success', status: true });
		}
	} catch (error) {
		next(error);
	}
};

export const updateProfile = async (req, res, next) => {
	try {
		const { userId, name, bio, profilePicture } = req.body;

		console.log('Received userId:', userId);
		console.log('Received name:', name);
		console.log('Received bio:', bio);
		console.log('Received profilePicture:', profilePicture);

		if (!userId || !name || !profilePicture) {
			return res.status(400).json({
				error: 'User ID, Name, and Profile Picture are required',
			});
		}
		const prisma = getPrismaInstance();
		const updatedUser = await prisma.user.update({
			where: { id: userId },
			data: { name, about: bio, profilePicture },
		});
		return res.status(200).json({
			message: 'Profile updated successfully',
			user: updatedUser,
		});
	} catch (error) {
		next(error);
	}
};

export const getAllUsers = async (req, res, next) => {
	try {
		const prisma = getPrismaInstance();
		const users = await prisma.user.findMany({
			orderBy: { name: 'asc' },
			select: {
				id: true,
				email: true,
				name: true,
				profilePicture: true,
				about: true,
			},
		});
		const usersGroupedByInitialLetter = {};
		users.forEach((user) => {
			const initialLetter = user.name.charAt(0).toUpperCase();
			if (!usersGroupedByInitialLetter[initialLetter]) {
				usersGroupedByInitialLetter[initialLetter] = [];
			}
			usersGroupedByInitialLetter[initialLetter].push(user);
		});

		return res.status(200).send({ users: usersGroupedByInitialLetter });
	} catch (error) {
		next(error);
	}
};

export const generateToken = (req, res, next) => {
	try {
		const appID = parseInt(process.env.ZEGO_APP_ID);
		const serverSecret = process.env.ZEGO_APP_SECRET;
		const userId = req.params.userId;
		const effectiveTimeInSeconds = 3600;
		const payload = '';
		if (appID && serverSecret && userId) {
			const token = generateToken04(
				appID,
				userId,
				serverSecret,
				effectiveTimeInSeconds,
				payload
			);
			res.status(200).json({ token });
		}
		return res
			.status(400)
			.send('User id, app id and server secret is required');
	} catch (err) {
		console.log({ err });
		next(err);
	}
};
