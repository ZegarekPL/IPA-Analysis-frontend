import { ApiResponse, appAPI } from '@/utils/appAPI';
import { AxiosResponse } from 'axios';

export interface Templates {
	_id: string;
	name: string;
	description: string;
	closedQuestions: ClosedQuestion[];
	openQuestion: {
		text: string;
	};
	createdBy: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface ClosedQuestion {
	text: string;
	type: 'importance' | 'performance';
}

export async function getTemplates() {
	try {
		const response: AxiosResponse<ApiResponse<Templates[]>> = await appAPI.get(`/api/v1/templates`, {
			withCredentials: true,
		});
		if (response.status === 200) {
			console.log('response', response);
			return response.data.data;
		} else if (response.status === 401) {
			window.location.replace('/login');
		} else {
			console.error('Wystąpił błąd podczas pobierania templates');
		}
	} catch (error: any) {
		if (error.response.status === 401) {
			window.location.replace('/login');
		} else {
			throw new Error('Error500');
		}
	}
}

export interface CreateTemplates {
	name: string;
	description: string;
	closedQuestions: ClosedQuestion[];
	openQuestion: {
		text: string;
	};
}

export async function createTemplates(templates: CreateTemplates) {
	try {
		const response: any = await appAPI.post(`/api/v1/templates`, templates, {
			withCredentials: true,
		});
		if (response.status === 201) {
			console.log('response', response);
			return response.data.data;
		} else if (response.status === 401) {
			window.location.replace('/login');
		} else {
			console.error('Wystąpił błąd podczas dodawania templates');
		}
	} catch (error: any) {
		if (error.response.status === 401) {
			window.location.replace('/login');
		} else {
			throw new Error('Error500');
		}
	}
}

