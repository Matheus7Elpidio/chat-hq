import { useState, useEffect } from 'react';
import { UserSector } from './columns';

interface ManageSectorsModalProps {
  user: UserSector;
  onClose: () => void;
  updateUserSectors: (id: string, updatedFields: Partial<UserSector>) => void;
}

export const ManageSectorsModal = ({ user, onClose, updateUserSectors }: ManageSectorsModalProps) => {
    const [availableSectors, setAvailableSectors] = useState<string[]>([]);
    const [selectedSectors, setSelectedSectors] = useState<string[]>(user.sectors || []);

    useEffect(() => {
        fetch('http://localhost:3001/api/sectors')
            .then(res => res.json())
            .then(data => setAvailableSectors(data.map((sector: any) => sector.name)));
    }, []);

    const handleSectorChange = (sector: string) => {
        setSelectedSectors(prev => 
            prev.includes(sector) ? prev.filter(s => s !== sector) : [...prev, sector]
        );
    };

    const handleSave = () => {
        updateUserSectors(user.id, { sectors: selectedSectors });
        onClose();
    };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-lg font-semibold mb-4">Vincular Setores a {user.name}</h2>
        <div className="space-y-2">
            {availableSectors.map(sector => (
                <div key={sector} className="flex items-center">
                    <input 
                        type="checkbox" 
                        id={sector} 
                        checked={selectedSectors.includes(sector)}
                        onChange={() => handleSectorChange(sector)}
                        className="mr-2"
                    />
                    <label htmlFor={sector}>{sector}</label>
                </div>
            ))}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200">Cancelar</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-md bg-blue-500 text-white">Salvar</button>
        </div>
      </div>
    </div>
  );
};
