'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Profile } from '@/lib/types';
import { Upload, FileText, Image, FileArchive, X, Loader2, CheckCircle, CloudUpload, AlertCircle, Info } from 'lucide-react';

const ALLOWED = [
  'application/pdf','image/png','image/jpeg','image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

interface SeanceOption {
  id: string; date_heure: string; statut: string;
  professeurs: { nom: string; prenom: string; matiere: string } | { nom: string; prenom: string; matiere: string }[] | null;
}

export default function UploadContent({ seances, profile, userId }: {
  seances: SeanceOption[]; profile: Profile | null; userId: string;
}) {
  const router   = useRouter();
  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file,     setFile]     = useState<File | null>(null);
  const [seanceId, setSeanceId] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [progress, setProgress] = useState(0);
  const [done,     setDone]     = useState(false);
  const [error,    setError]    = useState('');
  const [drag,     setDrag]     = useState(false);

  const validate = (f: File | undefined) => {
    if (!f) return;
    if (!ALLOWED.includes(f.type)) { setError('Type non autorisé. PDF, image ou Word seulement.'); return; }
    if (f.size > 20 * 1024 * 1024) { setError('Fichier trop lourd (max 20 MB).'); return; }
    setError(''); setFile(f);
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf'))   return { Icon: FileText,   grad: 'linear-gradient(135deg,#ef4444,#b91c1c)', bg: '#fde8e8' };
    if (type.includes('image')) return { Icon: Image,      grad: 'linear-gradient(135deg,#8b5cf6,#5b21b6)', bg: '#ede9fe' };
    return                             { Icon: FileArchive, grad: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', bg: '#dbeafe' };
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setError('Sélectionne un fichier.'); return; }
    if (!seanceId) { setError('Associe le fichier à une séance.'); return; }
    setLoading(true); setError(''); setProgress(15);

    const filePath = `${userId}/${Date.now()}_${file.name.replace(/\s+/g,'_')}`;
    const { error: upErr } = await supabase.storage.from('devoirs').upload(filePath, file);
    if (upErr) { setError(`Erreur upload : ${upErr.message}`); setLoading(false); return; }
    setProgress(65);

    const { data: urlData } = supabase.storage.from('devoirs').getPublicUrl(filePath);
    setProgress(85);

    const { error: updErr } = await supabase.from('seances').update({
      devoir_url: urlData.publicUrl, devoir_nom: file.name,
    }).eq('id', seanceId);

    if (updErr) { setError(`Erreur liaison : ${updErr.message}`); setLoading(false); return; }
    setProgress(100); setDone(true); router.refresh(); setLoading(false);
  };

  const reset = () => { setFile(null); setSeanceId(''); setDone(false); setError(''); setProgress(0); };

  return (
    <div style={{ padding: '32px 36px', maxWidth: 600, margin: '0 auto' }}>
      <div className="animate-fade-up" style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 24, color: 'var(--text)', margin: '0 0 4px' }}>
          Déposer un fichier
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: 14 }}>PDF, image ou document Word · max 20 MB</p>
      </div>

      {done
        ? (
          <div className="card animate-fade-up" style={{ padding: '56px 40px', textAlign: 'center' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%', margin: '0 auto 20px',
              background: 'var(--primary-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CheckCircle style={{ width: 36, height: 36, color: 'var(--primary)' }} />
            </div>
            <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 22,
              color: 'var(--text)', marginBottom: 10 }}>Fichier envoyé !</h2>
            <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 24 }}>
              Ton fichier a été associé à ta séance avec succès.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={reset} className="btn-outline">Envoyer un autre</button>
              <a href="/interactions" className="btn-primary" style={{ textDecoration: 'none' }}>Voir mes séances</a>
            </div>
          </div>
        )
        : (
          <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
            className="animate-fade-up">

            {/* Zone drop */}
            <div
              style={{
                border: `2px dashed ${drag ? 'var(--primary)' : file ? '#a0dfbf' : 'var(--border-2)'}`,
                background: drag ? 'var(--primary-bg)' : file ? '#f0fdf6' : 'var(--surface-2)',
                borderRadius: 16, padding: 32, textAlign: 'center',
                cursor: 'pointer', transition: 'all .2s',
              }}
              onDragOver={e => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={e => { e.preventDefault(); setDrag(false); validate(e.dataTransfer.files?.[0]); }}
              onClick={() => !file && inputRef.current?.click()}>
              <input ref={inputRef} type="file" style={{ display: 'none' }}
                accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
                onChange={e => validate(e.target.files?.[0])} />

              {file
                ? (() => {
                    const { Icon, grad, bg } = getFileIcon(file.type);
                    return (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 52, height: 52, borderRadius: 13, background: grad,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon style={{ width: 24, height: 24, color: 'white' }} />
                        </div>
                        <div style={{ flex: 1, textAlign: 'left' }}>
                          <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', margin: '0 0 3px' }}>
                            {file.name}
                          </p>
                          <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
                            {(file.size / 1024 / 1024).toFixed(2)} MB · {file.type.split('/')[1]?.toUpperCase()}
                          </p>
                        </div>
                        <button type="button" onClick={e => { e.stopPropagation(); setFile(null); }}
                          style={{ width: 32, height: 32, borderRadius: 8, border: 'none',
                            background: 'var(--danger-bg)', color: 'var(--danger)', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <X style={{ width: 14, height: 14 }} />
                        </button>
                      </div>
                    );
                  })()
                : (
                  <>
                    <CloudUpload style={{ width: 44, height: 44, margin: '0 auto 12px',
                      color: drag ? 'var(--primary)' : 'var(--text-3)' }} />
                    <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--text)', marginBottom: 4 }}>
                      Glisse ton fichier ici
                    </p>
                    <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16 }}>ou clique pour choisir</p>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                      {[['PDF','#ef4444'],['Image','#8b5cf6'],['Word','#3b82f6']].map(([l,c]) => (
                        <span key={l} style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px',
                          borderRadius: 100, background: `${c}15`, color: c }}>{l}</span>
                      ))}
                    </div>
                  </>
                )
              }
            </div>

            {/* Séance */}
            <div className="card" style={{ padding: '18px 20px' }}>
              <label className="label">Associer à une séance</label>
              {seances.length === 0
                ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px',
                    borderRadius: 10, background: 'var(--accent-bg)', fontSize: 13, color: 'var(--accent)' }}>
                    <Info style={{ width: 15, height: 15, flexShrink: 0 }} />
                    Aucune séance active.{' '}
                    <a href="/professeurs" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                      Réserve d'abord une séance.
                    </a>
                  </div>
                )
                : (
                  <select className="input" value={seanceId}
                    onChange={e => setSeanceId(e.target.value)} required>
                    <option value="">Choisir une séance…</option>
                    {seances.map(s => {
                      const pRaw = s.professeurs;
                      const p = Array.isArray(pRaw) ? pRaw[0] : pRaw;
                      return (
                        <option key={s.id} value={s.id}>
                          {p ? `${p.prenom} ${p.nom} (${p.matiere})` : '?'} —{' '}
                          {format(new Date(s.date_heure), 'dd MMM à HH:mm', { locale: fr })}
                        </option>
                      );
                    })}
                  </select>
                )
              }
            </div>

            {/* Progress */}
            {loading && (
              <div>
                <div style={{ height: 6, borderRadius: 100, background: 'var(--border)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 100,
                    background: 'linear-gradient(90deg,var(--primary-l),var(--primary))',
                    width: `${progress}%`, transition: 'width .4s ease' }} />
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 6 }}>Envoi en cours… {progress}%</p>
              </div>
            )}

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
                borderRadius: 10, background: 'var(--danger-bg)', color: 'var(--danger)', fontSize: 13 }}>
                <AlertCircle style={{ width: 15, height: 15, flexShrink: 0 }} /> {error}
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%' }}
              disabled={loading || !file || !seanceId}>
              {loading
                ? <><Loader2 style={{ width: 15, height: 15 }} className="animate-spin" /> Envoi en cours…</>
                : <><Upload style={{ width: 15, height: 15 }} /> Envoyer le fichier</>
              }
            </button>
          </form>
        )
      }
    </div>
  );
}
