import { createFileRoute } from '@tanstack/react-router'
import { setupAdminUser } from '@/lib/setup.functions'

export const Route = createFileRoute('/api/public/setup-admin')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const result = await setupAdminUser({
            data: {
              email: 'ewangaalex@gmail.com',
              password: 'AdminRH!France2026',
              role: 'admin'
            }
          });
          return new Response(JSON.stringify(result), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error: any) {
          return new Response(JSON.stringify({ error: error.message }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
    }
  }
})
