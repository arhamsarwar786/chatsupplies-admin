import ClientCards from '@/src/components/client/client-cards'
import ClientTable from '@/src/components/client/client-table'
import React from 'react'

const page = () => {
  return (
    <div className=' flex  flex-col gap-8'>
      <ClientCards/>
      <ClientTable/>
    </div>
  )
}

export default page