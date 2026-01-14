import './App.css';

const tasks = [
  {
    id: 1,
    title: 'Review project proposal',
    note: 'Due at 5:00 PM',
    status: 'high',
    completed: false,
  },
  {
    id: 2,
    title: 'Buy groceries',
    note: 'Milk, Eggs, Bread, and Coffee beans',
    status: 'medium',
    completed: false,
  },
  {
    id: 3,
    title: 'Call the bank',
    note: 'Discuss mortgage rates for the new apartment',
    status: null,
    completed: false,
  },
  {
    id: 4,
    title: 'Check emails',
    note: 'Done this morning',
    status: null,
    completed: true,
  },
  {
    id: 5,
    title: 'Prepare presentation slides',
    note: null,
    status: 'upcoming',
    completed: false,
  },
];

export default function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">✓</div>
          <div>
            <div className="brand-title">TaskDash</div>
            <div className="brand-sub">Personal Workspace</div>
          </div>
        </div>

        <nav className="nav">
          <button className="nav-item">
            <span className="nav-dot neutral" /> Inbox
          </button>
          <button className="nav-item active">
            <span className="nav-dot blue" /> Today
          </button>
          <button className="nav-item">
            <span className="nav-dot" /> Upcoming
          </button>
          <button className="nav-item">
            <span className="nav-dot" /> Completed
          </button>
        </nav>

        <div className="projects">
          <div className="section-label">Projects</div>
          <div className="project-row">
            <span className="dot blue" /> Design Work
          </div>
          <div className="project-row">
            <span className="dot green" /> Health & Fitness
          </div>
        </div>

        <div className="profile">
          <div className="avatar">A</div>
          <div>
            <div className="profile-name">Alex Rivera</div>
            <div className="profile-plan">Free Plan</div>
          </div>
        </div>
      </aside>

      <main className="content">
        <header className="content-header">
          <div>
            <h1>Today</h1>
            <p>5 tasks remaining</p>
          </div>
          <button className="primary-btn">+ Add Task</button>
        </header>

        <div className="task-list">
          {tasks.map((task) => (
            <div key={task.id} className={`task-card ${task.completed ? 'done' : ''}`}>
              <label className="checkbox">
                <input type="checkbox" defaultChecked={task.completed} />
                <span className="checkmark" />
              </label>

              <div className="task-body">
                <div className="task-title-row">
                  <span className={`task-title ${task.completed ? 'completed' : ''}`}>
                    {task.title}
                  </span>
                  {task.status && (
                    <span className={`badge ${task.status}`}>
                      {task.status === 'high' && 'HIGH'}
                      {task.status === 'medium' && 'MEDIUM'}
                      {task.status === 'upcoming' && 'UPCOMING'}
                    </span>
                  )}
                </div>
                {task.note && <div className="task-note">{task.note}</div>}
              </div>
            </div>
          ))}

          <div className="task-card add-row">
            <span className="plus">+</span>
            <span className="placeholder">Add a new task...</span>
          </div>
        </div>
      </main>
    </div>
  );
}
