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
    // 1. Create user in auth.users
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
         // User might already exist, try to find them
         const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
         const existingUser = users.find(u => u.email === data.email);
         if (!existingUser) throw new Error('User exists but could not be found');
         
         // Assign role
         await supabaseAdmin.from('user_roles').upsert({
           user_id: existingUser.id,
           role: data.role
         });
         return { success: true, message: 'Existing user promoted to ' + data.role };
      }
      throw authError;
    }

    // 2. Assign role in user_roles
    const { error: roleError } = await supabaseAdmin.from('user_roles').insert({
      user_id: authUser.user.id,
      role: data.role,
    });

    if (roleError) throw roleError;

    return { success: true, message: 'User created and assigned as ' + data.role };
  });
