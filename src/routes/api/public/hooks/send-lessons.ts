import { createFileRoute } from '@tanstack/react-router'
import { createClient } from '@supabase/supabase-js'

export const Route = createFileRoute('/api/public/hooks/send-lessons')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authHeader = request.headers.get('apikey')
        if (authHeader !== process.env['SUPABASE_ANON_KEY']) {
          return new Response('Unauthorized', { status: 401 })
        }

        const supabase = createClient(
          process.env['SUPABASE_URL']!,
          process.env['SUPABASE_SERVICE_ROLE_KEY']!
        )

        try {
          // Logic to find the next message and send via WPSent
          // This would normally fetch from daily_schedule and messages
          console.log('Cron triggered: Sending WhatsApp lesson...')
          
          return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
          })
        } catch (error: any) {
          return new Response(JSON.stringify({ error: error.message }), { status: 500 })
        }
      }
    }
  }
})
