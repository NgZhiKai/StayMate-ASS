import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import { User } from "../../types/User";
import { GradientButton } from "../Button";
import { ConfirmationModal } from "../Modal";

interface Props {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  icon: React.ReactNode;
}

const UsersTable: React.FC<Props> = ({ users, onEdit, onDelete, icon }) => {
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setConfirmationOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      onDelete(userToDelete.id);
      setUserToDelete(null);
    }
    setConfirmationOpen(false);
  };

  return (
    <>
      <div className="overflow-x-auto bg-white rounded-xl shadow mb-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 flex items-center gap-2">
                  {icon}
                  <span className="font-medium text-gray-800">
                    {user.firstName} {user.lastName}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-gray-600">{user.phoneNumber}</td>
                <td className="px-6 py-4 flex gap-2">
                  <GradientButton
                    onClick={() => onEdit(user)}
                    gradient="from-green-400 to-green-500"
                    className="px-3 py-1 text-sm"
                  >
                    <Edit size={16} />
                  </GradientButton>

                  <GradientButton
                    onClick={() => handleDeleteClick(user)}
                    gradient="from-red-400 to-red-500"
                    className="px-3 py-1 text-sm"
                  >
                    <Trash size={16} />
                  </GradientButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {userToDelete && (
        <ConfirmationModal
          isOpen={confirmationOpen}
          onClose={() => setConfirmationOpen(false)}
          onConfirm={confirmDelete}
          type="danger"
          message={`Are you sure you want to delete <strong>${userToDelete.firstName} ${userToDelete.lastName}</strong>? This action cannot be undone.`}
          confirmText="Delete"
        />
      )}
    </>
  );
};

export default UsersTable;