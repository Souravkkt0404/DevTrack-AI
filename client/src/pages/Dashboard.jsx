import { useEffect, useState } from "react";
import Insights from "./Insights.jsx";
import LearningPath from "./LearningPath.jsx";
import MyTasks from "./MyTasks.jsx";
import Settings from "./Settings.jsx";
import {
  createTask,
  deleteTask,
  fetchDashboardSummary,
  fetchTasks,
  updateTask,
} from "../services/tasks.js";

const activity = [
  {
    initials: "SC",
    text: "You completed “Set up API routes”",
    time: "32 min ago",
    color: "mint",
  },
  {
    initials: "AI",
    text: "Your weekly focus plan is ready",
    time: "2 hours ago",
    color: "coral",
  },
  {
    initials: "SC",
    text: "You logged 48 minutes on API gateway",
    time: "Yesterday",
    color: "lavender",
  },
];

const morningBlocks = [
  {
    time: "09:00 - 09:15",
    title: "Set your focus",
    detail: "Review the API refactor and choose one clear outcome.",
  },
  {
    time: "09:15 - 10:45",
    title: "Deep work",
    detail: "Refactor auth middleware with notifications paused.",
  },
  {
    time: "10:45 - 11:00",
    title: "Reset break",
    detail: "Step away, hydrate, and capture any loose thoughts.",
  },
  {
    time: "11:00 - 12:00",
    title: "Ship the next step",
    detail: "Run tests, review the diff, and leave a handoff note.",
  },
];

function Dashboard() {
  const [activeView, setActiveView] = useState("Overview");
  const [taskFilter, setTaskFilter] = useState("All tasks");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [taskItems, setTaskItems] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0,
  });
  const [taskMenuId, setTaskMenuId] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [morningPlanOpen, setMorningPlanOpen] = useState(false);
  const [completedMorningBlocks, setCompletedMorningBlocks] = useState([]);
  const [showAllTasksTable, setShowAllTasksTable] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskProject, setNewTaskProject] = useState("API gateway");

  const now = new Date();
  const currentHour = now.getHours();
  const greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 18
        ? "Good Afternoon"
        : "Good Evening";
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(now);
  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(now);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [tasksResponse, summaryResponse] = await Promise.all([
          fetchTasks(),
          fetchDashboardSummary(),
        ]);

        setTaskItems(tasksResponse);
        setSummary(summaryResponse);
      } catch (error) {
        console.error(error);
      }
    }

    loadDashboardData();
  }, []);

  const visibleTasks = taskItems.filter((task) => {
    const taskState =
      task.status === "done"
        ? "Done"
        : task.status === "in-progress"
          ? "In progress"
          : "Queued";
    const matchesFilter =
      taskFilter === "All tasks" || taskState === taskFilter;
    const matchesSearch = `${task.title} ${task.project}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const addTask = async (event) => {
    event.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const createdTask = await createTask({
        title: newTaskTitle.trim(),
        project: newTaskProject,
        priority: "medium",
        status: "todo",
      });

      setTaskItems((items) => [createdTask, ...items]);
      setSummary((currentSummary) => ({
        ...currentSummary,
        total: currentSummary.total + 1,
        todo: currentSummary.todo + 1,
      }));
      setNewTaskTitle("");
      setNewTaskOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const deletedTask = await deleteTask(taskId);
      setTaskItems((items) => items.filter((task) => task.id !== taskId));
      setTaskMenuId(null);
      setSummary((currentSummary) => ({
        ...currentSummary,
        total: Math.max(currentSummary.total - 1, 0),
        completed:
          deletedTask.status === "done"
            ? Math.max(currentSummary.completed - 1, 0)
            : currentSummary.completed,
        todo:
          deletedTask.status === "todo"
            ? Math.max(currentSummary.todo - 1, 0)
            : currentSummary.todo,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditTask = async (task) => {
    const nextTitle = window.prompt("Edit task title", task.title);

    if (nextTitle === null) {
      setTaskMenuId(null);
      return;
    }

    const trimmedTitle = nextTitle.trim();
    if (!trimmedTitle) {
      setTaskMenuId(null);
      return;
    }

    try {
      const updatedTask = await updateTask(task.id, { title: trimmedTitle });
      setTaskItems((items) =>
        items.map((entry) =>
          entry.id === updatedTask.id ? updatedTask : entry,
        ),
      );
      setTaskMenuId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleMorningBlock = (title) => {
    setCompletedMorningBlocks((blocks) =>
      blocks.includes(title)
        ? blocks.filter((block) => block !== title)
        : [...blocks, title],
    );
  };

  return (
    <div
      className={sidebarCollapsed ? "app-shell sidebar-collapsed" : "app-shell"}
    >
      <aside className={sidebarCollapsed ? "sidebar collapsed" : "sidebar"}>
        <div className="brand">
          <span className="brand-mark">D</span>
          <span>
            devtrack<span className="brand-dot">.</span>ai
          </span>
        </div>
        <div className="workspace-switcher">
          <span className="workspace-avatar">SC</span>
          <span>
            <strong>Sourav Chatterjee</strong>
            <small>Personal workspace</small>
          </span>
          <span className="chevron">⌄</span>
        </div>
        <nav className="main-nav" aria-label="Main navigation">
          {["Overview", "My tasks", "Learning path", "Insights"].map((item) => (
            <button
              className={activeView === item ? "nav-item active" : "nav-item"}
              key={item}
              onClick={() => setActiveView(item)}
            >
              <span
                className={`nav-icon icon-${item.toLowerCase().replace(" ", "-")}`}
                aria-hidden="true"
              />
              {item}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button
            className={
              activeView === "Settings" ? "nav-item active" : "nav-item"
            }
            onClick={() => setActiveView("Settings")}
          >
            <span className="nav-icon icon-settings" aria-hidden="true" />
            Settings
          </button>
          <div className="upgrade-note">
            <span className="spark">✦</span>
            <strong>Build momentum</strong>
            <p>Keep your streak alive with a focused session.</p>
            <button>
              Start a session <span>→</span>
            </button>
          </div>
          <div className="profile-row">
            <span className="workspace-avatar small">SC</span>
            <span>
              <strong>Sourav Chatterjee</strong>
              <small>Free plan</small>
            </span>
            <span className="more">•••</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className={searchOpen ? "topbar search-open" : "topbar"}>
          <div className="topbar-leading">
            <button
              className="menu-button"
              onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
              aria-label={
                sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
              aria-expanded={!sidebarCollapsed}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <span />
              <span />
              <span />
            </button>
            <div className="breadcrumbs">
              <span>Workspace</span>
              <span>/</span>
              <strong>{activeView}</strong>
            </div>
          </div>
          <div className="topbar-actions">
            {searchOpen && (
              <div className="popover search-popover">
                {/* <label htmlFor="task-search">Search workspace</label> */}
                <div className="search-input">
                  <span>⌕</span>
                  <input
                    id="task-search"
                    autoFocus
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search tasks or projects"
                  />
                  <button
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                </div>
                {searchQuery && (
                  <div className="search-results">
                    {visibleTasks.length ? (
                      visibleTasks.slice(0, 4).map((task) => (
                        <button
                          key={task.id}
                          onClick={() => {
                            setSearchOpen(false);
                            setActiveView("Overview");
                          }}
                        >
                          <strong>{task.title}</strong>
                          <small>
                            {task.project} ·{" "}
                            {task.status === "done"
                              ? "Done"
                              : task.status === "in-progress"
                                ? "In progress"
                                : "Queued"}
                          </small>
                        </button>
                      ))
                    ) : (
                      <p>No matching tasks.</p>
                    )}
                  </div>
                )}
              </div>
            )}
            <button
              className={searchOpen ? "icon-button selected" : "icon-button"}
              onClick={() => {
                setSearchOpen((open) => !open);
                setNotificationsOpen(false);
              }}
              aria-label="Search"
              aria-expanded={searchOpen}
            >
              ⌕
            </button>
            <button
              className={
                notificationsOpen
                  ? "icon-button notification selected"
                  : "icon-button notification"
              }
              onClick={() => {
                setNotificationsOpen((open) => !open);
                setSearchOpen(false);
              }}
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
            >
              ♢<i />
            </button>
            <button
              className="new-task"
              onClick={() => {
                setNewTaskOpen(true);
                setSearchOpen(false);
                setNotificationsOpen(false);
              }}
            >
              <span>＋</span> New task
            </button>
          </div>
        </header>

        {notificationsOpen && (
          <div className="popover notification-popover">
            <div className="popover-heading">
              <strong>Notifications</strong>
              <button
                onClick={() => setNotificationsOpen(false)}
                aria-label="Close notifications"
              >
                ×
              </button>
            </div>
            <div className="notification-item">
              <span className="notification-dot" />
              <div>
                <strong>Your weekly focus plan is ready</strong>
                <small>2 hours ago</small>
              </div>
            </div>
            <div className="notification-item">
              <span className="notification-dot muted" />
              <div>
                <strong>You are on a 12 day learning streak</strong>
                <small>Yesterday</small>
              </div>
            </div>
            <button className="text-button">View all activity →</button>
          </div>
        )}
        {newTaskOpen && (
          <div className="modal-backdrop" role="presentation">
            <form className="task-modal" onSubmit={addTask}>
              <div className="popover-heading">
                <div>
                  <p className="eyebrow">Work queue</p>
                  <h2>Create a task</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setNewTaskOpen(false)}
                  aria-label="Close new task form"
                >
                  ×
                </button>
              </div>
              <label htmlFor="new-task-title">Task name</label>
              <input
                id="new-task-title"
                autoFocus
                value={newTaskTitle}
                onChange={(event) => setNewTaskTitle(event.target.value)}
                placeholder="What needs your attention?"
              />
              <label htmlFor="new-task-project">Project</label>
              <select
                id="new-task-project"
                value={newTaskProject}
                onChange={(event) => setNewTaskProject(event.target.value)}
              >
                <option>API gateway</option>
                <option>DevTrack client</option>
                <option>Personal</option>
              </select>
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setNewTaskOpen(false)}
                >
                  Cancel
                </button>
                <button className="dark-button" type="submit">
                  Create task <span>→</span>
                </button>
              </div>
            </form>
          </div>
        )}
        {morningPlanOpen && (
          <div className="modal-backdrop" role="presentation">
            <section
              className="task-modal morning-plan-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="morning-plan-title"
            >
              <div className="popover-heading">
                <div>
                  <p className="eyebrow">Your best window</p>
                  <h2 id="morning-plan-title">Plan my morning</h2>
                </div>
                <button
                  onClick={() => setMorningPlanOpen(false)}
                  aria-label="Close morning plan"
                >
                  ×
                </button>
              </div>
              <p className="morning-plan-intro">
                A calm four-step runway for your highest-impact work before
                lunch.
              </p>
              <div className="morning-plan-progress">
                <span>
                  <strong>
                    {completedMorningBlocks.length} of {morningBlocks.length}
                  </strong>{" "}
                  blocks complete
                </span>
                <i>
                  <b
                    style={{
                      width: `${(completedMorningBlocks.length / morningBlocks.length) * 100}%`,
                    }}
                  />
                </i>
              </div>
              <div className="morning-blocks">
                {morningBlocks.map((block) => {
                  const complete = completedMorningBlocks.includes(block.title);
                  return (
                    <button
                      className={
                        complete ? "morning-block complete" : "morning-block"
                      }
                      key={block.title}
                      onClick={() => toggleMorningBlock(block.title)}
                    >
                      <span className="morning-check">
                        {complete ? "✓" : ""}
                      </span>
                      <span className="morning-block-copy">
                        <small>{block.time}</small>
                        <strong>{block.title}</strong>
                        <em>{block.detail}</em>
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="modal-actions">
                <button
                  className="cancel-button"
                  onClick={() => setMorningPlanOpen(false)}
                >
                  Close
                </button>
                <button
                  className="dark-button"
                  onClick={() => setMorningPlanOpen(false)}
                >
                  Start focus session <span>→</span>
                </button>
              </div>
            </section>
          </div>
        )}

        {activeView === "Settings" ? (
          <Settings />
        ) : activeView === "My tasks" ? (
          <MyTasks />
        ) : activeView === "Learning path" ? (
          <LearningPath />
        ) : activeView === "Insights" ? (
          <Insights />
        ) : (
          <>
            <section className="welcome-row">
              <div>
                <p className="eyebrow">
                  {formattedDate} • {formattedTime}
                </p>
                <h1>
                  {greeting}, Sourav Chatterjee
                  <span className="coral-dot">.</span>
                </h1>
                <p className="subheading">
                  A clear plan makes deep work feel lighter.
                </p>
              </div>
              <div className="focus-meter">
                <div className="meter-ring">
                  <strong>72</strong>
                  <span>%</span>
                </div>
                <div>
                  <strong>Focus score</strong>
                  <small>+8% this week</small>
                </div>
              </div>
            </section>

            <section className="metric-grid" aria-label="Productivity summary">
              <article className="metric-card accent-yellow">
                <div className="metric-top">
                  <span>Focus time</span>
                  <span className="metric-symbol">◷</span>
                </div>
                <strong>6h 24m</strong>
                <small>
                  <b>+18%</b> from last week
                </small>
                <div className="mini-bars">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              </article>
              <article className="metric-card accent-coral">
                <div className="metric-top">
                  <span>Tasks completed</span>
                  <span className="metric-symbol">✓</span>
                </div>
                <strong>{summary.completed}</strong>
                <small>
                  <b>
                    {summary.total
                      ? `${Math.round((summary.completed / summary.total) * 100)}%`
                      : "0%"}
                  </b>{" "}
                  completion rate
                </small>
                <div className="progress-line">
                  <i />
                </div>
              </article>
              <article className="metric-card accent-mint">
                <div className="metric-top">
                  <span>Learning streak</span>
                  <span className="metric-symbol">✦</span>
                </div>
                <strong>{summary.inProgress + summary.todo} tasks</strong>
                <small>
                  <b>{summary.inProgress} active</b>
                </small>
                <div className="streak-dots">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              </article>
            </section>

            <div className="content-grid">
              <section className="panel tasks-panel">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">Work queue</p>
                    <h2>Today’s focus</h2>
                  </div>
                  <select
                    value={taskFilter}
                    onChange={(event) => setTaskFilter(event.target.value)}
                    aria-label="Filter tasks"
                  >
                    <option>All tasks</option>
                    <option>In progress</option>
                    <option>Queued</option>
                  </select>
                </div>
                <div className="task-list">
                  {visibleTasks.map((task) => (
                    <div className="task-row" key={task.id}>
                      <button
                        className="check-box"
                        aria-label={`Complete ${task.title}`}
                        onClick={async () => {
                          try {
                            const nextStatus =
                              task.status === "done" ? "todo" : "done";
                            const updatedTask = await updateTask(task.id, {
                              status: nextStatus,
                            });

                            setTaskItems((items) =>
                              items.map((item) =>
                                item.id === updatedTask.id ? updatedTask : item,
                              ),
                            );
                            setSummary((currentSummary) => ({
                              ...currentSummary,
                              completed:
                                updatedTask.status === "done"
                                  ? currentSummary.completed + 1
                                  : currentSummary.completed - 1,
                              todo:
                                updatedTask.status === "todo"
                                  ? currentSummary.todo + 1
                                  : currentSummary.todo - 1,
                            }));
                          } catch (error) {
                            console.error(error);
                          }
                        }}
                      />
                      <div className="task-copy">
                        <strong>{task.title}</strong>
                        <span>{task.project}</span>
                      </div>
                      <span className={`priority ${task.priority}`}>
                        {task.priority}
                      </span>
                      <span className="task-due">
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "Today"}
                      </span>
                      <div className="task-menu-wrap">
                        <button
                          className="row-more"
                          aria-label={`More options for ${task.title}`}
                          onClick={() =>
                            setTaskMenuId((currentId) =>
                              currentId === task.id ? null : task.id,
                            )
                          }
                        >
                          •••
                        </button>
                        {taskMenuId === task.id && (
                          <div className="task-row-menu">
                            <button
                              type="button"
                              className="task-menu-button"
                              onClick={() => handleEditTask(task)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="task-menu-button danger"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="text-button"
                  onClick={() => setShowAllTasksTable(true)}
                >
                  View all tasks <span>→</span>
                </button>
              </section>

              <section className="panel activity-panel">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">Your trail</p>
                    <h2>Recent activity</h2>
                  </div>
                  <button className="dots-button" aria-label="Activity options">
                    •••
                  </button>
                </div>
                <div className="activity-list">
                  {activity.map((item) => (
                    <div className="activity-row" key={item.text}>
                      <span className={`activity-avatar ${item.color}`}>
                        {item.initials}
                      </span>
                      <div>
                        <strong>{item.text}</strong>
                        <small>{item.time}</small>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="text-button">
                  Open activity log <span>→</span>
                </button>
              </section>
            </div>

            <section className="insight-banner">
              <div className="insight-icon">✧</div>
              <div>
                <p className="eyebrow">A small nudge from DevTrack AI</p>
                <h2>You do your best work before lunch.</h2>
                <p>
                  Your focus score is 24% higher between 9:00 and 12:00. Protect
                  that window for your API refactor today.
                </p>
              </div>
              <button
                className="dark-button"
                onClick={() => {
                  setMorningPlanOpen(true);
                  setSearchOpen(false);
                  setNotificationsOpen(false);
                }}
              >
                Plan my morning <span>→</span>
              </button>
            </section>

            {showAllTasksTable && (
              <section className="panel dashboard-table-panel">
                <div className="panel-heading table-heading">
                  <div>
                    <p className="eyebrow">All tasks</p>
                    <h2>Task overview</h2>
                  </div>
                  <button
                    className="text-button table-button"
                    onClick={() => setShowAllTasksTable(true)}
                  >
                    View all tasks <span>→</span>
                  </button>
                </div>

                <div className="table-wrapper">
                  <table className="task-table">
                    <thead>
                      <tr>
                        <th>Task</th>
                        <th>Project</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Due</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleTasks.length > 0 ? (
                        visibleTasks.map((task) => (
                          <tr key={task.id}>
                            <td>
                              <div className="task-table-title">
                                <span className="task-table-check" />
                                <span>{task.title}</span>
                              </div>
                            </td>
                            <td>{task.project}</td>
                            <td>
                              <span className={`status-badge ${task.status}`}>
                                {task.status === "done" ? "Done" : task.status === "in-progress" ? "In progress" : "Queued"}
                              </span>
                            </td>
                            <td>
                              <span className={`priority ${task.priority}`}>{task.priority}</span>
                            </td>
                            <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Today"}</td>
                            <td>
                              <div className="table-actions">
                                <button type="button" onClick={() => handleEditTask(task)}>Edit</button>
                                <button type="button" className="danger" onClick={() => handleDeleteTask(task.id)}>Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="empty-table">No tasks match the current view.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
