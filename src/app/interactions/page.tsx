import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AppShell from '@/components/layout/AppShell';
import InteractionsContent from '@/components/InteractionsContent';

export default async function InteractionsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('user_id', user.id).single();

  const { data: seances } = await supabase
    .from('seances')
    .select('*, professeurs(*)')
    .eq('eleve_id', profile?.id ?? '')
    .order('date_heure', { ascending: false });

  const userName = profile ? `${profile.prenom} ${profile.nom}` : '';

  return (
    <AppShell userName={userName} userEmail={user.email ?? ''}>
      <InteractionsContent seances={seances || []} />
    </AppShell>
  );
}
