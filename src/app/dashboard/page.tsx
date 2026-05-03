import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AppShell from '@/components/layout/AppShell';
import DashboardContent from '@/components/DashboardContent';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('user_id', user.id).single();

  const { data: seances } = await supabase
    .from('seances')
    .select('*, professeurs(*)')
    .eq('eleve_id', profile?.id ?? '')
    .order('date_heure', { ascending: false })
    .limit(5);

  const { data: allSeances } = await supabase
    .from('seances')
    .select('statut')
    .eq('eleve_id', profile?.id ?? '');

  const userName = profile ? `${profile.prenom} ${profile.nom}` : '';

  return (
    <AppShell userName={userName} userEmail={user.email ?? ''}>
      <DashboardContent
        profile={profile}
        recentSeances={seances || []}
        allStatuts={allSeances || []}
        userEmail={user.email ?? ''}
      />
    </AppShell>
  );
}
