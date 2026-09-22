import { useState } from 'react'
import Alert from '../components/Alert.jsx'

const settingsSections = [
  { id: 'profile', label: 'Profile', detail: 'Personal details and workspace identity' },
  { id: 'preferences', label: 'Preferences', detail: 'Make DevTrack feel like yours' },
  { id: 'notifications', label: 'Notifications', detail: 'Choose what deserves your attention' },
]

function Settings() {
  const [activeSection, setActiveSection] = useState('profile')
  const [saved, setSaved] = useState(false)
  const [emailUpdates, setEmailUpdates] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(true)
  const [focusReminders, setFocusReminders] = useState(false)
  const [theme, setTheme] = useState('Light')

  const saveChanges = () => {
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2200)
  }

  return <section className="page-view settings-page">
    <div className="page-intro"><div><p className="eyebrow">Workspace control</p><h1>Settings<span className="coral-dot">.</span></h1><p className="subheading">Shape your workspace around the way you do your best work.</p></div><button className="dark-button settings-save" onClick={saveChanges}>{saved ? 'Saved' : 'Save changes'} <span>{saved ? '✓' : '→'}</span></button></div>
    {saved && <Alert type="success" title="Settings saved" message="Your workspace preferences are up to date." toast onDismiss={() => setSaved(false)} />}
    <div className="settings-layout">
      <aside className="settings-nav panel">
        <p className="eyebrow">Account</p>
        <div className="settings-tabs">{settingsSections.map((section) => <button className={activeSection === section.id ? 'settings-tab active' : 'settings-tab'} key={section.id} onClick={() => setActiveSection(section.id)}><span className={`settings-tab-icon settings-tab-${section.id}`} aria-hidden="true" /><span><strong>{section.label}</strong><small>{section.detail}</small></span><b>›</b></button>)}</div>
        <div className="settings-help"><span>✦</span><strong>Need a hand?</strong><p>Our support team is here when you need a second opinion.</p><button className="text-button">Visit help center <span>→</span></button></div>
      </aside>
      <div className="settings-content">
        {activeSection === 'profile' && <section className="panel settings-panel"><div className="settings-heading"><div><p className="eyebrow">Profile</p><h2>Your profile</h2><p>Keep your identity and workspace details up to date.</p></div><span className="profile-avatar-large">SC</span></div><div className="settings-divider" /><div className="settings-form-grid"><label>Full name<input defaultValue="Sourav Chatterjee" /></label><label>Workspace name<input defaultValue="Personal workspace" /></label><label>Email address<input defaultValue="sourav@example.com" type="email" /></label><label>Role<select defaultValue="Developer"><option>Developer</option><option>Engineering lead</option><option>Product designer</option><option>Student</option></select></label></div><Alert type="info" message="Your profile is visible only to members of your workspace." /></section>}
        {activeSection === 'preferences' && <section className="panel settings-panel"><div className="settings-heading"><div><p className="eyebrow">Preferences</p><h2>How DevTrack works for you</h2><p>Set the defaults that keep your days feeling clear and focused.</p></div></div><div className="settings-divider" /><div className="preference-row"><div><strong>Appearance</strong><small>Choose how DevTrack looks on this device.</small></div><div className="segmented-control">{['Light', 'System'].map((option) => <button className={theme === option ? 'selected' : ''} key={option} onClick={() => setTheme(option)}>{option}</button>)}</div></div><div className="preference-row"><div><strong>Start of week</strong><small>Used for weekly summaries and focus trends.</small></div><select className="compact-select" defaultValue="Monday"><option>Monday</option><option>Sunday</option></select></div><div className="preference-row"><div><strong>Daily focus goal</strong><small>Keep your target visible as you plan the day.</small></div><div className="stepper"><button aria-label="Decrease focus goal">−</button><strong>90 min</strong><button aria-label="Increase focus goal">＋</button></div></div></section>}
        {activeSection === 'notifications' && <section className="panel settings-panel"><div className="settings-heading"><div><p className="eyebrow">Notifications</p><h2>Choose your signals</h2><p>Stay informed without letting every update interrupt your flow.</p></div></div><div className="settings-divider" /><div className="notification-setting"><span className="setting-icon mint">✉</span><div><strong>Product updates</strong><small>New features, tips, and improvements from DevTrack.</small></div><button className={emailUpdates ? 'toggle is-on' : 'toggle'} onClick={() => setEmailUpdates((value) => !value)} aria-label="Toggle product updates"><i /></button></div><div className="notification-setting"><span className="setting-icon yellow">◷</span><div><strong>Weekly digest</strong><small>A calm summary of your progress every Monday morning.</small></div><button className={weeklyDigest ? 'toggle is-on' : 'toggle'} onClick={() => setWeeklyDigest((value) => !value)} aria-label="Toggle weekly digest"><i /></button></div><div className="notification-setting"><span className="setting-icon coral">⌁</span><div><strong>Focus reminders</strong><small>A gentle nudge when it is time to protect your focus block.</small></div><button className={focusReminders ? 'toggle is-on' : 'toggle'} onClick={() => setFocusReminders((value) => !value)} aria-label="Toggle focus reminders"><i /></button></div></section>}
      </div>
    </div>
  </section>
}

export default Settings