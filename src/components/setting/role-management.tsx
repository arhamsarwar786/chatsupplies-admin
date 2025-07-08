'use client'

import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card'
import { CheckCircle, XCircle, ShieldCheck, Users, Crown } from 'lucide-react'
import { Pencil } from 'lucide-react'

const roles = [
  {
    title: 'Super Admin',
    icon: <Crown className="text-red-600 w-5 h-5" />,
    type: 'System',
    typeColor: 'bg-red-100 text-red-700',
    description: 'Full system access and control',
    permissions: ['All permissions', 'User management', 'System configuration'],
    restrictions: [],
    users: 2,
    bg: 'bg-red-50',
    border: 'border-red-100',
  },
  {
    title: 'Admin',
    icon: <ShieldCheck className="text-blue-600 w-5 h-5" />,
    type: 'Custom',
    typeColor: 'bg-blue-100 text-blue-700',
    description: 'Manage users and content',
    permissions: ['User management', 'Content editing'],
    restrictions: ['System settings'],
    users: 8,
    bg: 'bg-white',
    border: 'border-gray-200',
  },
  {
    title: 'Manager',
    icon: <Users className="text-green-600 w-5 h-5" />,
    type: 'Custom',
    typeColor: 'bg-green-100 text-green-700',
    description: 'Limited management access',
    permissions: ['View analytics', 'Manage content'],
    restrictions: ['User management'],
    users: 15,
    bg: 'bg-white',
    border: 'border-gray-200',
  },
]

export const RoleManagement = () => {
  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Role Management</h2>
          <p className="text-sm text-muted-foreground">
            Define and manage user roles and their permissions
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">+ Create Role</Button>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles.map((role) => (
          <Card key={role.title} className={`${role.bg} ${role.border} relative`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-lg">
                  {role.icon}
                  {role.title}
                </div>
                <Badge className={`${role.typeColor} text-xs px-2 py-1`}>{role.type}</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-2">
              <p className="text-sm text-gray-700">{role.description}</p>

              {/* Permissions */}
              <div className="space-y-1">
                {role.permissions.map((perm) => (
                  <div key={perm} className="flex items-center text-sm text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {perm}
                  </div>
                ))}
                {role.restrictions.map((res) => (
                  <div key={res} className="flex items-center text-sm text-red-600">
                    <XCircle className="w-4 h-4 mr-1" />
                    {res}
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
              <span>{role.users} users</span>
              <Pencil className="w-4 h-4 text-indigo-600 cursor-pointer" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
