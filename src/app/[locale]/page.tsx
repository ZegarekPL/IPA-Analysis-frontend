import { useTranslations } from 'next-intl';

export default function HomePage() {
	const t = useTranslations('HomePage');
	return (
		<main className="flex flex-1 flex-col items-center justify-center text-center px-6 sm:px-12 py-20 gap-6">
			<h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
				{t('title')} <span className="text-blue-600 dark:text-blue-400">My App</span>
			</h1>
			<p className="max-w-xl text-gray-600 dark:text-gray-400 text-lg sm:text-xl">{t('title_desc')}</p>
			<div className="flex flex-col sm:flex-row gap-4 mt-6">
				<a
					href="/login"
					className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-3 text-sm sm:text-base font-medium transition-colors"
				>
					{t('left_button')}
				</a>
				<a
					href="/template"
					className="border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full px-6 py-3 text-sm sm:text-base transition-colors"
				>
					{t('right_button')}
				</a>
			</div>
		</main>
	);
}
