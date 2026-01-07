import { AxiosResponse } from 'axios';
import { z } from 'zod';

import { appAPI } from '@/utils/appAPI';

export type PasswordResetResponse = {
	status: string;
	message: string;
};

export const passwordResetRequestSchema = z.object({
	mail: z.string().email(),
});

export type PasswordResetBodyRequest = z.infer<typeof passwordResetRequestSchema>;

export async function passwordResetRequest(data: PasswordResetBodyRequest): Promise<PasswordResetResponse> {
	const response: AxiosResponse<PasswordResetResponse> = await appAPI.post(
		`/api/v1/login/password-reset/request`,
		data,
		{
			withCredentials: true,
		},
	);
	return response.data;
}

export const passwordResetConfirmSchema = z.object({
	mail: z.string().email(),
	code: z
		.string()
		.trim()
		.length(6, 'Code must be 6 characters long')
		.regex(/^\d{6}$/, 'Code must contain only digits'),
	newPassword: z
		.string()
		.min(8, 'Password must be at least 8 characters long')
		.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
		.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
		.regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

export type PasswordResetBodyConfirm = z.infer<typeof passwordResetConfirmSchema>;

export async function passwordResetConfirm(data: PasswordResetBodyConfirm): Promise<PasswordResetResponse> {
	const response: AxiosResponse<PasswordResetResponse> = await appAPI.post(
		`/api/v1/login/password-reset/confirm`,
		data,
		{
			withCredentials: true,
		},
	);
	return response.data;
}
