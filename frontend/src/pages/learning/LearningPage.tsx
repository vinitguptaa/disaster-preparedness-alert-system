import { useState } from 'react'
import { Link } from 'react-router-dom'

type Guide = { icon: string; title: string; risk: string; before: string[]; during: string[]; after: string[] }
const guides: Guide[] = [
  { icon: '≈', title: 'Flood', risk: 'Never walk or drive through floodwater.', before: ['Save official warnings and identify higher ground.', 'Move documents, medicines and power banks above likely water level.'], during: ['Move to higher ground early; avoid bridges and underpasses.', 'Turn around if water covers the road.'], after: ['Return only when authorities say it is safe.', 'Avoid downed lines and contaminated water.'] },
  { icon: '⌂', title: 'Earthquake', risk: 'Drop, Cover and Hold On — do not run outside while shaking.', before: ['Secure heavy furniture and make a meeting plan.', 'Keep shoes and a torch near your bed.'], during: ['Drop to hands and knees, cover head and neck, hold on.', 'Stay away from windows; do not use lifts.'], after: ['Check for injuries, gas leaks and damaged wiring.', 'Expect aftershocks and follow official updates.'] },
  { icon: '◌', title: 'Cyclone', risk: 'Shelter inside, away from windows and loose objects.', before: ['Charge devices and bring outdoor objects inside.', 'Know the closest official shelter and evacuation route.'], during: ['Stay in an interior room; keep away from glass.', 'Do not go outside during the eye of the storm.'], after: ['Avoid damaged buildings and standing water.', 'Use messages, not calls, to keep networks free.'] },
  { icon: 'ϟ', title: 'Thunderstorm', risk: 'When thunder roars, go indoors.', before: ['Pause outdoor activities early and secure loose items.', 'Keep a battery light ready for a power cut.'], during: ['Stay inside a substantial building or enclosed vehicle.', 'Avoid plumbing, wired electronics and open areas.'], after: ['Wait 30 minutes after the last thunder before going out.', 'Report fallen power lines to authorities.'] },
]

function LearningPage() {
  const [selected, setSelected] = useState(0)
  const [phase, setPhase] = useState<'before' | 'during' | 'after'>('before')
  const guide = guides[selected]
  const actions = guide[phase]
  return <section className="learning-page">
    <div className="learning-hero"><div><p className="section-label">Safety learning centre</p><h1>Clear actions, <em>not information overload.</em></h1><p>Built for a stressful moment: choose the hazard, see the phase, and act on the most important steps first.</p></div><Link to="/quizzes" className="primary-button">Test your readiness <span>→</span></Link></div>
    <section className="guide-workbench"><aside><span>Choose a hazard</span>{guides.map((item, index) => <button key={item.title} className={selected === index ? 'selected' : ''} onClick={() => { setSelected(index); setPhase('before') }}><b>{item.icon}</b>{item.title}<i>→</i></button>)}</aside><div className="guide-content"><div className="guide-header"><div className="guide-symbol">{guide.icon}</div><div><p className="section-label">Practical safety guide</p><h2>{guide.title} safety</h2></div></div><div className="risk-note"><b>Remember</b><span>{guide.risk}</span></div><div className="phase-tabs">{(['before', 'during', 'after'] as const).map((item) => <button key={item} className={phase === item ? 'active' : ''} onClick={() => setPhase(item)}>{item === 'before' ? 'Before' : item === 'during' ? 'During' : 'After'}</button>)}</div><ol className="action-list">{actions.map((action, index) => <li key={action}><b>0{index + 1}</b><span>{action}</span></li>)}</ol><p className="guide-disclaimer">Use official local instructions if they differ from this general guidance.</p></div></section>
    <section className="learning-bottom"><article><span className="section-label">A safer way to decide</span><h2>Follow the source,<br />then the action.</h2><p>DisasterSafe does not replace emergency services or official instructions. It organises verified alerts and established safety guidance so you can decide faster.</p><Link to="/disasters">Open live monitoring →</Link></article><article className="quiz-prompt"><span>Knowledge check</span><h3>Can you spot the safest next action?</h3><p>Short scenario-based quizzes reinforce the choices that matter under pressure.</p><Link to="/quizzes">Start a quiz →</Link></article></section>
  </section>
}

export default LearningPage
