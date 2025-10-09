"use client"
import React, { useState, useEffect } from "react"
// Assuming PhoneInput is correctly imported, but since I don't have the file system,
// I'll keep the import as is.
import PhoneInput from "@/src/components/PhoneInput";

// SVG Icons for visibility toggle with proper TypeScript types (Kept as is)
const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2.01 12C2.01 12 5.64 5 12 5C18.36 5 21.99 12 21.99 12C21.99 12 18.36 19 12 19C5.64 19 2.01 12 2.01 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-6.36 0-9.99-7-9.99-7a1.53 1.53 0 0 1 .43-.7L3 12M12 7c2.76 0 5 2.24 5 5a5.55 5.55 0 0 1-1.07 3.23M16.49 16.49L7 7" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

interface ProfileCardProps {
  email: string
  name: string
  onClose?: () => void
}

// --- MODIFIED COMPONENT: UpdatePasswordForm ---
interface UpdatePasswordFormProps {
  handleClose: () => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdatePasswordForm: React.FC<UpdatePasswordFormProps> = ({ handleClose, isLoading, setIsLoading }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // Two separate state variables for independent toggling
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(prev => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!password) {
      setError("Password cannot be empty.");
      return;
    }

    setIsLoading(true);

    try {
      // Here you would typically call your update password API
      console.log("Updating password...");
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log("Password updated successfully!");
      handleClose();
    } catch (error) {
      console.error("Error updating password:", error);
      setError("Failed to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isSaveDisabled = isLoading || !password || password !== confirmPassword;

  return (
    <div
      className="bg-white p-6 rounded-xl shadow-2xl w-96 border border-gray-200"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-4 cursor-pointer">
        <h3 className="text-xl font-bold text-gray-800 cursor-pointer">Change Password</h3>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition duration-150"
          aria-label="Close change password form"
          disabled={isLoading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <div className="relative mt-1">
            <input
              // Use showNewPassword state
              type={showNewPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              disabled={isLoading}
            />
            <button
              type="button"
              // Toggle only New Password visibility
              onClick={toggleNewPasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              aria-label={showNewPassword ? "Hide password" : "Show password"}
              disabled={isLoading}
            >
              {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <div className="relative mt-1">
            <input
              // Use showConfirmPassword state
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              disabled={isLoading}
            />
            <button
              type="button"
              // Toggle only Confirm Password visibility
              onClick={toggleConfirmPasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <div className="pt-2 flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150 disabled:opacity-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-150 disabled:opacity-50 flex items-center gap-2"
            disabled={isSaveDisabled}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              "Change Password"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// --- MODIFIED COMPONENT: ManageChatsForm (Unchanged as it's not related to password logic) ---
interface ManageChatsFormProps {
  handleClose: () => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  name: string; // The original name prop
}

const ManageChatsForm: React.FC<ManageChatsFormProps> = ({ handleClose, isLoading, setIsLoading, name }) => {
  // 1. Updated State Management for Name, Phone, Missing Fields, and Error
  const [form, setForm] = useState({
    name: name,
    phone_number: "" as string | undefined, // phone_number type matches PhoneInput change handler
  });
  const [missing, setMissing] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm(prev => ({ ...prev, name: name }));
  }, [name]);

  // 3. Implement handlePhoneChange as requested
  const handlePhoneChange = (value: string | undefined) => {
    const phoneValue = value || "";
    setForm({ ...form, phone_number: phoneValue });

    if (phoneValue.trim() !== "" && missing.includes("phone_number")) {
      setMissing((prev) =>
        prev.filter((field) => field !== "phone_number")
      );
    }

    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!form.name.trim()) {
      setMissing(prev => [...prev.filter(f => f !== 'name'), 'name']);
      return;
    }

    setIsLoading(true);

    try {
      // Update name in localStorage
      if (form.name.trim()) {
        localStorage.setItem("username", form.name.trim());
      }

      // Simulate saving the new info
      console.log("Updating Name and Number:", form.name, form.phone_number);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log("Account info updated successfully!");

      handleClose();
    } catch (error) {
      console.error("Error updating account info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="bg-white p-6 rounded-xl shadow-2xl w-96 border border-gray-200"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Manage Account Info</h3>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition duration-150"
          aria-label="Close edit form"
          disabled={isLoading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={form.name} // Using form.name
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={`mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${missing.includes("name") ? "border-red-500" : "border-gray-300"}`}
            placeholder="Enter your name"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          {/* 4. Replace Native Input with PhoneInput */}
          <PhoneInput
            // @ts-ignore: Assuming PhoneInput accepts string | undefined for value
            value={form.phone_number}
            onChange={handlePhoneChange}
            className={`mt-1 w-full border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${missing.includes("phone_number") ? "border-red-500" : "border-gray-300"}`}
            disabled={isLoading}
          />
        </div>

        <div className="pt-2 flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150 disabled:opacity-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-150 disabled:opacity-50 flex items-center gap-2"
            disabled={isLoading || !form.name.trim()}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// --- MAIN COMPONENT: ProfileCard (Unchanged) ---
const ProfileCard: React.FC<ProfileCardProps> = ({ email, name, onClose }) => {
  const avatarLetter = name ? name.charAt(0).toUpperCase() : ""

  // Use a string state to manage which modal is open, if any
  const [modalView, setModalView] = useState<'none' | 'manage_account' | 'change_password'>('none');

  // The original component had an 'isEditing' state which I'm replacing with modalView, 
  // but to keep other logic simple, I'll keep the common states
  const [isLoading, setIsLoading] = useState(false)

  // Initialize form data when component mounts or when props change
  useEffect(() => {
    // Note: The previous logic of updating state here is now handled inside ManageChatsForm
  }, [name])

  const handleSignOut = () => {
    localStorage.clear()
    if (typeof window !== 'undefined') {
      window.location.href = "/"
    }
  }

  const handleManageAccount = () => {
    setModalView('manage_account');
  }

  const handleChangePassword = () => {
    setModalView('change_password');
  }

  const handleClose = () => {
    setModalView('none');
    setIsLoading(false); // Reset loading state
    if (onClose) {
      onClose()
    }
  }

  // --- Render logic for the different modals ---

  if (modalView === 'manage_account') {
    return (
      <ManageChatsForm
        handleClose={handleClose}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        name={name}
      />
    );
  }

  if (modalView === 'change_password') {
    return (
      <UpdatePasswordForm
        handleClose={handleClose}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    );
  }


  // Profile Card View (Default View)
  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-xl w-85">
      <div className="flex justify-between w-full">
        <span className="text-sm font-semibold text-gray-600">{email}</span>
        <button
          className="text-gray-400 hover:text-gray-600"
          onClick={handleClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="relative flex items-center justify-center w-24 h-24 mt-8 mb-4 rounded-full bg-gray-800 text-white text-4xl font-bold">
        {avatarLetter}
        <div className="absolute bottom-0 right-0 p-1 bg-white rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-gray-400"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M16.5 6a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM12 10.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM12 12a.5.5 0 110 1 .5.5 0 010-1z" />
          </svg>
        </div>
      </div>

      <h2 className="text-xl font-medium text-gray-800">Hi, {name}!</h2>

      <div className="flex flex-col items-center w-full mt-6 space-y-3">
        {/* NEW BUTTON for Manage Account (Name and Number) */}
        <button
          onClick={handleManageAccount}
          className="w-full px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition duration-150"
        >
          Manage your ChatSupplies Account
        </button>

        {/* NEW BUTTON for Change Password (Password and Confirm Password) */}
        <button
          onClick={handleChangePassword}
          className="w-full px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-full hover:bg-gray-200 transition duration-150"
        >
          Change Password
        </button>


        <div className="flex justify-center w-full mt-4">
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 text-sm cursor-pointer font-medium text-gray-700 hover:text-gray-900 transition duration-150"
          >
            <span className="text-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </span>
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard