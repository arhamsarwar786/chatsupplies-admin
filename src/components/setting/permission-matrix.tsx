import React from 'react';

type Permission = {
  name: string;
  description: string;
  superAdmin: boolean;
  admin: boolean;
  manager: boolean;
  editor: boolean;
};

const PermissionMatrix: React.FC = () => {
  const permissions: Permission[] = [
    {
      name: "User Management",
      description: "Create, edit, delete users",
      superAdmin: true,
      admin: true,
      manager: false,
      editor: false
    },
    {
      name: "System Settings",
      description: "Configure platform settings",
      superAdmin: true,
      admin: false,
      manager: false,
      editor: false
    },
    {
      name: "Analytics Access",
      description: "View reports and analytics",
      superAdmin: true,
      admin: true,
      manager: true,
      editor: false
    },
    {
      name: "Content Management",
      description: "Create and edit content",
      superAdmin: true,
      admin: true,
      manager: true,
      editor: true
    }
  ];

  const roles = [
    { name: "Super Admin", key: "superAdmin" },
    { name: "Admin", key: "admin" },
    { name: "Manager", key: "manager" },
    { name: "Editor", key: "editor" }
  ];

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Permission Matrix</h1>
      <p className="text-gray-600 mb-6">Configure specific permissions for each role</p>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Permission</th>
              {roles.map(role => (
                <th key={role.key} className="text-center py-3 px-4 font-semibold text-gray-700">
                  {role.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissions.map((permission, index) => (
              <React.Fragment key={index}>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-800">
                    <div className="font-semibold">{permission.name}</div>
                    <div className="text-sm text-gray-500">{permission.description}</div>
                  </td>
                  {roles.map(role => (
                    <td key={role.key} className="text-center py-3 px-4">
                      <div className="flex justify-center">
                        {permission[role.key as keyof Permission] ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-800">
                            ✓
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-400">
                            □
                          </span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">API Access Control</h2>
        <p className="text-gray-600">Manage API keys and access levels</p>
      </div>
    </div>
  );
};

export default PermissionMatrix;