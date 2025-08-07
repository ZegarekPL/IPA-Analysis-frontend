import { appAPI } from '@/utils/appAPI';
import { AxiosResponse } from 'axios';

import { z } from 'zod';
import { FailedResponse } from '@/utils/FailedResponse';

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
export type SigninSuccessResponse = {
	status: 'success';
	data: {
		user: {
			authentication: {
				password: string;
				salt: string;
				sessionToken: string;
			};
			_id: string;
			index: string;
			mail: string;
			__v: number;
		};
	};
};

export type SigninResponse = SigninSuccessResponse | FailedResponse;

export async function login(data: SigninBody): Promise<SigninResponse> {
	const response: AxiosResponse<SigninResponse> = await appAPI.post(`/api/v1/login`, data, {
		withCredentials: true,
	});
	return response.data;
}

export const getUserSchema = z.object({
	token: z.string(),
});

export type GetUserBody = z.infer<typeof getUserSchema>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getUser(data: GetUserBody): Promise<any> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const response: AxiosResponse<any> = await appAPI.post(`/api/v1/getUser`, data, {
		withCredentials: true,
	});
	return response.data;
}
