import { appAPI } from '@/utils/appAPI';
import { z } from 'zod';

export const signupSchema = z
	.object({
		mail: z.string().email(),
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters long')
			.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
			.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
			.regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
		repeatPassword: z
			.string()
			.min(8, 'Password must be at least 8 characters long')
			.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
			.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
			.regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
	})
	.refine((data) => data.password === data.repeatPassword, {
		message: "Passwords don't match",
		path: ['repeatPassword'],
	});

export type SignupBody = z.infer<typeof signupSchema>;

export async function signup(data: SignupBody): Promise<any> {
	const response = await appAPI.post<any>(`/api/v1/signup`, data, {
		withCredentials: true,
	});
	return response.data;
}
