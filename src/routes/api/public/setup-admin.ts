import { createFileRoute } from '@tanstack/react-router'
import { setupAdminUser } from '@/lib/setup.functions'

export const Route = createFileRoute('/api/public/setup-admin')({
  server: {
    handlers: {
      GET: async () => {
        try {
          await setupAdminUser({
            data: {
              email: 'ewangaalex@gmail.com',
              password: 'AdminRH!France2026',
              role: 'admin'
            }
          });
          return new Response('Admin created successfully with password: AdminRH!France2026', { status: 200 });
        } catch (error: any) {
          return new Response('Error: ' + error.message, { status: 500 });
        }
      }
    }
  }
})
