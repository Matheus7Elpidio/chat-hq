import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Layouts e Páginas Principais
import Sidebar from "./components/Sidebar";
import AuthPage from "./components/AuthPage";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/DashboardLayout"; // Usando o novo Layout

// Páginas do Cliente
import SectorSelection from "./pages/SectorSelection";
import ClientChat from "./pages/ClientChat";

// Páginas do Agente
import AgentDashboard from "./components/DashboardModular";
import ChatSystem from "./components/ChatSystem";
import AgentAnalytics from "./components/Analytics";
import AgentSettings from "./components/SettingsPage";

// Páginas do Admin/Supervisor
import SupervisorDashboard from "./components/admin/SupervisorDashboard";
import ChatHistory from "./components/admin/ChatHistory";
import RealTimeMonitor from "./components/admin/RealTimeMonitor";
import UsersPage from "./pages/admin/UsersPage";         // Nova página
import ReportsPage from "./pages/admin/ReportsPage";       // Nova página
import AdminSettingsPage from "./pages/admin/SettingsPage"; // Nova página

const queryClient = new QueryClient();

const AppContent = () => {
  const { user } = useAuth();

  if (!user) {
    return <Routes><Route path="*" element={<AuthPage />} /></Routes>;
  }

  switch (user.role) {
    case 'Cliente':
      return (
        <Routes>
          <Route path="/" element={<Navigate to="/select-sector" replace />} />
          <Route path="/select-sector" element={<SectorSelection />} />
          <Route path="/chat-client" element={<ClientChat />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      );

    case 'Admin':
    case 'Supervisor':
      return (
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<SupervisorDashboard />} />
            <Route path="/admin/chat-history" element={<ChatHistory />} />
            <Route path="/admin/monitor" element={<RealTimeMonitor />} />
            {/* ROTAS ADICIONADAS PARA O ADMIN */}
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/reports" element={<ReportsPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      );

    case 'Agente':
    default:
      return (
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<AgentDashboard />} />
            <Route path="/chat" element={<ChatSystem />} />
            <Route path="/analytics" element={<AgentAnalytics />} />
            <Route path="/settings" element={<AgentSettings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      );
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
