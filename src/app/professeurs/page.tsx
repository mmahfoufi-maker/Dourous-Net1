import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AppShell from '@/components/layout/AppShell';
import ProfsContent from '@/components/ProfsContent';

export default async function ProfsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('user_id', user.id).single();

  const { data: professeurs } = await supabase
    .from('professeurs').select('*').order('nom');

  const userName = profile ? `${profile.prenom} ${profile.nom}` : '';

  return (
    <AppShell userName={userName} userEmail={user.email ?? ''}>
      <ProfsContent professeurs={professeurs || []} profile={profile} />
    </AppShell>
  );
}
