import { Link } from 'react-router-dom'

const resources = [
  { icon: '☎', title: 'Emergency contacts', description: 'Save the people who should hear from you first, including an out-of-area contact.', to: '/emergency-contacts', action: 'Add or manage contacts' },
  { icon: '⌂', title: 'Family meeting plan', description: 'Write down where to meet if home, school, or work cannot be reached.', to: '/family-plan', action: 'Open family plan' },
  { icon: '◉', title: 'Official live alerts', description: 'Use your location to check SACHET / NDMA notices and receive browser notifications.', to: '/disasters', action: 'Open monitoring centre' },
  { icon: '✓', title: 'Go-bag checklist', description: 'Keep water, medicines, light, documents, and other essentials ready to grab.', to: '/preparedness', action: 'Finish your go-bag' },
  { icon: '◈', title: 'Safety guides', description: 'Read short before, during, and after actions for common hazards.', to: '/learning', action: 'Open safety guides' },
  { icon: '?', title: 'Decision practice', description: 'Use scenario quizzes to practise safe choices before you need to make them.', to: '/quizzes', action: 'Start a knowledge check' },
]

function ResourcesPage() {
  return <section className="content-page resources-page"><p className="section-label">Emergency resources</p><div className="page-title-row"><div><h1>Your practical<br /><em>safety toolkit.</em></h1><p>Every resource here is connected to an action you can save, practise, or use when an emergency happens.</p></div><Link to="/emergency-contacts" className="primary-button">Add emergency contact <span>→</span></Link></div><div className="resource-callout"><b>Start here</b><p>Add at least one contact outside your immediate household, then agree on a meeting place. Those two decisions still work if mobile networks are busy.</p><Link to="/emergency-contacts">Add a contact →</Link></div><div className="topic-grid resource-grid">{resources.map((item, index) => <article className="topic-card" key={item.title}><span className="topic-count">0{index + 1}</span><div className="topic-icon amber-icon">{item.icon}</div><h2>{item.title}</h2><p>{item.description}</p><Link to={item.to}>{item.action} <b>→</b></Link></article>)}</div></section>
}

export default ResourcesPage
