import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import { User } from "../../types/User";
import { formatPhoneNumber } from "../../utils/formatPhoneNumber";
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
    if (userToDelete) onDelete(userToDelete.id);
    setUserToDelete(null);
    setConfirmationOpen(false);
  };

  return (
    <>
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg mb-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-indigo-50 transition duration-200 ease-in-out cursor-pointer rounded-lg"
              >
                <td className="px-6 py-4 flex items-center gap-3">
                  {icon}
                  <div>
                    <span className="font-medium text-gray-800">
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-gray-600">{formatPhoneNumber(user.phoneNumber)}</td>
                <td className="px-6 py-4 flex gap-2">
                  <GradientButton
                    onClick={() => onEdit(user)}
                    gradient="from-green-400 to-green-500"
                    className="px-3 py-1 text-sm rounded-full shadow hover:scale-105 transition-transform duration-200"
                  >
                    <Edit size={20} />
                  </GradientButton>

                  <GradientButton
                    onClick={() => handleDeleteClick(user)}
                    gradient="from-red-400 to-red-500"
                    className="px-3 py-1 text-sm rounded-full shadow hover:scale-105 transition-transform duration-200"
                  >
                    <Trash size={20} />
                  </GradientButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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