export function mapApiError(error: any): string {
	if (!error?.response) {
		return 'INTERNAL_SERVER_ERROR';
	}

	const { status, data } = error.response;
	if (status === 400) {
		return data?.message || 'BAD_REQUEST';
	}
	if (status === 401) return 'UNAUTHORIZED';
	if (status === 403) return 'FORBIDDEN';
	if (status === 404) {
		return data?.errorCode || 'NOT_FOUND';
	}
	if (status >= 500) return 'INTERNAL_SERVER_ERROR';

	if (data?.errorCode) return data.errorCode;

	return 'UNKNOWN_ERROR';
}

export function mapErrorCodeToI18nKey(errorCode: string): string {
	if (errorCode.includes('.')) {
		const [domain, code] = errorCode.split('.', 2);

		return `Errors.${capitalize(domain)}.${code}`;
	}

	return `Errors.Common.${errorCode}`;
}

function capitalize(value: string) {
	return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export class AppError extends Error {
	errorCode: string;
	status?: number;

	constructor(errorCode: string, status?: number) {
		super(errorCode);
		this.errorCode = errorCode;
		this.status = status;
	}
}

export function getErrorMessage(t: (key: string, options?: any) => string, error: unknown) {
	const errorCode = error instanceof AppError ? error.errorCode : 'UNKNOWN_ERROR';

	const key = mapErrorCodeToI18nKey(errorCode);

	return t(key, {
		defaultValue: t('Errors.Common.UNKNOWN_ERROR'),
	});
}
