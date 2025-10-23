"use client"

import { useState } from "react"
import { CheckCircle, Loader2 } from "lucide-react"

export default function TrainingSection() {
  const [progress] = useState(65)


  
  return (
    <div className="w-full ">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left - Training Data Source */}
        <div className="md:col-span-2 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Training & Knowledge Base</h3>

          <div className="space-y-4">
            {/* Option 1 */}
            <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-md cursor-pointer hover:shadow-sm">
              <input type="checkbox" className="mt-1" />
              <div>
                <p className="font-medium text-gray-800">Upload Documents</p>
                <p className="text-sm text-gray-500">PDF, DOC, TXT files</p>
              </div>
            </label>

            {/* Option 2 */}
            <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-md cursor-pointer hover:shadow-sm">
              <input type="checkbox" className="mt-1" />
              <div>
                <p className="font-medium text-gray-800">Website Crawling</p>
                <p className="text-sm text-gray-500">Extract from your website</p>
              </div>
            </label>

            {/* Option 3 */}
            <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-md cursor-pointer hover:shadow-sm">
              <input type="checkbox" className="mt-1" />
              <div>
                <p className="font-medium text-gray-800">FAQ Database</p>
                <p className="text-sm text-gray-500">Import existing Q&A</p>
              </div>
            </label>
          </div>

          {/* Upload Box */}
          <div className="mt-6 border border-dashed border-gray-300 rounded-md p-6 text-center text-gray-500 text-sm">
            <div className="flex flex-col items-center space-y-2">
              <div className="text-3xl">☁️</div>
              <p className="font-medium">Drag & drop files or click to browse</p>
              <p>Supports PDF, DOC, TXT (Max 10MB)</p>
            </div>
          </div>
        </div>

        {/* Right - Progress & Files */}
        <div className="space-y-6">
          {/* Progress Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-sm font-medium text-blue-800 mb-2">Training Progress</p>
            <p className="text-xs text-blue-700 mb-1">Processing documents...</p>
            <div className="w-full h-3 bg-blue-100 rounded-full">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-right text-xs text-blue-700 mt-1">{progress}%</p>
          </div>

          {/* Processed Files */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Processed Files</p>
            <ul className="space-y-3">
              <li className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-red-600 font-medium">
                  <span>📄</span>
                  <span>product-catalog.pdf</span>
                </div>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </li>
              <li className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-blue-600 font-medium">
                  <span>📘</span>
                  <span>faq-document.txt</span>
                </div>
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
