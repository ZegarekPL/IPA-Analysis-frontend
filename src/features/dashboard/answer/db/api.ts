import { appAPI } from '@/utils/appAPI';

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
