import { use } from 'react';

import GroupPageClient from '@/features/dashboard/group/GroupPageClient';

export default function GroupPage({ params }: { params: Promise<{ locale: string; group: string }> }) {
	const { group } = use(params);

	return <GroupPageClient group={group} />;
}
