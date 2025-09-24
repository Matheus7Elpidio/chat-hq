import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Layouts e Páginas Principais
import DashboardLayout from "./components/DashboardLayout";
import AuthPage from "./components/AuthPage";
import NotFound from "./pages/NotFound";

// Páginas do Cliente
import SectorSelection from "./pages/SectorSelection";
import ClientChat from "./pages/ClientChat";

// Páginas do Agente
import AgentDashboard from "./components/DashboardModular";
import ChatSystem from "./components/ChatSystem";
import AgentSettingsPage from "./pages/agent/SettingsPage";
import TestPage from "./pages/agent/TestPage"; // Import the TestPage component

// Páginas do Admin/Supervisor
import SupervisorDashboard from "./components/admin/SupervisorDashboard"; 
import ChatHistory from "./components/admin/ChatHistory";
import RealTimeMonitor from "./components/admin/RealTimeMonitor";
import UsersPage from "./pages/admin/UsersPage";
import ReportsPage from "./pages/admin/ReportsPage";
import AdminSettingsPage from "./pages/admin/SettingsPage";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user } = useAuth();

  if (!user) {
    return <Routes><Route path="*" element={<AuthPage />} /></Routes>;
  }

  switch (user.role) {
    case 'client':
      return (
        <Routes>
          <Route path="/" element={<Navigate to="/select-sector" replace />} />
          <Route path="/select-sector" element={<SectorSelection />} />
          <Route path="/chat-client" element={<ClientChat />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      );

    case 'admin':
      return (
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<SupervisorDashboard />} />
            <Route path="/admin/chat-history" element={<ChatHistory />} />
            <Route path="/admin/monitor" element={<RealTimeMonitor />} />
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/reports" element={<ReportsPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      );

    case 'supervisor':
      return (
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<SupervisorDashboard />} />
            <Route path="/admin/chat-history" element={<ChatHistory />} />
            <Route path="/admin/monitor" element={<RealTimeMonitor />} />
            <Route path="/settings" element={<AgentSettingsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      );

    case 'agent':
      return (
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<AgentDashboard />} />
            <Route path="/chat" element={<ChatSystem />} />
            <Route path="/settings" element={<AgentSettingsPage />} />
            <Route path="/test" element={<TestPage />} /> {/* Add the test route */}
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      );
    default:
      return <Routes><Route path="*" element={<NotFound />} /></Routes>;
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
