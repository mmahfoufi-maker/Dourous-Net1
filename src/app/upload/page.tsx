import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AppShell from '@/components/layout/AppShell';
import UploadContent from '@/components/UploadContent';

export default async function UploadPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('user_id', user.id).single();

  // Séances en attente ou confirmées pour lier le fichier
  const { data: seances } = await supabase
    .from('seances')
    .select('id, date_heure, statut, professeurs(nom, prenom, matiere)')
    .eq('eleve_id', profile?.id ?? '')
    .in('statut', ['en_attente', 'confirmee'])
    .order('date_heure', { ascending: false });

  const userName = profile ? `${profile.prenom} ${profile.nom}` : '';

  return (
    <AppShell userName={userName} userEmail={user.email ?? ''}>
      <UploadContent seances={seances || []} profile={profile} userId={user.id} />
    </AppShell>
  );
}
