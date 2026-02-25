import { Shield, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { GradientButton } from "../../components/Button";
import { HeroSection } from "../../components/Misc";
import { MessageModal, UserModal } from "../../components/Modal";
import { Pagination } from "../../components/Pagination";
import { UsersTable } from "../../components/User";
import { useUsers } from "../../hooks";

const ITEMS_PER_PAGE = 5;

const ManageUsers: React.FC = () => {
  const {
    users,
    currentUser,
    isModalOpen,
    messageType,
    messageContent,
    messageModalOpen,
    setIsModalOpen,
    setMessageModalOpen,
    openCreateModal,
    openEditModal,
    deleteUser,
    submitUser,
  } = useUsers();

  // Filter valid users
  const validUsers = users.filter((u): u is NonNullable<typeof u> => u !== null);

  // Separate admins and normal users
  const admins = validUsers.filter((u) => u.role === "ADMIN");
  const normalUsers = validUsers.filter((u) => u.role !== "ADMIN");

  // ------------------- Admin Pagination -------------------
  const [adminPage, setAdminPage] = useState(1);
  const adminTotalPages = Math.ceil(admins.length / ITEMS_PER_PAGE);
  const adminPaginated = admins.slice((adminPage - 1) * ITEMS_PER_PAGE, adminPage * ITEMS_PER_PAGE);

  const generateAdminPages = (): (number | string)[] => {
    if (adminTotalPages <= 7) return Array.from({ length: adminTotalPages }, (_, i) => i + 1);
    const pages: (number | string)[] = [1];
    if (adminPage > 4) pages.push("...");
    const start = Math.max(2, adminPage - 1);
    const end = Math.min(adminTotalPages - 1, adminPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (adminPage < adminTotalPages - 3) pages.push("...");
    pages.push(adminTotalPages);
    return pages;
  };

  // ------------------- User Pagination -------------------
  const [userPage, setUserPage] = useState(1);
  const userTotalPages = Math.ceil(normalUsers.length / ITEMS_PER_PAGE);
  const userPaginated = normalUsers.slice((userPage - 1) * ITEMS_PER_PAGE, userPage * ITEMS_PER_PAGE);

  const generateUserPages = (): (number | string)[] => {
    if (userTotalPages <= 7) return Array.from({ length: userTotalPages }, (_, i) => i + 1);
    const pages: (number | string)[] = [1];
    if (userPage > 4) pages.push("...");
    const start = Math.max(2, userPage - 1);
    const end = Math.min(userTotalPages - 1, userPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (userPage < userTotalPages - 3) pages.push("...");
    pages.push(userTotalPages);
    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-50 via-white to-blue-50">
      <HeroSection
        title="Manage Users"
        highlight="Users"
        description="Add, edit and manage admins and users efficiently."
        align="left"
      />

      {/* Admin Section */}
      <section className="max-w-7xl mx-auto px-6 py-8 mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-indigo-600">Admins</h2>
          <GradientButton onClick={openCreateModal} className="px-6 py-3 rounded-full">
            + Create User
          </GradientButton>
        </div>

        <UsersTable
          users={adminPaginated}
          onEdit={openEditModal}
          onDelete={deleteUser}
          icon={<Shield className="text-indigo-500" size={20} />}
        />

        <Pagination
          currentPage={adminPage}
          totalPages={adminTotalPages}
          pages={generateAdminPages()}
          goToPage={setAdminPage}
        />
      </section>

      {/* Normal Users Section */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <h2 className="text-2xl font-semibold text-green-500 mb-4">Users</h2>

        <UsersTable
          users={userPaginated}
          onEdit={openEditModal}
          onDelete={deleteUser}
          icon={<UserIcon className="text-green-400" size={20} />}
        />

        <Pagination
          currentPage={userPage}
          totalPages={userTotalPages}
          pages={generateUserPages()}
          goToPage={setUserPage}
        />
      </section>

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={submitUser}
        currentUser={currentUser}
      />

      {/* Message Modal */}
      <MessageModal
        isOpen={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        type={messageType}
        message={messageContent}
      />
    </div>
  );
};

export default ManageUsers;