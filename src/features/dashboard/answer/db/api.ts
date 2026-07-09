import { AxiosResponse } from 'axios';

import { appAPI } from '@/utils/appAPI';
import { AppError, mapApiError } from '@/utils/getErrorMessage';

export interface Answer {
	closedAnswers: ClosedAnswer[];
	openAnswer: string;
}

export interface ClosedAnswer {
	questionId: string;
	value: number;
}

export async function subminAnswer(testId: string, answer: Answer) {
	try {
		const response: any = await appAPI.post(`/api/v1/answers/${testId}`, answer, {
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

export interface AvrageAnswersForTestById {
	avgImportance: number;
	avgPerformance: number;
}

export async function getAvrageAnswersForTestById(testId: string): Promise<AvrageAnswersForTestById> {
	try {
		const response: AxiosResponse<any> = await appAPI.get(`/api/v1/admin/answers/results/${testId}`, {
			withCredentials: true,
		});
		if (response.data.status === 'failed') {
			throw new AppError(response.data.message || 'UNKNOWN_ERROR', response.status);
		}

		return response.data.data as AvrageAnswersForTestById;
	} catch (error: any) {
		const errorCode = mapApiError(error);

		if (errorCode === 'UNAUTHORIZED') {
			window.location.replace('/login');
			throw new AppError('UNAUTHORIZED', 401);
		}
		throw new AppError(errorCode, error.response?.status);
	}
}
