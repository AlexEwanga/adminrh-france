import { supabaseAdmin } from '@/integrations/supabase/client.server';
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

const setupUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['admin', 'user']),
});

export const setupAdminUser = createServerFn({ method: 'POST' })
  .inputValidator((data) => setupUserSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (listError) throw listError;
      
      const existingUser = users?.find(u => u.email === data.email);
      let userId: string;

      if (existingUser) {
        userId = existingUser.id;
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
          password: data.password,
          email_confirm: true
        });
        if (updateError) throw updateError;
      } else {
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: data.email,
          password: data.password,
          email_confirm: true,
        });
        if (authError) throw authError;
        userId = authUser.user.id;
      }

      await supabaseAdmin.from('user_roles').upsert({
        user_id: userId,
        role: data.role,
      }, { onConflict: 'user_id, role' });

      return { success: true, message: 'User setup complete' };
    } catch (error: any) {
      console.error('Setup error details:', error);
      throw error;
    }
  });
