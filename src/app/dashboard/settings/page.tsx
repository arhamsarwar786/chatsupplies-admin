// @ts-nocheck
import { DashboardHeader } from '@/src/components/layout/dashboard-header'
import PermissionMatrix from '@/src/components/setting/permission-matrix'
import { RoleManagement } from '@/src/components/setting/role-management'
import React from 'react'

const page = () => {
  return (
    <>
      <DashboardHeader
        title="Platform Settings"
        description="Configure global settings for the platform"
        buttonText="Add Client"
      />
      <div className='flex flex-col gap-8'>
        <RoleManagement />
        <PermissionMatrix />
      </div>
    </>
  )
}

export default page