import PermissionMatrix from '@/src/components/setting/permission-matrix'
import { RoleManagement } from '@/src/components/setting/role-management'
import React from 'react'

const page = () => {
  return (
    <div className='flex flex-col gap-8'>
      <RoleManagement/>
      <PermissionMatrix/>
    </div>
  )
}

export default page