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
      // Create user
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
      });

      let userId: string;
      if (authError) {
        if (authError.message.includes('already registered')) {
          const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
          const existingUser = users?.find(u => u.email === data.email);
          if (!existingUser) throw new Error('Could not find existing user');
          userId = existingUser.id;
          
          // Force update password and confirm email
          await supabaseAdmin.auth.admin.updateUserById(userId, {
            password: data.password,
            email_confirm: true
          });
        } else {
          throw authError;
        }
      } else {
        userId = authUser.user.id;
      }

      // Role
      await supabaseAdmin.from('user_roles').upsert({
        user_id: userId,
        role: data.role,
      }, { onConflict: 'user_id, role' });

      return { success: true, userId };
    } catch (error: any) {
      console.error('Setup error:', error);
      throw error;
    }
  });
