import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/modules/dashboard/app-sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className="flex flex-col min-h-screen bg-background gap-4 p-6">
				<SidebarTrigger />
				{children}
			</main>
		</SidebarProvider>
	);
};

export default DashboardLayout;
