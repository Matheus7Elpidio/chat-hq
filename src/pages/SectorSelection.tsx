import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Building, ChevronRight } from 'lucide-react';

// Mock de dados de setores
const sectors = [
  { id: 'ti', name: 'Suporte T.I.' },
  // Futuramente, outros setores podem ser adicionados aqui
];

const SectorSelection = () => {
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleStartChat = () => {
    if (selectedSector) {
      navigate(`/chat-client?sector=${selectedSector}`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Building className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>Selecione o Setor</CardTitle>
              <p className="text-muted-foreground text-sm mt-1">
                Escolha com qual departamento você deseja falar.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setSelectedSector}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um setor..." />
            </SelectTrigger>
            <SelectContent>
              {sectors.map((sector) => (
                <SelectItem key={sector.id} value={sector.id}>
                  {sector.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleStartChat} 
            disabled={!selectedSector} 
            className="w-full"
          >
            Iniciar Chat
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SectorSelection;
