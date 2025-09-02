// @ts-nocheck
import React from "react";

const TermsModal = ({ open, onAccept }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Terms & Conditions</h2>
        <p className="mb-6 text-gray-700">
          Please read and accept our Terms & Conditions and Privacy Policy before using the dashboard.
        </p>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded"
          onClick={onAccept}
        >
          Accept & Continue
        </button>
      </div>
    </div>
  );
};

export default TermsModal;