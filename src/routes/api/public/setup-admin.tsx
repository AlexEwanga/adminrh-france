import { createFileRoute } from '@tanstack/react-router'
import { setupAdminUser } from '@/lib/setup.functions'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/api/public/setup-admin')({
  component: SetupAdminPage,
})

function SetupAdminPage() {
  const [status, setStatus] = useState('Initialisation...')

  useEffect(() => {
    const runSetup = async () => {
      try {
        const result = await setupAdminUser({
          data: {
            email: 'ewangaalex@gmail.com',
            password: 'AdminRH!France2026',
            role: 'admin'
          }
        })
        setStatus('Succès : ' + result.message)
      } catch (error: any) {
        setStatus('Erreur : ' + error.message)
      }
    }
    runSetup()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Configuration Admin</h1>
      <div className="p-4 bg-slate-100 rounded border">
        {status}
      </div>
    </div>
  )
}
