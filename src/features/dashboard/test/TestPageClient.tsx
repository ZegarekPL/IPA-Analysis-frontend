'use client';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { getAvrageAnswersForTestById } from '../answer/db/api';
import { IpaChart } from './IpaChart';

import { getErrorMessage } from '@/utils/getErrorMessage';

interface Props {
	test: string;
}

export default function TestPageClient({ test }: Props) {
	const id = test.split('-').at(-1)!;
	const t = useTranslations();
	const { data, isLoading, isError, error, refetch } = useQuery({
		queryKey: ['test', id],
		queryFn: () => getAvrageAnswersForTestById(id),
	});

	if (isLoading) {
		return <p className="text-center mt-10">{t('Common.loading')}</p>;
	}

	if (isError) {
		return (
			<div className="text-center mt-10">
				<p className="text-red-500">{getErrorMessage(t, error)}</p>

				<button onClick={() => refetch()} className="mt-4 underline text-sm">
					{t('Common.try_again')}
				</button>
			</div>
		);
	}

	const points = [{ label: 'Average', importance: data!.avgImportance, performance: data!.avgPerformance }];

	return (
		<div className="p-6">
			<IpaChart points={points} />
		</div>
	);
}
