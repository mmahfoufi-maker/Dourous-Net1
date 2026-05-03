'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { BookOpen, LayoutDashboard, Users, CalendarDays, Upload, LogOut, ChevronRight } from 'lucide-react';

const NAV = [
  { href: '/dashboard',    label: 'Tableau de bord', Icon: LayoutDashboard },
  { href: '/professeurs',  label: 'Professeurs',     Icon: Users },
  { href: '/interactions', label: 'Mes séances',     Icon: CalendarDays },
  { href: '/upload',       label: 'Déposer un fichier', Icon: Upload },
];

export default function AppShell({ children, userName, userEmail }: {
  children: React.ReactNode; userName: string; userEmail: string;
}) {
  const pathname = usePathname();
  const router   = useRouter();
  const supabase = createClient();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/login'); router.refresh();
  };

  const initials = (userName || userEmail || 'U').split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase();

  return (
    <div className="flex min-h-screen">
      {/* ── Sidebar ──────────────────────────────────────── */}
      <aside style={{
        width: 240, flexShrink: 0, display: 'flex', flexDirection: 'column',
        background: 'linear-gradient(180deg, #141829 0%, #1a2040 100%)',
        boxShadow: '2px 0 20px rgba(15,19,38,.18)',
      }}>
        {/* Logo */}
        <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'linear-gradient(135deg, #22a05f, #1a7a4a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(26,122,74,.5)',
            }}>
              <BookOpen style={{ width: 19, height: 19, color: 'white' }} />
            </div>
            <div>
              <p style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 15, color: '#ffffff', margin: 0 }}>
                Dourous-Net
              </p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', margin: 0, letterSpacing: 1 }}>دروس نت</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', color: 'rgba(255,255,255,.25)',
            padding: '10px 10px 6px', textTransform: 'uppercase' }}>Navigation</p>

          {NAV.map(({ href, label, Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link key={href} href={href} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 10,
                textDecoration: 'none', transition: 'all .15s',
                background:  active ? 'rgba(34,160,95,.18)' : 'transparent',
                color:       active ? '#4fd98a' : 'rgba(255,255,255,.55)',
                fontWeight:  active ? 600 : 400,
                fontSize: 13.5,
                borderLeft: active ? '3px solid #22a05f' : '3px solid transparent',
                marginLeft: -1,
              }}>
                <Icon style={{ width: 16, height: 16, flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{label}</span>
                {active && <ChevronRight style={{ width: 13, height: 13, opacity: .6 }} />}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div style={{ padding: '12px 10px 18px', borderTop: '1px solid rgba(255,255,255,.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', marginBottom: 6 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'linear-gradient(135deg, #22a05f, #1a7a4a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0,
            }}>{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.9)', margin: 0,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {userName || 'Élève'}
              </p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', margin: 0,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {userEmail}
              </p>
            </div>
          </div>
          <button onClick={logout} style={{
            display: 'flex', alignItems: 'center', gap: 8, width: '100%',
            padding: '8px 12px', borderRadius: 10, border: 'none',
            background: 'rgba(255,255,255,.06)', color: 'rgba(255,255,255,.45)',
            fontSize: 12.5, cursor: 'pointer', transition: 'all .15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.1)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,.06)')}>
            <LogOut style={{ width: 13, height: 13 }} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Page ─────────────────────────────────────────── */}
      <main style={{ flex: 1, overflow: 'auto', background: 'var(--bg)' }}>
        {children}
      </main>
    </div>
  );
}
