import { AxiosResponse } from 'axios';
import { z } from 'zod';

import { appAPI } from '@/utils/appAPI';
import { FailedResponse } from '@/utils/FailedResponse';

export const signupRequestSchema = z
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

export type SignupBodyRequest = z.infer<typeof signupRequestSchema>;
export type SignupResponse = {
	status: 'Sucess';
	message: string;
};

export type SigninResponse = SignupResponse | FailedResponse;

export async function signupRequest(data: SignupBodyRequest): Promise<SigninResponse> {
	const response: AxiosResponse<SigninResponse> = await appAPI.post(`/api/v1/signup/request`, data, {
		withCredentials: true,
	});
	console.log(response);
	return response.data;
}

export const signupConfirmSchema = z.object({
	mail: z.string().email(),
	code: z.string(),
});

export type SignupBodyConfirm = z.infer<typeof signupConfirmSchema>;

export async function signupConfirm(data: SignupBodyConfirm): Promise<SigninResponse> {
	const response: AxiosResponse<SigninResponse> = await appAPI.post(`/api/v1/signup/confirm`, data, {
		withCredentials: true,
	});
	console.log(response);
	return response.data;
}
