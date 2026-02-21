import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo, updateUser, deleteUser } from "../services/userApi";
import { AuthContext } from "../contexts/AuthContext";
import AccountSettingsForm from "../components/User/AccountSettingsForm";

const UserAccountSettings = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "",
  });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch user info
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userId = sessionStorage.getItem("userId");
      if (!userId) throw new Error("User not logged in.");

      const { user } = await getUserInfo(userId);
      setUserInfo({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to load user info.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // ---------------- Name & Phone ----------------
  const handleNamePhoneUpdate = async (firstName: string, lastName: string, phoneNumber: string) => {
    try {
      const userId = sessionStorage.getItem("userId");
      if (!userId) throw new Error("User not logged in.");

      await updateUser(userId, { ...userInfo, firstName, lastName, phoneNumber });
      setUserInfo((prev) => ({ ...prev, firstName, lastName, phoneNumber }));
      alert("Name and phone updated successfully!");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update name/phone.");
    }
  };

  // ---------------- Email ----------------
  const handleEmailChange = async (email: string) => {
    if (!email.trim()) return;

    try {
      const userId = sessionStorage.getItem("userId");
      if (!userId) throw new Error("User not logged in.");

      await updateUser(userId, { ...userInfo, email });
      setUserInfo((prev) => ({ ...prev, email }));
      setNewEmail("");
      alert("Email updated successfully!");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update email.");
    }
  };

  // ---------------- Password ----------------
  const handlePasswordChange = async () => {
    if (!passwords.currentPassword || !passwords.newPassword) {
      return alert("Please fill all password fields.");
    }

    try {
      const userId = sessionStorage.getItem("userId");
      if (!userId) throw new Error("User not logged in.");

      await updateUser(userId, { ...userInfo, password: passwords.newPassword });
      setPasswords({ currentPassword: "", newPassword: "" });
      alert("Password changed successfully!");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to change password.");
    }
  };

  // ---------------- Delete Account ----------------
  const handleDeleteAccount = async () => {
    const userId = sessionStorage.getItem("userId");
    if (!userId || !window.confirm("Are you sure you want to delete your account?")) return;

    try {
      const response = await deleteUser(userId);
      alert(response.message);
      logout();
      navigate("/");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete account.");
    }
  };

  if (loading) return <div className="text-center mt-10 text-gray-700 text-lg">Loading...</div>;

  return (
      <div
        className="h-[calc(98vh-4rem)] flex items-center justify-center p-6 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
      >
      <AccountSettingsForm
        userInfo={userInfo}
        newEmail={newEmail}
        setNewEmail={setNewEmail}
        passwords={passwords}
        setPasswords={setPasswords}
        handleNamePhoneUpdate={handleNamePhoneUpdate}
        handleEmailChange={handleEmailChange}
        handlePasswordChange={handlePasswordChange}
        handleDeleteAccount={handleDeleteAccount}
      />
    </div>
  );
};

export default UserAccountSettings;