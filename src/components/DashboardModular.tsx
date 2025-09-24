import { useAuth } from "@/contexts/AuthContext";
import Dashboard from "./Dashboard";
import AgentDashboard from "./AgentDashboard";
import ClientDashboard from "./ClientDashboard";

const DashboardModular = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case "Admin":
    case "Supervisor":
      return <Dashboard />;
    case "Agente":
      return <AgentDashboard />;
    case "Cliente":
      return <ClientDashboard />;
    default:
      return <Dashboard />;
  }
};

export default DashboardModular;