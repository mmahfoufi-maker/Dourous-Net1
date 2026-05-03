'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Professeur, Profile } from '@/lib/types';
import { Search, Calendar, MessageCircle, BookOpen, X, Loader2, CheckCircle, ChevronRight } from 'lucide-react';

const MATIERE_CONFIG: Record<string, { grad: string; badge_bg: string; badge_color: string }> = {
  'Algorithmique et Structures de Données': { grad: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', badge_bg: '#dbeafe', badge_color: '#1e40af' },
  'Réseaux et Télécommunications':          { grad: 'linear-gradient(135deg,#8b5cf6,#5b21b6)', badge_bg: '#ede9fe', badge_color: '#4c1d95' },
  'Génie Logiciel':                         { grad: 'linear-gradient(135deg,#f59e0b,#b45309)', badge_bg: '#fef3c7', badge_color: '#7c2d12' },
  'Intelligence Artificielle':              { grad: 'linear-gradient(135deg,#ec4899,#9d174d)', badge_bg: '#fce7f3', badge_color: '#831843' },
};
const DEF_CFG = { grad: 'linear-gradient(135deg,#1a7a4a,#0e5030)', badge_bg: '#d6f0e3', badge_color: '#0f5232' };

export default function ProfsContent({ professeurs, profile }: { professeurs: Professeur[]; profile: Profile | null }) {
  const router   = useRouter();
  const supabase = createClient();
  const [search,  setSearch]  = useState('');
  const [modal,   setModal]   = useState<Professeur | null>(null);
  const [date,    setDate]    = useState('');
  const [notes,   setNotes]   = useState('');
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState('');

  const filtered = professeurs.filter(p =>
    `${p.nom} ${p.prenom} ${p.matiere}`.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (p: Professeur) => { setModal(p); setDate(''); setNotes(''); setDone(false); setError(''); };

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modal || !profile) { setError('Profil introuvable.'); return; }
    setLoading(true); setError('');
    const { error: err } = await supabase.from('seances').insert({
      eleve_id: profile.id, professeur_id: modal.id,
      date_heure: new Date(date).toISOString(), statut: 'en_attente',
      notes: notes || null,
    });
    if (err) setError(err.message);
    else { setDone(true); router.refresh(); }
    setLoading(false);
  };

  return (
    <div style={{ padding: '32px 36px', maxWidth: 960, margin: '0 auto' }}>
      <div className="animate-fade-up" style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 24, color: 'var(--text)', margin: '0 0 4px' }}>
          Professeurs disponibles
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: 14 }}>{professeurs.length} enseignant(s) sur la plateforme</p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 380, marginBottom: 28 }} className="animate-fade-up">
        <Search style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
          width: 15, height: 15, color: 'var(--text-3)' }} />
        <input className="input" style={{ paddingLeft: 40 }}
          placeholder="Rechercher par nom ou matière…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 18 }}>
        {filtered.map((p, i) => {
          const cfg = MATIERE_CONFIG[p.matiere] ?? DEF_CFG;
          return (
            <div key={p.id} className={`card card-hover animate-fade-up d${Math.min(i+1,5)}`}
              style={{ padding: 0, overflow: 'hidden' }}>
              {/* Header coloré */}
              <div style={{ height: 6, background: cfg.grad }} />
              <div style={{ padding: '20px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                  <div style={{
                    width: 50, height: 50, borderRadius: 13,
                    background: cfg.grad, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 17, fontWeight: 700,
                    color: 'white', flexShrink: 0,
                    boxShadow: '0 6px 16px rgba(0,0,0,.2)',
                  }}>
                    {p.prenom[0]}{p.nom[0]}
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 15.5,
                      color: 'var(--text)', margin: '0 0 5px' }}>
                      Prof. {p.prenom} {p.nom}
                    </p>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100,
                      background: cfg.badge_bg, color: cfg.badge_color }}>
                      {p.matiere}
                    </span>
                  </div>
                </div>

                {p.bio && (
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: 'var(--text-2)', marginBottom: 16 }}>
                    {p.bio}
                  </p>
                )}

                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => openModal(p)} className="btn-primary btn-sm" style={{ flex: 1 }}>
                    <Calendar style={{ width: 13, height: 13 }} /> Réserver
                  </button>
                  <button className="btn-outline btn-sm" style={{ padding: '6px 12px' }}>
                    <MessageCircle style={{ width: 13, height: 13 }} />
                  </button>
                  <button className="btn-outline btn-sm" style={{ padding: '6px 12px' }}>
                    <BookOpen style={{ width: 13, height: 13 }} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 0' }}>
            <Search style={{ width: 36, height: 36, margin: '0 auto 10px', color: 'var(--border-2)' }} />
            <p style={{ color: 'var(--text-3)' }}>Aucun résultat pour « {search} »</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(10,14,30,.55)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}
          onClick={e => { if (e.target === e.currentTarget) setModal(null); }}>
          <div style={{
            width: '100%', maxWidth: 440, background: 'var(--surface)',
            borderRadius: 18, boxShadow: 'var(--shadow-lg)', overflow: 'hidden',
          }} className="animate-fade-up">
            {/* Modal header */}
            <div style={{
              padding: '20px 24px', borderBottom: '1px solid var(--border)',
              background: (MATIERE_CONFIG[modal.matiere] ?? DEF_CFG).grad,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <p style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 17,
                  color: 'white', margin: '0 0 2px' }}>
                  {modal.prenom} {modal.nom}
                </p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,.7)', margin: 0 }}>{modal.matiere}</p>
              </div>
              <button onClick={() => setModal(null)} style={{
                width: 32, height: 32, borderRadius: 8, border: 'none',
                background: 'rgba(255,255,255,.2)', color: 'white', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <X style={{ width: 15, height: 15 }} />
              </button>
            </div>

            <div style={{ padding: 24 }}>
              {done
                ? (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <CheckCircle style={{ width: 56, height: 56, margin: '0 auto 14px', color: 'var(--primary)' }} />
                    <p style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 18,
                      color: 'var(--text)', marginBottom: 8 }}>Séance réservée !</p>
                    <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 20 }}>
                      Ta demande est en attente de confirmation.
                    </p>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button onClick={() => setModal(null)} className="btn-outline" style={{ flex: 1 }}>Fermer</button>
                      <a href="/interactions" className="btn-primary" style={{ flex: 1, textDecoration: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        Mes séances <ChevronRight style={{ width: 14, height: 14 }} />
                      </a>
                    </div>
                  </div>
                )
                : (
                  <form onSubmit={handleReserve} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label className="label">Date et heure</label>
                      <input type="datetime-local" className="input"
                        value={date} onChange={e => setDate(e.target.value)}
                        min={new Date().toISOString().slice(0,16)} required />
                    </div>
                    <div>
                      <label className="label">Notes (optionnel)</label>
                      <textarea className="input" rows={3}
                        placeholder="Ex: besoin d'aide sur les arbres AVL…"
                        value={notes} onChange={e => setNotes(e.target.value)} />
                    </div>
                    {error && (
                      <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)',
                        borderRadius: 10, padding: '10px 14px', fontSize: 13 }}>{error}</div>
                    )}
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button type="button" onClick={() => setModal(null)} className="btn-outline" style={{ flex: 1 }}>
                        Annuler
                      </button>
                      <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={loading}>
                        {loading ? <Loader2 style={{ width: 15, height: 15 }} className="animate-spin" /> : <Calendar style={{ width: 15, height: 15 }} />}
                        Confirmer
                      </button>
                    </div>
                  </form>
                )
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
