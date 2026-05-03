'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { BookOpen, Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight, GraduationCap, Star } from 'lucide-react';

type Mode = 'login' | 'signup';

export default function LoginPage() {
  const router   = useRouter();
  const supabase = createClient();

  const [mode,     setMode]     = useState<Mode>('login');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [nom,      setNom]      = useState('');
  const [prenom,   setPrenom]   = useState('');
  const [niveau,   setNiveau]   = useState('Licence 2');
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError('Email ou mot de passe incorrect.'); setLoading(false); return; }
      router.push('/dashboard'); router.refresh();
    } else {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { nom, prenom, niveau } },
      });
      if (error) { setError(error.message); setLoading(false); return; }
      setSuccess('Compte créé ! Vérifie ton email puis connecte-toi.');
      setMode('login');
    }
    setLoading(false);
  };

  const NIVEAUX = ['Licence 1','Licence 2','Licence 3','Master 1','Master 2','Doctorat'];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)' }}>

      {/* ── Panneau gauche sombre ──────────────────────── */}
      <div style={{
        width: '42%', display: 'none',
        background: 'linear-gradient(160deg, #0d1321 0%, #141829 50%, #1c2442 100%)',
        flexDirection: 'column', justifyContent: 'space-between',
        padding: '40px 48px', position: 'relative', overflow: 'hidden',
      }} className="lg-flex">

        {/* Cercle déco */}
        <div style={{
          position: 'absolute', top: -80, right: -80, width: 400, height: 400,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,122,74,.15), transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, left: -60, width: 300, height: 300,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,112,16,.1), transparent 70%)',
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, #22a05f, #1a7a4a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 16px rgba(26,122,74,.5)',
          }}>
            <BookOpen style={{ width: 22, height: 22, color: 'white' }} />
          </div>
          <div>
            <p style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 20, color: 'white', margin: 0 }}>
              Dourous-Net
            </p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', margin: 0, letterSpacing: 2 }}>دروس نت</p>
          </div>
        </div>

        {/* Centre */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px',
            borderRadius: 100, background: 'rgba(26,122,74,.2)', border: '1px solid rgba(34,160,95,.3)',
            marginBottom: 24,
          }}>
            <Star style={{ width: 12, height: 12, color: '#4fd98a' }} />
            <span style={{ fontSize: 12, color: '#4fd98a', fontWeight: 600 }}>Extranet Éducatif Officiel</span>
          </div>

          <h1 style={{
            fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 38,
            color: 'white', lineHeight: 1.15, marginBottom: 16,
          }}>
            Ton espace<br />éducatif<br />
            <span style={{ color: '#4fd98a' }}>algérien</span>
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.55)', lineHeight: 1.7, marginBottom: 32 }}>
            Accède à tes professeurs, réserve des séances et dépose tes devoirs depuis une seule plateforme.
          </p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[
              { n: '4',    l: 'Professeurs' },
              { n: 'RLS',  l: 'Sécurisé' },
              { n: '24/7', l: 'Disponible' },
            ].map(({ n, l }) => (
              <div key={l} style={{
                padding: '16px 12px', borderRadius: 12, textAlign: 'center',
                background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)',
              }}>
                <p style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 20, color: 'white', margin: 0 }}>{n}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', margin: '3px 0 0' }}>{l}</p>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 12, color: 'rgba(255,255,255,.2)', position: 'relative', zIndex: 1 }}>
          Institut Galilée · Sorbonne Paris Nord · 2025/2026
        </p>
      </div>

      {/* ── Panneau droit — formulaire ─────────────────── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <div style={{ width: '100%', maxWidth: 440 }} className="animate-fade-up">

          {/* Logo mobile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}
            className="lg-hide">
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #22a05f, #1a7a4a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BookOpen style={{ width: 18, height: 18, color: 'white' }} />
            </div>
            <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>
              Dourous-Net
            </span>
          </div>

          <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 26, color: 'var(--text)', marginBottom: 6 }}>
            {mode === 'login' ? 'Bon retour !' : 'Créer un compte'}
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 28 }}>
            {mode === 'login' ? 'Connecte-toi pour accéder à ta plateforme' : 'Rejoins Dourous-Net gratuitement'}
          </p>

          {/* Mode tabs */}
          <div style={{
            display: 'flex', borderRadius: 12, padding: 4, marginBottom: 24,
            background: 'var(--bg-2)', border: '1px solid var(--border)',
          }}>
            {(['login','signup'] as Mode[]).map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); setSuccess(''); }}
                style={{
                  flex: 1, padding: '9px 0', fontSize: 14, fontWeight: 600, borderRadius: 9,
                  border: 'none', cursor: 'pointer', transition: 'all .15s',
                  background: mode === m ? 'var(--surface)' : 'transparent',
                  color: mode === m ? 'var(--primary)' : 'var(--text-2)',
                  boxShadow: mode === m ? 'var(--shadow-sm)' : 'none',
                }}>
                {m === 'login' ? 'Connexion' : 'Inscription'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {mode === 'signup' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="label">Prénom</label>
                    <input className="input" placeholder="Yasmine"
                      value={prenom} onChange={e => setPrenom(e.target.value)} required />
                  </div>
                  <div>
                    <label className="label">Nom</label>
                    <input className="input" placeholder="Benmahdi"
                      value={nom} onChange={e => setNom(e.target.value)} required />
                  </div>
                </div>
                <div>
                  <label className="label">Niveau</label>
                  <select className="input" value={niveau} onChange={e => setNiveau(e.target.value)}>
                    {NIVEAUX.map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="label">Email</label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  width: 16, height: 16, color: 'var(--text-3)' }} />
                <input type="email" className="input" style={{ paddingLeft: 42 }}
                  placeholder="email@example.dz" value={email}
                  onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>

            <div>
              <label className="label">Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  width: 16, height: 16, color: 'var(--text-3)' }} />
                <input type={showPwd ? 'text' : 'password'} className="input"
                  style={{ paddingLeft: 42, paddingRight: 42 }}
                  placeholder="••••••••" value={password}
                  onChange={e => setPassword(e.target.value)} required minLength={6} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                  {showPwd
                    ? <EyeOff style={{ width: 15, height: 15, color: 'var(--text-3)' }} />
                    : <Eye    style={{ width: 15, height: 15, color: 'var(--text-3)' }} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)',
                border: '1px solid #f5c0c0', borderRadius: 10, padding: '10px 14px', fontSize: 13 }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ background: 'var(--primary-bg)', color: 'var(--primary-dark)',
                border: '1px solid #a0dfbf', borderRadius: 10, padding: '10px 14px', fontSize: 13 }}>
                {success}
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 4 }} disabled={loading}>
              {loading ? <Loader2 style={{ width: 16, height: 16 }} className="animate-spin" /> : <ArrowRight style={{ width: 16, height: 16 }} />}
              {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
            </button>
          </form>

          {/* Démo */}
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', marginBottom: 10 }}>
              Accès démonstration
            </p>
            <button onClick={() => { setEmail('test@dourous-net.dz'); setPassword('Maya2026'); setMode('login'); }}
              className="btn-outline" style={{ width: '100%', fontSize: 12 }}>
              test@dourous-net.dz · Maya2026
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) { .lg-flex { display: flex !important; } }
        @media (max-width: 1023px) { .lg-hide { display: none !important; } }
      `}</style>
    </div>
  );
}
