import { useEffect, useMemo, useState } from 'react'
import { fetchTasks, updateTask } from '../services/tasks.js'

function MyTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCompleted, setShowCompleted] = useState(true)

  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await fetchTasks()
        setTasks(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadTasks()
  }, [])

  const handleToggleTask = async (task) => {
    const nextStatus = task.status === 'done' ? 'todo' : 'done'

    try {
      const updated = await updateTask(task.id, { status: nextStatus })
      setTasks((currentTasks) =>
        currentTasks.map((item) => (item.id === updated.id ? updated : item)),
      )
    } catch (error) {
      console.error(error)
    }
  }

  const visibleGroups = useMemo(() => {
    const groups = {
      Today: [],
      Upcoming: [],
    }

    tasks.forEach((task) => {
      const isDone = task.status === 'done'
      if (!showCompleted && isDone) {
        return
      }

      const bucket = task.dueDate ? 'Upcoming' : 'Today'
      groups[bucket].push(task)
    })

    return Object.entries(groups).map(([label, items]) => ({
      label,
      items,
    }))
  }, [tasks, showCompleted])

  const completedCount = tasks.filter((task) => task.status === 'done').length
  const totalTasks = tasks.length
  const todayTasks = tasks.filter((task) => task.status !== 'done').length

  if (loading) {
    return <section className="page-view"><div className="page-intro"><div><p className="eyebrow">Work queue</p><h1>My tasks<span className="coral-dot">.</span></h1></div></div><p>Loading tasks…</p></section>
  }

  return (
    <section className="page-view">
      <div className="page-intro">
        <div>
          <p className="eyebrow">Work queue</p>
          <h1>My tasks<span className="coral-dot">.</span></h1>
          <p className="subheading">Keep the important work moving, one clear next step at a time.</p>
        </div>
        <button className="new-task">＋ New task</button>
      </div>
      <div className="task-summary">
        <div><strong>{totalTasks}</strong><span>Total tasks</span></div>
        <div><strong>{todayTasks}</strong><span>Due today</span></div>
        <div><strong>{completedCount}</strong><span>Completed</span></div>
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={(event) => setShowCompleted(event.target.checked)}
          />
          Show completed
        </label>
      </div>
      <div className="page-columns">
        <div className="panel grouped-tasks">
          {visibleGroups.map((group) => (
            <div className="task-group" key={group.label}>
              <div className="group-title">
                <h2>{group.label}</h2>
                <span>{group.items.length} tasks</span>
              </div>
              {group.items.length === 0 ? (
                <p>No tasks here.</p>
              ) : (
                group.items.map((task) => (
                  <div
                    className={task.status === 'done' ? 'task-row completed-task' : 'task-row'}
                    key={task.id}
                  >
                    <button
                      className="check-box"
                      aria-label={`Complete ${task.title}`}
                      onClick={() => handleToggleTask(task)}
                    />
                    <div className="task-copy">
                      <strong>{task.title}</strong>
                      <span>{task.project}</span>
                    </div>
                    <span className={`priority ${task.priority}`}>{task.priority}</span>
                    <span className="task-due">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                    </span>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
        <aside className="panel side-note">
          <p className="eyebrow">Task health</p>
          <h2>Your queue is balanced.</h2>
          <p>Two focused tasks today leaves room for your learning session later.</p>
          <div className="health-bar"><i /></div>
          <small>68% of this week’s tasks are on track</small>
        </aside>
      </div>
    </section>
  )
}

export default MyTasks
