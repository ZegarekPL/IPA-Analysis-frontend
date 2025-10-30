import { appAPI } from '@/utils/appAPI';
import { AxiosResponse } from 'axios';

interface ApiResponse<T> {
	status: number;
	data: T;
}

export interface Templates {
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
			console.error('Wystąpił błąd podczas usuwania innego meczu');
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
		if (response.status === 200) {
			console.log('response', response);
			return response.data.data;
		} else if (response.status === 401) {
			window.location.replace('/login');
		} else {
			console.error('Wystąpił błąd podczas usuwania innego meczu');
		}
	} catch (error: any) {
		if (error.response.status === 401) {
			window.location.replace('/login');
		} else {
			throw new Error('Error500');
		}
	}
}

export async function createTemplate(data: any) {
	const res = await fetch(`${appAPI}/templates`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error('Failed to create template');
	return res.json();
}

export async function updateTemplate(id: string, data: any) {
	const res = await fetch(`${appAPI}/templates/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error('Failed to update template');
	return res.json();
}

export async function deleteTemplate(id: string) {
	const res = await fetch(`${appAPI}/templates/${id}`, { method: 'DELETE' });
	if (!res.ok) throw new Error('Failed to delete template');
	return res.json();
}
