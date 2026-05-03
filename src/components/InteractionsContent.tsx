'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import type { Seance } from '@/lib/types';
import { STATUT_FR } from '@/lib/types';
import { CalendarDays, Filter, FileText, Clock, CheckCircle, XCircle, BookCheck, Plus } from 'lucide-react';

const STATUT_ICON: Record<string, any> = {
  en_attente: Clock, confirmee: CheckCircle, annulee: XCircle, terminee: BookCheck,
};
const STATUT_BADGE: Record<string, string> = {
  en_attente: 'badge-yellow', confirmee: 'badge-green', annulee: 'badge-red', terminee: 'badge-gray',
};
const MATIERE_GRAD: Record<string, string> = {
  'Algorithmique et Structures de Données': 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
  'Réseaux et Télécommunications':          'linear-gradient(135deg,#8b5cf6,#5b21b6)',
  'Génie Logiciel':                         'linear-gradient(135deg,#f59e0b,#b45309)',
  'Intelligence Artificielle':              'linear-gradient(135deg,#ec4899,#9d174d)',
};

export default function InteractionsContent({ seances }: { seances: Seance[] }) {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? seances : seances.filter(s => s.statut === filter);
  const counts = {
    all: seances.length,
    en_attente: seances.filter(s => s.statut === 'en_attente').length,
    confirmee:  seances.filter(s => s.statut === 'confirmee').length,
    annulee:    seances.filter(s => s.statut === 'annulee').length,
    terminee:   seances.filter(s => s.statut === 'terminee').length,
  };

  const FILTERS = [
    { key: 'all',        label: 'Toutes' },
    { key: 'en_attente', label: 'En attente' },
    { key: 'confirmee',  label: 'Confirmées' },
    { key: 'annulee',    label: 'Annulées' },
    { key: 'terminee',   label: 'Terminées' },
  ];

  return (
    <div style={{ padding: '32px 36px', maxWidth: 960, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}
        className="animate-fade-up">
        <div>
          <h1 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 24, color: 'var(--text)', margin: '0 0 4px' }}>
            Mes séances & réservations
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: 14 }}>{seances.length} séance(s) au total</p>
        </div>
        <Link href="/professeurs" className="btn-primary">
          <Plus style={{ width: 15, height: 15 }} /> Nouvelle séance
        </Link>
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22, flexWrap: 'wrap' }}
        className="animate-fade-up">
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            padding: '7px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600,
            border: 'none', cursor: 'pointer', transition: 'all .15s',
            background: filter === f.key ? 'var(--primary)' : 'var(--surface)',
            color:      filter === f.key ? 'white' : 'var(--text-2)',
            boxShadow:  filter === f.key ? '0 4px 12px rgba(26,122,74,.35)' : 'var(--shadow-sm)',
          }}>
            {f.label}
            <span style={{ marginLeft: 6, fontSize: 11, opacity: .7 }}>
              ({counts[f.key as keyof typeof counts]})
            </span>
          </button>
        ))}
      </div>

      {/* Contenu */}
      {filtered.length === 0
        ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <CalendarDays style={{ width: 40, height: 40, margin: '0 auto 12px', color: 'var(--border-2)' }} />
            <p style={{ fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>Aucune séance trouvée</p>
            <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 18 }}>
              {filter === 'all' ? 'Réserve ta première séance avec un professeur.' : 'Aucune séance avec ce statut.'}
            </p>
            <Link href="/professeurs" className="btn-primary btn-sm" style={{ display: 'inline-flex' }}>
              <Plus style={{ width: 13, height: 13 }} /> Réserver
            </Link>
          </div>
        )
        : (
          <div className="card animate-fade-in" style={{ overflow: 'hidden' }}>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Professeur</th>
                    <th>Matière</th>
                    <th>Date & heure</th>
                    <th>Statut</th>
                    <th>Notes</th>
                    <th>Fichier</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => {
                    const profRaw = s.professeurs;
                    const prof = Array.isArray(profRaw) ? profRaw[0] : profRaw;
                    const Icon = STATUT_ICON[s.statut];
                    const grad = prof ? (MATIERE_GRAD[prof.matiere] ?? 'linear-gradient(135deg,#1a7a4a,#0e5030)') : '#888';
                    return (
                      <tr key={s.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: 9, background: grad,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                              {prof ? prof.prenom[0] + prof.nom[0] : '?'}
                            </div>
                            <span style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text)' }}>
                              {prof ? `${prof.prenom} ${prof.nom}` : '—'}
                            </span>
                          </div>
                        </td>
                        <td style={{ fontSize: 12.5 }}>{prof?.matiere ?? '—'}</td>
                        <td>
                          <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)', margin: 0 }}>
                            {format(new Date(s.date_heure), 'dd MMM yyyy', { locale: fr })}
                          </p>
                          <p style={{ fontSize: 11.5, color: 'var(--text-3)', margin: '2px 0 0' }}>
                            {format(new Date(s.date_heure), 'HH:mm')}
                          </p>
                        </td>
                        <td>
                          <span className={`badge ${STATUT_BADGE[s.statut]}`}>
                            <Icon style={{ width: 11, height: 11 }} />
                            {STATUT_FR[s.statut]}
                          </span>
                        </td>
                        <td style={{ maxWidth: 140 }}>
                          {s.notes
                            ? <p style={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap' }} title={s.notes}>{s.notes}</p>
                            : <span style={{ color: 'var(--border-2)' }}>—</span>
                          }
                        </td>
                        <td>
                          {s.devoir_url
                            ? <a href={s.devoir_url} target="_blank" rel="noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: 5,
                                  fontSize: 12, color: 'var(--info)', fontWeight: 600, textDecoration: 'none' }}>
                                <FileText style={{ width: 13, height: 13 }} />
                                {s.devoir_nom ? s.devoir_nom.slice(0,18) + '…' : 'Voir'}
                              </a>
                            : <span style={{ color: 'var(--border-2)' }}>—</span>
                          }
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      }
    </div>
  );
}
