import { AxiosResponse } from 'axios';
import { z } from 'zod';

import { appAPI } from '@/utils/appAPI';
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

export type GetUserSuccessResponse = {
	status: 'success';
	data: {
		user: {
			_id: string;
			index: string;
			mail: string;
			role: string;
			createdAt: Date;
			updatedAt: Date;
		};
	};
};

export type GetUserResponse = GetUserSuccessResponse | FailedResponse;

export async function getUser(): Promise<GetUserResponse> {
	const response: AxiosResponse<GetUserResponse> = await appAPI.post(
		`/api/v1/login/getUser`,
		{},
		{
			withCredentials: true,
		},
	);
	if (response.data.status === 'success') {
		return response.data;
	}
	throw new Error('Failed to fetch user data');
}
