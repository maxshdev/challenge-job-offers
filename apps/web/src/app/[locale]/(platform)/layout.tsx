import { auth, signIn } from "@/auth";
import Footer from "@/src/components/Footer";
import Sidebar from "@/src/components/layout/SideBar";
import Navbar from "@/src/components/NavBar";
import RedirectToLogin from "@/src/components/RedirectToLogin";
import { ToastProvider } from "@/src/components/ToastContext";

export default async function PlatformLayout({ children }: { children: React.ReactNode }) {

  const session = await auth();
  if (!session?.user) return <RedirectToLogin />;

  return (
    <>
      <div className="drawer lg:drawer-open">
        {/* Drawer toggle */}
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" defaultChecked />

        {/* Main content */}
        <div className="drawer-content">
          <Navbar />
          <main className="flex-1 mx-auto p-8">
            <ToastProvider>
              {children}
            </ToastProvider>
          </main>
        </div>

        {/* Modularized Sidebar */}
        <Sidebar />
      </div>
      {/* <Footer /> */}
    </>
  );
}
