import { useEffect, useState } from "react";
import { CannedResponse, columns } from "./columns";
import { CannedResponsesDataTable } from "./data-table";

async function getCannedResponses(): Promise<CannedResponse[]> {
  const response = await fetch("http://localhost:3001/api/canned-responses");
  const data = await response.json();
  return data.map(item => ({...item, id: item.id.toString()})); // Garante que o ID seja string
}

const CannedResponsesManagement = () => {
  const [data, setData] = useState<CannedResponse[]>([]);

  useEffect(() => {
    getCannedResponses().then(setData);
  }, []);

  const addResponse = async (response: Omit<CannedResponse, 'id' | 'createdAt'>) => {
    const res = await fetch("http://localhost:3001/api/canned-responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response),
    });
    if (res.ok) {
      const newResponse = await res.json();
      setData([...data, { ...newResponse, id: newResponse.id.toString() }]);
    }
  };

  const updateResponse = async (id: string, updatedFields: Partial<CannedResponse>) => {
    const res = await fetch(`http://localhost:3001/api/canned-responses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedFields),
    });

    if (res.ok) {
      const updatedData = data.map((response) =>
        response.id === id ? { ...response, ...updatedFields } : response
      );
      setData(updatedData);
    }
  };

  const deleteResponse = async (id: string) => {
    const res = await fetch(`http://localhost:3001/api/canned-responses/${id}`, {
        method: 'DELETE',
    });

    if (res.ok) {
      setData(data.filter((response) => response.id !== id));
    }
  };

  return (
    <div>
        <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Adicionar Nova Resposta</h2>
            <form
            onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const title = (form.elements.namedItem("title") as HTMLInputElement).value;
                const content = (form.elements.namedItem("content") as HTMLTextAreaElement).value;
                const category = (form.elements.nameditem("category") as HTMLInputElement).value;
                const author = "Usuário Atual"; // Substituir pelo usuário logado
                addResponse({ title, content, category, author });
                form.reset();
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
                <input name="title" type="text" placeholder="Título" className="border p-2 rounded-md" />
                <textarea name="content" placeholder="Conteúdo da resposta" className="border p-2 rounded-md" />
                <input name="category" type="text" placeholder="Categoria" className="border p-2 rounded-md" />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Adicionar</button>
            </form>
        </div>
      <CannedResponsesDataTable 
        columns={columns({ updateResponse, deleteResponse })} 
        data={data} 
    />
    </div>
  );
};

export default CannedResponsesManagement;
