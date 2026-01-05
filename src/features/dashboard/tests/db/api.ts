import { appAPI } from '@/utils/appAPI';

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
