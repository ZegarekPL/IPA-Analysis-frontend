import { AxiosResponse } from 'axios';

import { ApiResponse, appAPI } from '@/utils/appAPI';

export interface CreateGroups {
	name: string;
	description: string;
}

export async function createGroups(group: CreateGroups) {
	try {
		const response: any = await appAPI.post(`/api/v1/admin/groups`, group, {
			withCredentials: true,
		});
		if (response.status === 201) {
			console.log('response', response);
			return response.data.data;
		} else if (response.status === 401) {
			window.location.replace('/login');
		} else {
			console.error('Wystąpił błąd podczas dodawania grupy');
		}
	} catch (error: any) {
		if (error.response.status === 401) {
			window.location.replace('/login');
		} else {
			throw new Error('Error500');
		}
	}
}

export interface EditGroupFormProps {
	group: {
		id: string;
		name: string;
		description: string;
	};
}

export async function editGroups(groupId: string, group: CreateGroups) {
	try {
		const response: any = await appAPI.patch(`/api/v1/admin/groups/${groupId}`, group, {
			withCredentials: true,
		});
		if (response.status === 200) {
			console.log('response', response);
			return response.data.data;
		} else if (response.status === 401) {
			window.location.replace('/login');
		} else {
			console.error('Wystąpił błąd podczas edycji grupy');
		}
	} catch (error: any) {
		if (error.response.status === 401) {
			window.location.replace('/login');
		} else {
			throw new Error('Error500');
		}
	}
}

export async function deleteGroup(groupId: string) {
	try {
		const response: any = await appAPI.delete(`/api/v1/admin/groups/${groupId}`, {
			withCredentials: true,
		});
		if (response.status === 200) {
			console.log('response', response);
			return response.data.data;
		} else if (response.status === 401) {
			window.location.replace('/login');
		} else {
			console.error('Wystąpił błąd podczas usunięcia grupy');
		}
	} catch (error: any) {
		if (error.response.status === 401) {
			window.location.replace('/login');
		} else {
			throw new Error('Error500');
		}
	}
}

export interface Groups {
	_id: string;
	name: string;
	description: string;
	membersCount: number;
	createdAt: Date;
	updatedAt: Date;
}

export async function getAllGroups(): Promise<Groups[]> {
	try {
		const response: AxiosResponse<ApiResponse<{ groups: Groups[] }>> = await appAPI.get(`/api/v1/groups`, {
			withCredentials: true,
		});

		if (response.status === 200 && response.data?.data?.groups) {
			console.log('Groups fetched:', response.data.data.groups);
			return response.data.data.groups;
		} else if (response.status === 401) {
			return [];
		} else {
			console.error('Wystąpił błąd podczas pobierania grup');
			return [];
		}
	} catch (error: any) {
		if (error.response?.status === 401) {
		}
		throw new Error('Error500');
	}
}

export async function getMyGroups(): Promise<Groups[]> {
	try {
		const response: AxiosResponse<ApiResponse<{ groups: Groups[] }>> = await appAPI.get(`/api/v1/groups/me`, {
			withCredentials: true,
		});

		if (response.status === 200 && response.data?.data?.groups) {
			console.log('Groups fetched:', response.data.data.groups);
			return response.data.data.groups;
		} else if (response.status === 401) {
			return [];
		} else {
			console.error('Wystąpił błąd podczas pobierania grup');
			return [];
		}
	} catch (error: any) {
		if (error.response?.status === 401) {
		}
		throw new Error('Error500');
	}
}
