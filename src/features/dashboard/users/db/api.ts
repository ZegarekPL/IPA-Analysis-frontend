import { AxiosResponse } from 'axios';

import { appAPI } from '@/utils/appAPI';
import { AppError, mapApiError } from '@/utils/getErrorMessage';

export interface GetUsersResponse {
	total: number;
	data: User[];
}

export interface User {
	_id: string;
	index: string;
	mail: string;
	role: 'user' | 'admin';
	createdAt: string;
	updatedAt: string;
}

export async function getUsers({
	page,
	rowsPerPage,
	search,
}: {
	page: number;
	rowsPerPage: number;
	search: string;
}): Promise<GetUsersResponse> {
	try {
		const response: AxiosResponse<GetUsersResponse> = await appAPI.post(
			`/api/v1/admin/users`,
			{
				page,
				rowsPerPage,
				search,
			},
			{
				withCredentials: true,
			},
		);
		return response.data ?? { total: 0, data: [] };
	} catch (error: any) {
		const errorCode = mapApiError(error);

		if (errorCode === 'UNAUTHORIZED') {
			window.location.replace('/login');
			throw new AppError('UNAUTHORIZED', 401);
		}
		throw new AppError(errorCode, error.response?.status);
	}
}

export async function getUserById(id: string): Promise<User[]> {
	try {
		const response: AxiosResponse<{ users: User[] }> = await appAPI.get(`/api/v1/admin/users/${id}`, {
			withCredentials: true,
		});

		if (response.status === 200 && response.data?.users) {
			console.log('Users fetched:', response.data.users);
			return response.data.users;
		} else if (response.status === 401) {
			window.location.replace('/login');
			return [];
		} else {
			console.error('Wystąpił błąd podczas pobierania użytkowników');
			return [];
		}
	} catch (error: any) {
		if (error.response?.status === 401) {
			window.location.replace('/login');
		}
		throw new Error('Error500');
	}
}

export async function deleteUser(id: string): Promise<User[]> {
	try {
		const response: AxiosResponse<{ users: User[] }> = await appAPI.delete(`/api/v1/admin/users/${id}`, {
			withCredentials: true,
		});
		console.log('response:', response);
		if (response.status === 200 && response.data?.users) {
			console.log('Users fetched:', response.data.users);
			return response.data.users;
		} else if (response.status === 401) {
			window.location.replace('/login');
			return [];
		} else {
			console.error('Wystąpił błąd podczas pobierania użytkowników');
			return [];
		}
	} catch (error: any) {
		if (error.response?.status === 401) {
			window.location.replace('/login');
		}
		throw new Error('Error500');
	}
}

export async function changeUserRole(id: string): Promise<User[]> {
	try {
		const response: AxiosResponse<{ users: User[] }> = await appAPI.patch(`/api/v1/admin/users/${id}/role`, {
			withCredentials: true,
		});

		if (response.status === 200 && response.data?.users) {
			console.log('Users fetched:', response.data.users);
			return response.data.users;
		} else if (response.status === 401) {
			window.location.replace('/login');
			return [];
		} else {
			console.error('Wystąpił błąd podczas pobierania użytkowników');
			return [];
		}
	} catch (error: any) {
		if (error.response?.status === 401) {
			window.location.replace('/login');
		}
		throw new Error('Error500');
	}
}
