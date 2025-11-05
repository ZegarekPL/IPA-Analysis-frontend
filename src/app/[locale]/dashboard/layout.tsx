import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
    <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <div className="flex-1 flex flex-col">
        <header className="h-16 border-b px-4 flex items-center">
            <SidebarTrigger className="mr-4" />
            <h1>My Dashboard</h1>
        </header>
        <main className="p-4 flex-1 overflow-auto">
            {children}
        </main>
        </div>
    </SidebarProvider>
	);
}