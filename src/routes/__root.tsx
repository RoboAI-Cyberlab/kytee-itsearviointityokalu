import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { AppSidebar } from '@/app/components/AppSidebar';
import { AppHeader } from '@/app/components/AppHeader';
import { ScrollToTop } from '@/app/components/scroll/ScrollToTop';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useAppStore } from '@/store/appStore';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { sidebarOpen } = useAppStore();

  return (
    <>
      <div className="min-h-full min-w-full bg-[#f6f7f9] flex flex-col">
        <Navigation />
        <main className="min-h-[892px]">
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">
              <SidebarProvider defaultOpen={sidebarOpen}>
                <AppSidebar />
                <SidebarInset>
                  <AppHeader />
                  <ScrollToTop />
                  <Outlet />
                </SidebarInset>
              </SidebarProvider>
            </div>
          </div>
        </main>
        <Footer />
      </div>

      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  );
}
