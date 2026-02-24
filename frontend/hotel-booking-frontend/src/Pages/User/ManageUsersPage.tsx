import { Shield, User as UserIcon } from "lucide-react";
import { GradientButton } from "../../components/Button";
import { MessageModal, UserModal } from "../../components/Modal";
import { HeroSection, UserPagination, UsersTable } from "../../components/User";
import { usePagination, useUsers } from "../../hooks";

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

  // Filter out any nulls just in case
  const validUsers = users.filter((u): u is NonNullable<typeof u> => u !== null);

  const admins = validUsers.filter(u => u.role === "ADMIN");
  const normalUsers = validUsers.filter(u => u.role !== "ADMIN");

  const adminPagination = usePagination(admins, ITEMS_PER_PAGE);
  const userPagination = usePagination(normalUsers, ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-50 via-white to-blue-50">
      <HeroSection />

      {/* Admin Section */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-indigo-600">Admins</h2>
          <GradientButton onClick={openCreateModal} className="px-6 py-3 rounded-full">
            + Create User
          </GradientButton>
        </div>

        <UsersTable
          users={adminPagination.paginatedData}
          onEdit={openEditModal}
          onDelete={deleteUser}
          icon={<Shield className="text-indigo-500" size={20} />}
        />

        <UserPagination
          currentPage={adminPagination.page}
          totalPages={adminPagination.totalPages}
          goToPage={adminPagination.setPage}
        />
      </section>

      {/* Normal Users Section */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <h2 className="text-2xl font-semibold text-green-500 mb-4">Users</h2>

        <UsersTable
          users={userPagination.paginatedData}
          onEdit={openEditModal}
          onDelete={deleteUser}
          icon={<UserIcon className="text-green-400" size={20} />}
        />

        <UserPagination
          currentPage={userPagination.page}
          totalPages={userPagination.totalPages}
          goToPage={userPagination.setPage}
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