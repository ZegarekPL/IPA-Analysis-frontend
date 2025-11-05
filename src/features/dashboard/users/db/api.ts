import { AxiosResponse } from 'axios';
import { ApiResponse, appAPI } from '@/utils/appAPI';

export interface User {
	_id: string;
	index: string;
	mail: string;
	role: 'user' | 'admin';
	createdAt: string;
	updatedAt: string;
}

export async function getUsers(): Promise<User[]> {
	try {
		const response: AxiosResponse<ApiResponse<{ users: User[] }>> = await appAPI.get(`/api/v1/admin/users`, {
			withCredentials: true,
		});

		if (response.status === 200 && response.data?.data?.users) {
			console.log('Users fetched:', response.data.data.users);
			return response.data.data.users;
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

export async function getUser(id: string): Promise<User[]> {
	try {``
		const response: AxiosResponse<ApiResponse<{ users: User[] }>> = await appAPI.get(`/api/v1/admin/users/${id}`, {
			withCredentials: true,
		});

		if (response.status === 200 && response.data?.data?.users) {
			console.log('Users fetched:', response.data.data.users);
			return response.data.data.users;
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
	try {``
		const response: AxiosResponse<ApiResponse<{ users: User[] }>> = await appAPI.delete(`/api/v1/admin/users/${id}`, {
			withCredentials: true,
		});

		if (response.status === 200 && response.data?.data?.users) {
			console.log('Users fetched:', response.data.data.users);
			return response.data.data.users;
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
	try {``
		const response: AxiosResponse<ApiResponse<{ users: User[] }>> = await appAPI.patch(`/api/v1/admin/users/${id}/role`, {
			withCredentials: true,
		});

		if (response.status === 200 && response.data?.data?.users) {
			console.log('Users fetched:', response.data.data.users);
			return response.data.data.users;
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
