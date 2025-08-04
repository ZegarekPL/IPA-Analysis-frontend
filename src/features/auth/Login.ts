import { appAPI } from '@/utils/appAPI';
import { AxiosResponse } from 'axios';

import { z } from 'zod';

export const signinSchema = z.object({
	mail: z.string().email(),
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters long')
		.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
		.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
		.regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

export type SigninBody = z.infer<typeof signinSchema>;

export async function login(data: SigninBody): Promise<any> {
	try {
		const response: AxiosResponse<any> = await appAPI.post(`/api/v1/login`, data, {
			withCredentials: true,
		});
		return response.data;
	} catch (error: any) {
		console.error(error);
	}
}

export const getUserSchema = z.object({
	token: z.string(),
});

export type GetUserBody = z.infer<typeof getUserSchema>;

export async function getUser(data: GetUserBody): Promise<any> {
	try {
		const response: AxiosResponse<any> = await appAPI.post(`/api/v1/getUser`, data, {
			withCredentials: true,
		});
		return response.data;
	} catch (error: any) {
		console.error(error);
	}
}
