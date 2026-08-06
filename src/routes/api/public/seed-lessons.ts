import { createFileRoute } from '@tanstack/react-router'
import { createClient } from '@supabase/supabase-js'
import lessons from '@/lib/lessons.json'

// Synchronise la bibliothèque de leçons quotidiennes (100 leçons uniques,
// chacune avec Casus, Référence légale et Article complet).
export const Route = createFileRoute('/api/public/seed-lessons')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apikey = request.headers.get('apikey')
        if (!apikey || apikey !== process.env['SUPABASE_PUBLISHABLE_KEY']) {
          return new Response('Unauthorized', { status: 401 })
        }

        const supabase = createClient(
          process.env['SUPABASE_URL']!,
          process.env['SUPABASE_SERVICE_ROLE_KEY']!,
        )

        // On repart d'une base propre pour garantir l'unicité des leçons
        await supabase.from('messages').delete().neq('id', -1)

        const { error } = await supabase.from('messages').insert(lessons as any)
        if (error) {
          return new Response(JSON.stringify({ error: error.message }), { status: 500 })
        }

        const { count } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })

        return new Response(JSON.stringify({ success: true, total: count }), {
          headers: { 'Content-Type': 'application/json' },
        })
      },
    },
  },
})
