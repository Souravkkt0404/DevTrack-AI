const lessons = [
  { number: '01', title: 'Express middleware patterns', type: 'Course', duration: '18 min', status: 'Complete' },
  { number: '02', title: 'Designing resilient API routes', type: 'Article', duration: '12 min', status: 'In progress' },
  { number: '03', title: 'Testing controllers and services', type: 'Workshop', duration: '35 min', status: 'Up next' },
]

function LearningPath() {
  return <section className="page-view"><div className="page-intro"><div><p className="eyebrow">Current track</p><h1>Learning path<span className="coral-dot">.</span></h1><p className="subheading">Backend foundations for confident, maintainable systems.</p></div><span className="path-badge">12 day streak ✦</span></div><div className="learning-hero"><div><p className="eyebrow">Your progress</p><h2>Building better APIs</h2><p>Keep going. You are further along than you think.</p></div><div className="path-progress"><strong>42%</strong><div><i /></div><small>4 of 10 lessons complete</small></div></div><div className="panel lesson-panel"><div className="panel-heading"><div><p className="eyebrow">Curriculum</p><h2>Up next in your path</h2></div><button className="text-button">Browse library →</button></div><div className="lesson-list">{lessons.map((lesson) => <div className="lesson-row" key={lesson.number}><span className="lesson-number">{lesson.number}</span><div className="lesson-copy"><strong>{lesson.title}</strong><span>{lesson.type} · {lesson.duration}</span></div><span className={`lesson-status ${lesson.status.toLowerCase().replace(' ', '-')}`}>{lesson.status}</span><button className="lesson-action" aria-label={`Open ${lesson.title}`}>→</button></div>)}</div></div></section>
}

export default LearningPath
