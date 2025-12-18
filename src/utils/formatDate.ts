export function formatDate(date: Date | string, locale?: string) {
	return new Date(date).toLocaleString(locale ?? navigator.language, {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
}

export function formatDateISO(date: Date | string) {
	return new Intl.DateTimeFormat('en-GB', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	}).format(new Date(date));
}
