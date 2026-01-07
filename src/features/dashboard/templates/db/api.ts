import { AxiosResponse } from 'axios';
import { z } from 'zod';

import { appAPI } from '@/utils/appAPI';
import { AppError, mapApiError } from '@/utils/getErrorMessage';

export type ClosedQuestion = z.infer<typeof closedQuestionSchema>;

export const closedQuestionSchema = z.object({
	text: z.string(),
	type: z.enum(['importance', 'performance']),
	_id: z.string(),
});

export type ClosedQuestionForm = {
	text: string;
	type: 'importance' | 'performance';
};

export interface GetTemplatesResponse {
	total: number;
	data: Templates[];
}

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
	createdByIndex: z.string(),
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
	createdByIndex: string;
};

export type TemplatesSchemaWithoutCreatedByIndex = z.infer<typeof templatesSchemaWithoutCreatedByIndex>;

export const templatesSchemaWithoutCreatedByIndex = z.object({
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

export async function getTemplates({
	page,
	rowsPerPage,
	search,
}: {
	page: number;
	rowsPerPage: number;
	search: string;
}): Promise<GetTemplatesResponse> {
	try {
		const response: AxiosResponse<GetTemplatesResponse> = await appAPI.post(
			`/api/v1/admin/templates/list`,
			{
				Page: page,
				rowPePage: rowsPerPage,
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

export interface CreateTemplates {
	name: string;
	description: string;
	closedQuestions: ClosedQuestionForm[];
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

export interface TemplatesById {
	status: 'success';
	data: TemplateTableRow;
}

export async function getTemplatesById(templateId: string): Promise<TemplatesById> {
	try {
		const response: AxiosResponse<TemplatesById> = await appAPI.get(`/api/v1/admin/templates/${templateId}`, {
			withCredentials: true,
		});

		if (response.status === 200 && response.data?.status == 'success') {
			console.log('Users fetched:', response.data.data);
			return response.data;
		}
		throw new Error('Unexpected response');
	} catch (error: any) {
		throw new Error('Error500');
	}
}

export interface EditTemplatesFormProps {
	template: {
		id: string;
		name: string;
		description: string;
		closedQuestions: ClosedQuestionForm[];
		openQuestion: {
			text: string;
		};
	};
}

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
