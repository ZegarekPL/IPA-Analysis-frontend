'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export default function UserPage() {
	const user = {
		name: 'Jan Kowalski',
		email: 'jan@example.com',
		role: 'admin',
		avatarUrl: 'https://i.pravatar.cc/150?img=52',
	};

	return (
		<div className="w-full flex items-center justify-center px-6">
			<Card>
				<CardHeader className="flex flex-col items-center gap-4">
					<Avatar className="h-24 w-24">
						<AvatarImage src={user.avatarUrl} alt={user.name} />
						<AvatarFallback>
							{user.name
								.split(' ')
								.map((n) => n[0])
								.join('')}
						</AvatarFallback>
					</Avatar>
					<div className="text-center">
						<CardTitle>{user.name}</CardTitle>
						<p className="text-sm text-muted-foreground">{user.email}</p>
						<Badge variant="outline" className="mt-1 capitalize">
							{user.role}
						</Badge>
					</div>
				</CardHeader>
				<Separator />
				<CardContent className="space-y-6 mt-6">
					<section>
						<h3 className="text-lg font-semibold mb-2">Profile Information</h3>
						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<Label htmlFor="name" className="py-2">
									Full Name
								</Label>
								<Input id="name" value={user.name} readOnly />
							</div>
							<div>
								<Label htmlFor="email" className="py-2">
									Email
								</Label>
								<Input id="email" value={user.email} readOnly />
							</div>
						</div>
					</section>

					<section>
						<h3 className="text-lg font-semibold mb-2">Settings</h3>
						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<Label htmlFor="language" className="py-2">
									Preferred language
								</Label>
								<Input id="language" value="English" readOnly />
							</div>
							<div>
								<Label htmlFor="theme" className="py-2">
									Preferred theme
								</Label>
								<Input id="theme" value="System" readOnly />
							</div>
						</div>
					</section>
				</CardContent>
			</Card>
		</div>
	);
}
