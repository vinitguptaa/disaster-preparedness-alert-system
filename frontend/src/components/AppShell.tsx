import { Link, NavLink, useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'

const navigation = [
  { to: '/dashboard', icon: '⌂', label: 'Overview' },
  { to: '/disasters', icon: '◉', label: 'Live alerts' },
  { to: '/preparedness', icon: '✓', label: 'Preparedness' },
  { to: '/learning', icon: '◈', label: 'Learn' },
  { to: '/resources', icon: '⌁', label: 'Resources' },
]

export default function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    navigate('/login')
  }
  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <Link to="/dashboard" className="brand" aria-label="DisasterSafe dashboard"><span className="brand-mark">✦</span><span>disaster<span>safe</span></span></Link>
        <nav aria-label="Main navigation" className="side-nav">{navigation.map((item) => <NavLink key={item.to} to={item.to} className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}><span aria-hidden="true">{item.icon}</span>{item.label}</NavLink>)}</nav>
        <div className="sidebar-bottom"><Link className="side-link" to="/profile"><span aria-hidden="true">◌</span>Profile</Link><button className="side-link button-link" onClick={logout}><span aria-hidden="true">↗</span>Sign out</button></div>
      </aside>
      <div className="app-content"><header className="app-topbar"><p><span className="status-dot" /> System monitoring active</p><Link to="/profile" className="profile-chip"><span className="avatar">You</span><span>My account</span></Link></header><main>{children}</main></div>
    </div>
  )
}
