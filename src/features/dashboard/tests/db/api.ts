import { AxiosResponse } from 'axios';

import { appAPI } from '@/utils/appAPI';
import { z } from 'zod';
import { AppError, mapApiError } from '@/utils/getErrorMessage';

export interface CreateTest {
	templateId: string;
	groupId: string;
	name: string;
	description: string;
	startsAt: Date;
	endsAt: Date;
}

export async function createTest(test: CreateTest) {
	try {
		const response: any = await appAPI.post(`/api/v1/admin/tests`, test, {
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

export interface GetTestsResponse {
	total: number;
	data: Tests[];
}

export type Tests = z.infer<typeof testsSchema>;

export const testsSchema = z.object({
	_id: z.string(),
	name: z.string(),
	description: z.string(),
	template: z.string(),
	createdBy: z.string(),
	startsAt: z.date(),
	endsAt: z.date(),
	active: z.boolean(),
	createdAt: z.date(),
});

export type TestsTableRow = {
	id: string;
	name: string;
	description: string;
	template: string;
	createdBy: string;
	startsAt: string;
	endsAt: string;
	active: boolean;
	createdAt: string;
};

export async function getTests({
	page,
	rowsPerPage,
	search,
}: {
	page: number;
	rowsPerPage: number;
	search: string;
}): Promise<GetTestsResponse> {
	try {
		const response: AxiosResponse<GetTestsResponse> = await appAPI.post(
			`/api/v1/admin/tests/list`,
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

export interface EditTestsFormProps {
	test: {
		id: string;
		name: string;
		description: string;
		startsAt: string;
		endsAt: string;
		active: boolean;
	};
}

export interface EditTests {
	name: string;
	description: string;
	startsAt: string;
	endsAt: string;
	active: boolean;
}

export async function editTests(testId: string, test: EditTests) {
	try {
		const response: any = await appAPI.patch(`/api/v1/admin/tests/${testId}`, test, {
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
