import { AxiosResponse } from 'axios';

import { appAPI } from '@/utils/appAPI';
import { AppError, mapApiError } from '@/utils/getErrorMessage';

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

export interface GetGroupsResponse {
	total: number;
	data: Groups[];
}

export interface Groups {
	_id: string;
	name: string;
	description: string;
	isMember: boolean;
	membersCount: number;
	createdAt: Date;
	updatedAt: Date;
}

export async function getAllGroups({
	page,
	rowsPerPage,
	search,
}: {
	page: number;
	rowsPerPage: number;
	search: string;
}): Promise<GetGroupsResponse> {
	try {
		const response: AxiosResponse<GetGroupsResponse> = await appAPI.post(
			`/api/v1/groups`,
			{
				Page: page,
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

export async function getMyGroups({
	page,
	rowsPerPage,
	search,
}: {
	page: number;
	rowsPerPage: number;
	search: string;
}): Promise<GetGroupsResponse> {
	try {
		const response: AxiosResponse<GetGroupsResponse> = await appAPI.post(
			`/api/v1/groups/me`,
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

export interface GroupDetails {
	_id: string;
	name: string;
	description: string;
	membersCount: number;
	isMember: boolean;
	tests: Tests[];
	createdAt: Date;
	updatedAt: Date;
}

export interface Tests {
	test: string;
	assignedAt: Date;
	dueAt: Date;
}

export async function getGroupDetails(groupId: string): Promise<GroupDetails> {
	try {
		const response: AxiosResponse<{ group: GroupDetails }> = await appAPI.get(`/api/v1/groups/${groupId}`, {
			withCredentials: true,
		});
		console.log('response', response);
		if (response.data?.group) {
			console.log('Groups fetched:', response.data.group);
			return response.data.group;
		} else if (response.status === 401) {
			return {} as GroupDetails;
		} else {
			console.error('Wystąpił błąd podczas pobierania grup');
			return {} as GroupDetails;
		}
	} catch (error: any) {
		if (error.response?.status === 401) {
		}
		throw new Error('Error500');
	}
}

export interface GetSMResponse {
	status: string;
	message: string;
}

export async function joinGroup(groupId: string) {
	try {
		const response: AxiosResponse<GetSMResponse> = await appAPI.post(
			`/api/v1/groups/${groupId}/join`,
			{},
			{
				withCredentials: true,
			},
		);
		return response.data;
	} catch (error: any) {
		const errorCode = mapApiError(error);

		if (errorCode === 'UNAUTHORIZED') {
			window.location.replace('/login');
			throw new AppError('UNAUTHORIZED', 401);
		}
		throw new AppError(errorCode, error.response?.status);
	}
}

export async function leaveGroup(groupId: string) {
	try {
		const response: AxiosResponse<GetSMResponse> = await appAPI.post(
			`/api/v1/groups/${groupId}/leave`,
			{},
			{
				withCredentials: true,
			},
		);
		return response.data;
	} catch (error: any) {
		const errorCode = mapApiError(error);

		if (errorCode === 'UNAUTHORIZED') {
			window.location.replace('/login');
			throw new AppError('UNAUTHORIZED', 401);
		}
		throw new AppError(errorCode, error.response?.status);
	}
}
