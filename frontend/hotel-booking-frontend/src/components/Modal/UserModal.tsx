import { Shield, UserIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { InputField, PhoneField, SelectField } from "../../components/Form";
import { User } from "../../types/User";
import { GradientButton } from "../Button";

type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: User) => void;
  currentUser: User | null;
};

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentUser,
}) => {
  const [user, setUser] = useState<User>({
    firstName: "",
    lastName: "",
    email: "",
    role: "USER",
    phoneNumber: "",
    id: 0,
  });
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      if (currentUser) {
        setUser({
          ...currentUser,
          role: currentUser.role === "CUSTOMER" ? "USER" : currentUser.role,
        });
      } else {
        setUser({
          firstName: "",
          lastName: "",
          email: "",
          role: "USER",
          phoneNumber: "",
          id: 0,
        });
        setPassword("");
        setConfirmPassword("");
        setPasswordError("");
        setNameError("");
      }
    }
  }, [isOpen, currentUser]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    name === "password" ? setPassword(value) : setConfirmPassword(value);
  };

  const handleNameInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: "firstName" | "lastName"
  ) => {
    const value = e.currentTarget.value;
    const regex = /^[a-zA-Z ]*$/; // Allow letters and spaces only
    if (regex.test(value)) {
      setUser({ ...user, [name]: value });
      setNameError("");
    } else {
      setNameError("Names can only contain letters and spaces.");
    }
  };

  const handleSubmit = (
    e: Parameters<NonNullable<React.ComponentProps<"form">["onSubmit"]>>[0]
  ) => {
    e.preventDefault();

    if (!currentUser) {
      if (password !== confirmPassword) {
        setPasswordError("Passwords do not match!");
        return;
      }

      if (password.length < 8) {
        setPasswordError("Password must be at least 8 characters.");
        return;
      }
    }

    if (nameError) return;

    setPasswordError("");

    const updatedUser = {
      ...user,
      role: user.role === "USER" ? "CUSTOMER" : user.role,
      ...(currentUser ? {} : { password, confirmPassword }),
    };

    onSubmit(updatedUser);
  };

  if (!isOpen) return null;

  const isAdmin =
    (currentUser?.role === "ADMIN") ||
    (!currentUser && user.role === "ADMIN");

  const headerGradient = isAdmin
    ? "from-indigo-600 via-purple-600 to-pink-500"
    : "from-blue-500 via-indigo-500 to-purple-500";

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
        aria-label="Close user modal"
      />

      {/* Modal */}
      <div className="fixed inset-0 flex justify-center items-center z-50 px-4 select-none">
        <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-modalEnter">
          {/* Header */}
          <div
            className={`bg-gradient-to-r ${headerGradient} px-8 py-6 text-white relative`}
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                {isAdmin ? <Shield size={22} /> : <UserIcon size={22} />}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {currentUser ? "Edit User" : "Create User"}
                </h2>
                <p className="text-sm opacity-90">
                  {currentUser
                    ? "Update user information."
                    : "Fill details to create a new account."}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="absolute top-5 right-6 text-white/80 hover:text-white text-2xl transition"
              onClick={onClose}
            >
              &times;
            </button>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="First Name"
                  type="text"
                  name="firstName"
                  value={user.firstName}
                  onChange={(e) => handleNameInput(e, "firstName")}
                  required
                />
                <InputField
                  label="Last Name"
                  type="text"
                  name="lastName"
                  value={user.lastName}
                  onChange={(e) => handleNameInput(e, "lastName")}
                  required
                />
              </div>
              {nameError && <div className="text-sm text-red-500">{nameError}</div>}

              {/* Email */}
              <InputField
                label="Email"
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                required
              />

              {/* Phone */}
              <PhoneField value={user.phoneNumber} onChange={(val) => setUser({...user, phoneNumber: val})} />

              {/* Role */}
              {!currentUser && (
                <SelectField
                  label="Account Type"
                  name="role"
                  value={user.role}
                  options={[
                    { value: "USER", label: "User" },
                    { value: "ADMIN", label: "Admin" },
                  ]}
                  onChange={handleChange}
                />
              )}

              {/* Password */}
              {!currentUser && (
                <div className="space-y-4">
                  <InputField
                    label="Password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                  <InputField
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
              )}
              {passwordError && (
                <div className="text-sm text-red-500">{passwordError}</div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6">
                <GradientButton
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl hover:scale-110"
                >
                  Cancel
                </GradientButton>
                <GradientButton
                  type="submit"
                  gradient={headerGradient}
                  className="px-5 py-3 rounded-xl hover:scale-110"
                >
                  {currentUser ? "Update User" : "Create User"}
                </GradientButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserModal;
