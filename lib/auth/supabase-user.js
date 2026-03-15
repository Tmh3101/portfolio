export const mapSupabaseUser = (user) => {
  if (!user) {
    return null;
  }

  console.log('Mapping Supabase user:', user);

  return {
    id: user.id,
    email: user.email,
    fullName: user.user_metadata?.full_name || user.user_metadata?.fullName || '',
    role: user.user_metadata?.role || 'admin',
  };
};
