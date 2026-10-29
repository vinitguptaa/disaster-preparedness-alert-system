import { useState } from 'react'
import { Link } from 'react-router-dom'

const guides = {
  Flood: ['≈', 'Move to higher ground', 'Avoid walking or driving through flood water. Take your go-bag and follow official instructions.'],
  Earthquake: ['⌂', 'Drop, cover, and hold on', 'Get low, cover your head and neck, and stay clear of glass until shaking stops.'],
  Fire: ['△', 'Get out and stay out', 'Use the nearest safe exit. Do not use lifts. Call emergency services from a safe location.'],
} as const
type Hazard = keyof typeof guides

function LandingPage() {
  const [hazard, setHazard] = useState<Hazard>('Flood')
  const [icon, action, copy] = guides[hazard]
  return <div className="landing">
    <header className="landing-nav"><Link to="/" className="landing-brand"><span>✦</span>disaster<b>safe</b></Link><nav><a href="#how">How it works</a><a href="#guides">Safety guides</a><Link to="/login">Sign in</Link><Link className="nav-cta" to="/signup">Create account →</Link></nav></header>
    <main>
      <section className="landing-hero"><div className="hero-copy"><p className="hero-pill"><i /> Official sources. Clear action.</p><h1>Calm, clear guidance <em>when it matters most.</em></h1><p className="hero-description">One place to track verified alerts, make a family plan, and build confidence before an emergency happens.</p><div className="hero-actions"><Link className="hero-primary" to="/signup">Start preparing <span>→</span></Link><a className="hero-secondary" href="#guides">◉ Explore safety guides</a></div><p className="trust-line">Built for everyday readiness, <strong>not everyday worry.</strong></p></div>
      <div className="hero-visual" aria-label="Preview of an alert dashboard"><div className="visual-top"><b>✦</b> Live safety overview <small><i /> Monitoring</small></div><div className="mock-map"><span className="map-road one" /><span className="map-road two" /><span className="map-pin one">●</span><span className="map-pin two">●</span><label className="your-area">Your area</label></div><div className="floating-alert"><b>✓</b><div><small>YOUR AREA</small><strong>All clear for now</strong><p>We’ll tell you if that changes.</p></div></div><div className="floating-score"><small>READINESS</small><strong>72<sup>%</sup></strong><span>↑ Building steadily</span></div></div></section>
      <section className="proof-strip"><p><b>Simple enough</b> for a stressful moment.</p><p><b>Useful enough</b> for everyday preparedness.</p><p><b>Designed around</b> official information.</p></section>
      <section id="how" className="how-section"><p className="section-label">A steadier way to prepare</p><h2>Everything important, <em>without the noise.</em></h2><p className="how-intro">DisasterSafe turns complicated emergency information into the next clear thing you can do.</p><div className="how-grid"><article><span>01</span><b>◉</b><h3>See verified alerts</h3><p>Relevant updates from official sources, organized around places you care about.</p></article><article><span>02</span><b>✓</b><h3>Make a real plan</h3><p>Keep contacts, meeting points and essentials ready before a crisis begins.</p></article><article><span>03</span><b>◈</b><h3>Know your next step</h3><p>Plain-language actions for before, during and after an emergency.</p></article></div></section>
      <section id="guides" className="guide-section"><div className="guide-copy"><p className="section-label">Practice calm</p><h2>What would you do <em>first?</em></h2><p>Choose a situation to see the first, most useful action. Practical guides are always available in your dashboard.</p><div className="hazard-tabs" role="tablist">{(Object.keys(guides) as Hazard[]).map((name) => <button key={name} onClick={() => setHazard(name)} className={hazard === name ? 'selected' : ''} role="tab" aria-selected={hazard === name}>{name}</button>)}</div></div><article className="guide-card"><div className="guide-symbol">{icon}</div><p>IF YOU EXPERIENCE A {hazard.toUpperCase()}</p><h3>{action}</h3><i /><span>{copy}</span><Link to="/learning">Read the full guide →</Link></article></section>
      <section className="final-cta"><p className="section-label">Your safety starts small</p><h2>Make a plan you’ll be glad you never had to use.</h2><Link to="/signup">Create your free safety plan →</Link></section>
    </main><footer><span className="landing-brand"><i>✦</i>disaster<b>safe</b></span><p>Preparedness is a quiet kind of strength.</p><Link to="/login">Sign in</Link></footer>
  </div>
}
export default LandingPage
