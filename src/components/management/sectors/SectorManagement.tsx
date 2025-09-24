import { useEffect, useState } from "react";
import { Sector, columns } from "./columns";
import { SectorDataTable } from "./data-table";

async function getSectors(): Promise<Sector[]> {
  const response = await fetch("http://localhost:3001/api/sectors");
  const data = await response.json();
  return data;
}

const SectorManagement = () => {
  const [data, setData] = useState<Sector[]>([]);

  useEffect(() => {
    getSectors().then(setData);
  }, []);

  const addSector = async (name: string) => {
    const response = await fetch("http://localhost:3001/api/sectors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    if (response.ok) {
      const newSector = await response.json();
      setData([...data, newSector]);
    }
  };

  const updateSector = async (id: string, name: string) => {
    const response = await fetch(`http://localhost:3001/api/sectors/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
    });

    if (response.ok) {
        const updatedData = data.map((sector) =>
            sector.id === id ? { ...sector, name } : sector
        );
        setData(updatedData);
    }
  };

  const deleteSector = async (id: string) => {
    const response = await fetch(`http://localhost:3001/api/sectors/${id}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        const updatedData = data.filter((sector) => sector.id !== id);
        setData(updatedData);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Adicionar Novo Setor</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const input = form.elements.namedItem("sectorName") as HTMLInputElement;
            addSector(input.value);
            form.reset();
          }}
          className="flex items-center"
        >
          <input
            name="sectorName"
            type="text"
            placeholder="Nome do Setor"
            className="border p-2 rounded-l-md w-full"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-md">
            Adicionar
          </button>
        </form>
      </div>
      <SectorDataTable 
        columns={columns({ updateSector, deleteSector })} 
        data={data} 
      />
    </div>
  );
};

export default SectorManagement;
