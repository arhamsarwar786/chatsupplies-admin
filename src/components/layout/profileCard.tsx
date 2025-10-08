"use client"
import React, { useState, useEffect } from "react"

// SVG Icons for visibility toggle with proper TypeScript types
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

const ProfileCard: React.FC<ProfileCardProps> = ({ email, name, onClose }) => {
  const avatarLetter = name ? name.charAt(0).toUpperCase() : ""
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState(name)
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Initialize form data when component mounts or when props change
  useEffect(() => {
    setUsername(name)
  }, [name])

  const handleSignOut = () => {
    localStorage.clear()
    if (typeof window !== 'undefined') {
      window.location.href = "/"
    }
  }

  const handleManageAccount = () => {
    setIsEditing(true)
  }

  const handleClose = () => {
    setIsEditing(false)
    setShowPassword(false)
    setPassword("") // Clear password field when closing
    if (onClose) {
      onClose()
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Update username in localStorage (like your login code does)
      if (username.trim()) {
        localStorage.setItem("username", username.trim())
      }

      // If password is provided, you might want to update it via API
      // For now, we'll just simulate a successful update
      if (password) {
        // Here you would typically call your update password API
        console.log("Updating password...")
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      // Show success message or handle success
      console.log("Profile updated successfully!")
      
      // Close the modal after successful update
      handleClose()
      
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Edit Account Form
  if (isEditing) {
    return (
      <div 
        className="bg-white p-6 rounded-xl shadow-2xl w-96 border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Edit Account</h3>
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
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              placeholder="Enter your username"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={isLoading}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Leave blank to keep current password
            </p>
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
              disabled={isLoading || !username.trim()}
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
    )
  }

  // Profile Card View
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
        <button
          onClick={handleManageAccount}
          className="w-full px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition duration-150"
        >
          Manage your ChatSupplies Account
        </button>

        <div className="flex justify-center w-full mt-4">
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition duration-150"
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