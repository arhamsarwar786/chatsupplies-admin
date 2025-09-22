{/* Profile Modal */}
import React from "react"

interface ProfileCardProps {
  email: string
  name: string
  onClose?: () => void
}

const ProfileCard: React.FC<ProfileCardProps> = ({ email, name, onClose }) => {
  const avatarLetter = name ? name.charAt(0).toUpperCase() : ""

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-xl w-85">
      {/* Top bar with email and close button */}
      <div className="flex justify-between w-full">
        <span className="text-sm font-semibold text-gray-600">{email}</span>
        <button
          className="text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          {/* Close Icon (SVG) */}
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

      {/* Avatar section */}
      <div className="relative flex items-center justify-center w-24 h-24 mt-8 mb-4 rounded-full bg-gray-800 text-white text-4xl font-bold">
        {avatarLetter}
        <div className="absolute bottom-0 right-0 p-1 bg-white rounded-full">
          {/* Camera Icon (SVG) */}
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

      {/* Name and buttons */}
      <h2 className="text-xl font-medium text-gray-800">Hi, {name}!</h2>

      <div className="flex flex-col items-center w-full mt-6 space-y-3">
        <button className="w-full px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50">
          Manage your ChatSupplies Account
        </button>

        <div className="flex justify-around w-full mt-4">
          <button className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900">
            <span className="text-blue-500">
              {/* Add account Icon (SVG) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
              </svg>
            </span>
            <span>Add account</span>
          </button>

          <button className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900">
            <span className="text-blue-500">
              {/* Sign out Icon (SVG) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M16 11V5l-6-5v4H4v13l4-4h4v5l6-5V11z" />
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