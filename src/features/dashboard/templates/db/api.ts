import { AxiosResponse } from 'axios';

import { ApiResponse, appAPI } from '@/utils/appAPI';
import { z } from 'zod';

export type ClosedQuestion = z.infer<typeof closedQuestionSchema>;

export const closedQuestionSchema = z.object({
	text: z.string(),
	type: z.enum(['importance', 'performance']),
});

export type Templates = z.infer<typeof templatesSchema>;

export const templatesSchema = z.object({
	_id: z.string(),
	name: z.string(),
	description: z.string(),
	closedQuestions: z.array(closedQuestionSchema),
	openQuestion: z.object({
		text: z.string(),
	}),
	createdBy: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type TemplateTableRow = {
	id: string;
	name: string;
	description: string;
	closedQuestions: ClosedQuestion[];
	openQuestion: string;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
};

export async function getTemplates() {
	try {
		const response: AxiosResponse<ApiResponse<Templates[]>> = await appAPI.get(`/api/v1/admin/templates`, {
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
		const response: any = await appAPI.post(`/api/v1/admin/templates`, templates, {
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

export interface EditTemplatesFormProps {
	template: {
		id: string;
		name: string;
		description: string;
		closedQuestions: ClosedQuestion[];
		openQuestion: {
			text: string;
		};
	};
};

export async function editTemplates(templateId: string, template: CreateTemplates) {
	try {
		const response: any = await appAPI.put(`/api/v1/admin/templates/${templateId}`, template, {
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

export async function deleteTemplates(templateId: string) {
	try {
		const response: any = await appAPI.delete(`/api/v1/admin/templates/${templateId}`, {
			withCredentials: true,
		});
		if (response.status === 204) {
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