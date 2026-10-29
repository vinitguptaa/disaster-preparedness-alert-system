import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

type KitItem = { id: number; item_name: string; is_completed: boolean }
type Contact = { id: number }
type FamilyPlan = { id: number; meeting_point: string | null; emergency_contact_name: string | null }

const essentials = [
  ['Water & food', 'Keep at least three days of drinking water and shelf-stable food.'],
  ['Medicines', 'Keep prescriptions, copies and essential medical information ready.'],
  ['Light & power', 'Add a torch, batteries, power bank and a battery radio.'],
]

function PreparednessPage() {
  const [items, setItems] = useState<KitItem[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [plan, setPlan] = useState<FamilyPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<number | null>(null)
  const [newItem, setNewItem] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    Promise.allSettled([api.get<KitItem[]>('/api/emergency-kit'), api.get<Contact[]>('/api/emergency-contacts'), api.get<FamilyPlan | null>('/api/family-plan')]).then(([kit, savedContacts, familyPlan]) => {
      if (kit.status === 'fulfilled') setItems(kit.value.data)
      if (savedContacts.status === 'fulfilled') setContacts(savedContacts.value.data)
      if (familyPlan.status === 'fulfilled') setPlan(familyPlan.value.data)
    }).finally(() => setLoading(false))
  }, [])

  const kitReady = items.filter((item) => item.is_completed).length
  const planReady = Boolean(plan?.meeting_point && plan?.emergency_contact_name)
  const scoreParts = [items.length > 0 && kitReady === items.length, contacts.length > 0, planReady]
  const readiness = Math.round((scoreParts.filter(Boolean).length / scoreParts.length) * 100)
  const nextStep = !items.length || kitReady < items.length ? ['Finish your go-bag', 'A packed kit saves time when you need to leave quickly.', '/preparedness'] : !contacts.length ? ['Add a trusted contact', 'Choose someone outside your immediate area who can coordinate your family.', '/emergency-contacts'] : !planReady ? ['Choose a meeting place', 'A familiar backup location prevents confusion if phones are unavailable.', '/family-plan'] : ['Review your plan together', 'Practice where to meet and how to contact one another twice a year.', '/family-plan']

  const toggle = async (item: KitItem) => {
    setUpdating(item.id)
    try { const response = await api.patch<KitItem>(`/api/emergency-kit/${item.id}`, { is_completed: !item.is_completed }); setItems((current) => current.map((entry) => entry.id === item.id ? response.data : entry)) } finally { setUpdating(null) }
  }

  const addItem = async (itemName = newItem) => {
    const item_name = itemName.trim()
    if (!item_name) return
    setAdding(true)
    try {
      const response = await api.post<KitItem>('/api/emergency-kit', { item_name })
      setItems((current) => [...current, response.data])
      setNewItem('')
    } finally { setAdding(false) }
  }

  const removeItem = async (item: KitItem) => {
    setUpdating(item.id)
    try { await api.delete(`/api/emergency-kit/${item.id}`); setItems((current) => current.filter((entry) => entry.id !== item.id)) } finally { setUpdating(null) }
  }

  return <section className="readiness-page">
    <div className="readiness-hero"><div><p className="section-label">Your readiness plan</p><h1>Preparation turns panic<br />into <em>practical action.</em></h1><p>Keep the few decisions that matter most ready before an alert arrives: supplies, people, and a place to meet.</p></div><div className="readiness-score" aria-label={`${readiness}% prepared`}><span>Readiness</span><strong>{readiness}<small>%</small></strong><div><i style={{ width: `${readiness}%` }} /></div><p>{scoreParts.filter(Boolean).length} of 3 foundations in place</p></div></div>
    <section className="next-action"><div className="next-action-icon">→</div><div><span>Recommended next step</span><h2>{nextStep[0]}</h2><p>{nextStep[1]}</p></div><Link to={nextStep[2]}>Do this now</Link></section>
    <div className="readiness-grid"><article className="readiness-card kit-card"><div className="card-heading"><div><span className="section-label">Go-bag checklist</span><h2>Ready-to-grab essentials</h2></div><b>{kitReady}/{items.length || '—'}</b></div><form className="kit-add" onSubmit={(event) => { event.preventDefault(); addItem() }}><input value={newItem} onChange={(event) => setNewItem(event.target.value)} maxLength={100} placeholder="Add an item, e.g. prescription medicine" aria-label="New go-bag item" /><button disabled={adding || !newItem.trim()}>{adding ? 'Adding…' : 'Add item'}</button></form>{loading ? <p className="muted-copy">Loading your checklist…</p> : items.length ? <div className="kit-list">{items.map((item) => <div className={item.is_completed ? 'kit-row done' : 'kit-row'} key={item.id}><button onClick={() => toggle(item)} disabled={updating === item.id} aria-label={`Mark ${item.item_name} ${item.is_completed ? 'not ready' : 'ready'}`}><i>{item.is_completed ? '✓' : ''}</i><span>{item.item_name}</span><small>{item.is_completed ? 'Ready' : 'Mark ready'}</small></button><button className="remove-kit-item" onClick={() => removeItem(item)} disabled={updating === item.id} aria-label={`Remove ${item.item_name}`}>×</button></div>)}</div> : <div className="empty-readiness"><p>Start with water, medicines, a torch, and copies of essential documents.</p><div className="quick-adds">{['Water', 'Torch and batteries', 'First-aid supplies'].map((item) => <button key={item} onClick={() => addItem(item)} disabled={adding}>+ {item}</button>)}</div></div>}</article><article className="readiness-card why-card"><span className="section-label">Why this matters</span><h2>When systems are busy, your plan works offline.</h2><p>During a disaster, networks may be congested and choices become harder. A written plan and a small kit help your household act immediately.</p><ul>{essentials.map(([title, description]) => <li key={title}><b>✓</b><div><strong>{title}</strong><span>{description}</span></div></li>)}</ul></article></div>
    <section className="foundation-section"><div><p className="section-label">The three foundations</p><h2>Useful long before an emergency.</h2></div><div className="foundation-grid"><Link to="/family-plan"><span>01</span><b>Family plan</b><p>{planReady ? 'Meeting place and contact saved' : 'Agree where to meet and who to call'}</p><i>{planReady ? 'Ready ✓' : 'Set up →'}</i></Link><Link to="/emergency-contacts"><span>02</span><b>Trusted contacts</b><p>{contacts.length ? `${contacts.length} contact${contacts.length === 1 ? '' : 's'} available` : 'Save people you can reach quickly'}</p><i>{contacts.length ? 'Ready ✓' : 'Add contact →'}</i></Link><Link to="/disasters"><span>03</span><b>Live alerts</b><p>Use your location to check verified government warnings.</p><i>Open monitoring →</i></Link></div></section>
  </section>
}

export default PreparednessPage
