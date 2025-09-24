import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SectorManagement from "@/components/management/sectors/SectorManagement";
import UserSectorManagement from "@/components/management/users/UserSectorManagement";
import ShortcutsManagement from "@/components/management/shortcuts/ShortcutsManagement";
import CannedResponsesManagement from "@/components/management/canned-responses/CannedResponsesManagement";

const OrganizationPage = () => {
  return (
    <div className="p-6 bg-dashboard-bg min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Organização</h1>
        <p className="text-muted-foreground">Gerencie toda a estrutura de atendimento da sua empresa.</p>
      </div>

      <Tabs defaultValue="sectors" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sectors">Setores</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="shortcuts">Atalhos</TabsTrigger>
          <TabsTrigger value="responses">Respostas Padrão</TabsTrigger>
        </TabsList>
        <TabsContent value="sectors">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Setores</CardTitle>
              <CardDescription>Crie, edite e remova os setores de atendimento.</CardDescription>
            </CardHeader>
            <CardContent>
                <SectorManagement />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users">
            <Card>
                <CardHeader>
                    <CardTitle>Gerenciamento de Usuários</CardTitle>
                    <CardDescription>Gerencie os agentes e supervisores e vincule-os aos setores.</CardDescription>
                </CardHeader>
                <CardContent>
                    <UserSectorManagement />
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="shortcuts">
            <Card>
                <CardHeader>
                    <CardTitle>Atalhos por Setor</CardTitle>
                    <CardDescription>Configure atalhos de texto para agilizar as respostas dos agentes.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ShortcutsManagement />
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="responses">
            <Card>
                <CardHeader>
                    <CardTitle>Respostas Padrão</CardTitle>
                    <CardDescription>Crie modelos de mensagens para diferentes situações em cada setor.</CardDescription>
                </CardHeader>
                <CardContent>
                    <CannedResponsesManagement />
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizationPage;
