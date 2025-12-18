import { AxiosResponse } from 'axios';

import { appAPI } from '@/utils/appAPI';
import { FailedResponse } from '@/utils/FailedResponse';

export type LogoutSuccessResponse = {
	status: 'success';
	message: string;
};

export type LogoutResponse = LogoutSuccessResponse | FailedResponse;

export async function logout(): Promise<LogoutResponse> {
	const response: AxiosResponse<LogoutResponse> = await appAPI.post(
		`/api/v1/logout`,
		{},
		{
			withCredentials: true,
		},
	);
	if (response.data.status === 'success') {
		return response.data;
	}
	throw new Error('Failed to logout');
}
