import { useEffect, useState } from "react";
import { Shortcut, columns } from "./columns";
import { ShortcutsDataTable } from "./data-table";

async function getShortcuts(): Promise<Shortcut[]> {
  const response = await fetch("http://localhost:3001/api/shortcuts");
  const data = await response.json();
  return data.map(item => ({...item, id: item.id.toString()})); // Garante que o ID seja string
}

const ShortcutsManagement = () => {
  const [data, setData] = useState<Shortcut[]>([]);

  useEffect(() => {
    getShortcuts().then(setData);
  }, []);

  const addShortcut = async (shortcut: Omit<Shortcut, 'id'>) => {
    const res = await fetch("http://localhost:3001/api/shortcuts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shortcut),
    });
    if (res.ok) {
      const newShortcut = await res.json();
      setData([...data, { ...newShortcut, id: newShortcut.id.toString() }]);
    }
  };

  const updateShortcut = async (id: string, updatedFields: Partial<Shortcut>) => {
    const res = await fetch(`http://localhost:3001/api/shortcuts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedFields),
    });

    if (res.ok) {
      const updatedData = data.map((shortcut) =>
        shortcut.id === id ? { ...shortcut, ...updatedFields } : shortcut
      );
      setData(updatedData);
    }
  };

  const deleteShortcut = async (id: string) => {
    const res = await fetch(`http://localhost:3001/api/shortcuts/${id}`, {
        method: 'DELETE',
    });

    if (res.ok) {
      setData(data.filter((shortcut) => shortcut.id !== id));
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Adicionar Novo Atalho</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const name = (form.elements.namedItem("name") as HTMLInputElement).value;
            const content = (form.elements.namedItem("content") as HTMLTextAreaElement).value;
            const sector = (form.elements.namedItem("sector") as HTMLInputElement).value;
            addShortcut({ name, content, sector });
            form.reset();
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <input name="name" type="text" placeholder="Nome do atalho (ex: /saudacao)" className="border p-2 rounded-md" />
          <textarea name="content" placeholder="Conteúdo do atalho" className="border p-2 rounded-md" />
          <input name="sector" type="text" placeholder="Setor" className="border p-2 rounded-md" />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Adicionar Atalho</button>
        </form>
      </div>
      <ShortcutsDataTable 
        columns={columns({ updateShortcut, deleteShortcut })} 
        data={data} 
      />
    </div>
  );
};

export default ShortcutsManagement;
