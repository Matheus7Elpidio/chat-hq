import { useEffect, useState } from "react";
import { UserSector, columns } from "./columns";
import { UserSectorDataTable } from "./data-table";
import { ManageSectorsModal } from "./ManageSectorsModal";

async function getUsers(): Promise<UserSector[]> {
  const response = await fetch("http://localhost:3001/api/users");
  const data = await response.json();
  return data;
}

const UserSectorManagement = () => {
  const [data, setData] = useState<UserSector[]>([]);
  const [editingUser, setEditingUser] = useState<UserSector | null>(null);

  useEffect(() => {
    getUsers().then(setData);
  }, []);

  const addUser = async (user: Omit<UserSector, 'id' | 'status'>) => {
    const response = await fetch("http://localhost:3001/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (response.ok) {
      const newUser = await response.json();
      setData([...data, newUser]);
    }
  };

  const updateUser = async (id: string, updatedFields: Partial<UserSector>) => {
    const response = await fetch(`http://localhost:3001/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedFields),
    });

    if (response.ok) {
      const updatedData = data.map((user) =>
        user.id === id ? { ...user, ...updatedFields } : user
      );
      setData(updatedData);
    }
  };

  const deleteUser = async (id: string) => {
    const response = await fetch(`http://localhost:3001/api/users/${id}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        const updatedData = data.filter((user) => user.id !== id);
        setData(updatedData);
    }
  };

  const openManageSectorsModal = (user: UserSector) => {
    setEditingUser(user);
  };

  const closeManageSectorsModal = () => {
    setEditingUser(null);
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Adicionar Novo Usuário</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const name = (form.elements.namedItem("userName") as HTMLInputElement).value;
            const email = (form.elements.namedItem("userEmail") as HTMLInputElement).value;
            const role = (form.elements.namedItem("userRole") as HTMLInputElement).value as UserSector['role'];
            addUser({ name, email, role, sectors: [] });
            form.reset();
          }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <input name="userName" type="text" placeholder="Nome" className="border p-2 rounded-md" />
          <input name="userEmail" type="email" placeholder="Email" className="border p-2 rounded-md" />
          <input name="userRole" type="text" placeholder="Função" className="border p-2 rounded-md" />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Adicionar</button>
        </form>
      </div>
      <UserSectorDataTable 
        columns={columns({ updateUser, deleteUser, openManageSectorsModal })} 
        data={data} 
      />
      {editingUser && (
        <ManageSectorsModal
          user={editingUser}
          onClose={closeManageSectorsModal}
          updateUserSectors={updateUser}
        />
      )}
    </div>
  );
};

export default UserSectorManagement;
