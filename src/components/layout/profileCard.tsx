"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"

interface ProfileCardProps {
  email: string
  name: string
  onClose?: () => void
}

const ProfileCard: React.FC<ProfileCardProps> = ({ email, name, onClose }) => {
  const avatarLetter = name ? name.charAt(0).toUpperCase() : ""
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const handleSignOut = () => {
    localStorage.clear()
    router.push("/")
  }

  const handleManageAccount = () => {
    // MODIFICATION START:
    // 1. Open the modal (pop up)
    setIsModalOpen(true)
    // 2. Close the profile card from the background
    if (onClose) {
      onClose()
    }
    // MODIFICATION END
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-xl w-85">
        {/* Top bar with email and close button */}
        <div className="flex justify-between w-full">
          <span className="text-sm font-semibold text-gray-600">{email}</span>
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            {/* Close Icon */}
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

        {/* Avatar */}
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

        {/* Name and Buttons */}
        <h2 className="text-xl font-medium text-gray-800">Hi, {name}!</h2>

        <div className="flex flex-col items-center w-full mt-6 space-y-3">
          {/* Manage Account */}
          <button
            onClick={handleManageAccount}
            className="w-full px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50"
          >
            Manage your ChatSupplies Account
          </button>

          <div className="flex justify-center w-full mt-4">
            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900"
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

      {/* Manage Account Modal (No black background) */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Edit Account
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
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

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  defaultValue={name}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default ProfileCard