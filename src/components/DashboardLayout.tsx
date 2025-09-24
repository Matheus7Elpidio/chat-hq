import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const DashboardLayout = () => (
  <div className="flex min-h-screen w-full bg-muted/40">
    <Sidebar />
    <div className="flex flex-col flex-1">
      <main className="flex-1 p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  </div>
);

export default DashboardLayout;
