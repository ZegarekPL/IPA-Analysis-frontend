'use client';

import * as React from 'react';
import { BookCheck, LayoutTemplate, User, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { NavMain } from './nav-main';

import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';

const data = {
	main: [
		{
			name: 'groups',
			url: '/dashboard/groups',
			icon: Users,
		},
	],
	admin: [
		{
			name: 'users',
			url: '/dashboard/users',
			icon: User,
		},
		{
			name: 'templates',
			url: '/dashboard/templates',
			icon: LayoutTemplate,
		},
		{
			name: 'tests',
			url: '/dashboard/tests',
			icon: BookCheck,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<Link href={`/`} className="w-full flex items-center justify-center py-2">
					<Image src="/next.svg" alt="Logo" width={100} height={24} className="dark:invert" />
				</Link>
			</SidebarHeader>
			<SidebarContent>
				<NavMain label={'main'} projects={data.main} />
				<NavMain label={'admin'} projects={data.admin} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
