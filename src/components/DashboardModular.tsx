import { useAuth } from "../contexts/AuthContext";
import Dashboard from "./Dashboard";
import AgentDashboard from "./AgentDashboard";
import ClientDashboard from "./ClientDashboard";

const DashboardModular = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case "admin":
    case "supervisor":
      return <Dashboard />;
    case "agent":
      return <AgentDashboard />;
    case "client":
      return <ClientDashboard />;
    default:
      return <Dashboard />;
  }
};

export default DashboardModular;
