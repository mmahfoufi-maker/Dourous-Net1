'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Profile, Seance } from '@/lib/types';
import { STATUT_FR } from '@/lib/types';
import { CalendarDays, Users, Upload, ChevronRight, FileText, TrendingUp, Clock, CheckCircle, XCircle, BookCheck } from 'lucide-react';

interface Props {
  profile: Profile | null;
  recentSeances: Seance[];
  allStatuts: { statut: string }[];
  userEmail: string;
}

const STATUT_BADGE: Record<string, string> = {
  en_attente: 'badge-yellow', confirmee: 'badge-green',
  annulee: 'badge-red', terminee: 'badge-gray',
};

const MATIERE_GRAD: Record<string, string> = {
  'Algorithmique et Structures de Données': 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
  'Réseaux et Télécommunications':          'linear-gradient(135deg, #8b5cf6, #5b21b6)',
  'Génie Logiciel':                         'linear-gradient(135deg, #f59e0b, #b45309)',
  'Intelligence Artificielle':              'linear-gradient(135deg, #ec4899, #9d174d)',
};

export default function DashboardContent({ profile, recentSeances, allStatuts, userEmail }: Props) {
  const stats = {
    total:     allStatuts.length,
    attente:   allStatuts.filter(s => s.statut === 'en_attente').length,
    confirmee: allStatuts.filter(s => s.statut === 'confirmee').length,
    terminee:  allStatuts.filter(s => s.statut === 'terminee').length,
  };

  const firstName = profile?.prenom || userEmail.split('@')[0];

  const shortcuts = [
    { href: '/professeurs',  label: 'Voir les professeurs',  sub: 'Réserve une séance',      Icon: Users,        grad: 'linear-gradient(135deg, #1a7a4a, #0e5030)' },
    { href: '/interactions', label: 'Mes séances',           sub: 'Historique complet',       Icon: CalendarDays, grad: 'linear-gradient(135deg, #1a5ca8, #0f3d72)' },
    { href: '/upload',       label: 'Déposer un fichier',    sub: 'PDF, image, Word',         Icon: Upload,       grad: 'linear-gradient(135deg, #b87010, #7a4a08)' },
  ];

  const statCards = [
    { label: 'Total',      value: stats.total,     color: '#1a5ca8', bg: 'var(--info-bg)' },
    { label: 'En attente', value: stats.attente,   color: '#b87010', bg: 'var(--accent-bg)' },
    { label: 'Confirmées', value: stats.confirmee, color: '#1a7a4a', bg: 'var(--primary-bg)' },
    { label: 'Terminées',  value: stats.terminee,  color: 'var(--text-2)', bg: 'var(--bg-2)' },
  ];

  return (
    <div style={{ padding: '32px 36px', maxWidth: 960, margin: '0 auto' }}>
      {/* Header */}
      <div className="animate-fade-up" style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg, #22a05f, #1a7a4a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 700, color: 'white',
            boxShadow: '0 6px 18px rgba(26,122,74,.35)',
          }}>
            {firstName[0]?.toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 24,
              color: 'var(--text)', margin: 0 }}>
              Bonjour, {firstName} !
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              {profile?.niveau && (
                <span className="badge badge-green" style={{ fontSize: 11 }}>{profile.niveau}</span>
              )}
              <span style={{ fontSize: 13, color: 'var(--text-3)' }}>Bienvenue sur ton espace Dourous-Net</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 28 }}>
        {statCards.map(({ label, value, color, bg }, i) => (
          <div key={label} className={`card animate-fade-up d${i+1}`}
            style={{ padding: '18px 20px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em',
              color: 'var(--text-3)', margin: '0 0 10px' }}>{label}</p>
            <p style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 32,
              color, margin: 0 }}>{value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 20 }}>
        {/* Shortcuts */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em',
            color: 'var(--text-3)', marginBottom: 12 }}>Accès rapide</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {shortcuts.map(({ href, label, sub, Icon, grad }) => (
              <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                <div className="card card-hover" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: grad,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(0,0,0,.2)' }}>
                    <Icon style={{ width: 18, height: 18, color: 'white' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)', margin: 0 }}>{label}</p>
                    <p style={{ fontSize: 11.5, color: 'var(--text-3)', margin: '2px 0 0' }}>{sub}</p>
                  </div>
                  <ChevronRight style={{ width: 15, height: 15, color: 'var(--text-3)' }} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Séances récentes */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-3)' }}>
              Séances récentes
            </p>
            <Link href="/interactions" style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600,
              textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
              Voir tout <ChevronRight style={{ width: 13, height: 13 }} />
            </Link>
          </div>
          <div className="card" style={{ overflow: 'hidden' }}>
            {recentSeances.length === 0
              ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <CalendarDays style={{ width: 36, height: 36, margin: '0 auto 10px',
                    color: 'var(--border-2)' }} />
                  <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 14 }}>Aucune séance</p>
                  <Link href="/professeurs" className="btn-primary btn-sm" style={{ display: 'inline-flex' }}>
                    Réserver ma première séance
                  </Link>
                </div>
              )
              : recentSeances.map((s, i) => {
                const prof = s.professeurs;
                const grad = prof ? (MATIERE_GRAD[prof.matiere] ?? 'linear-gradient(135deg,#1a7a4a,#0e5030)') : '#888';
                return (
                  <div key={s.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '13px 18px',
                    borderBottom: i < recentSeances.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: grad,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                      {prof ? prof.prenom[0] + prof.nom[0] : '?'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)', margin: 0,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {prof ? `${prof.prenom} ${prof.nom}` : '—'}
                      </p>
                      <p style={{ fontSize: 11.5, color: 'var(--text-3)', margin: '2px 0 0' }}>
                        {format(new Date(s.date_heure), 'dd MMM yyyy · HH:mm', { locale: fr })}
                      </p>
                    </div>
                    <span className={`badge ${STATUT_BADGE[s.statut]}`} style={{ fontSize: 11, flexShrink: 0 }}>
                      {STATUT_FR[s.statut]}
                    </span>
                    {s.devoir_url && (
                      <a href={s.devoir_url} target="_blank" rel="noreferrer">
                        <FileText style={{ width: 14, height: 14, color: 'var(--info)' }} />
                      </a>
                    )}
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
}
