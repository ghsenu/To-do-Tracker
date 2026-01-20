import { useState, useRef } from 'react';
import './App.css';

const tasksData = [
  {
    id: 1,
    title: 'Review project proposal',
    note: 'Due tomorrow',
    status: 'high',
    project: 'Design Work',
    completed: false,
  },
  {
    id: 2,
    title: 'Research competitor features',
    note: null,
    status: null,
    project: 'Design Work',
    completed: false,
  },
  {
    id: 3,
    title: 'Book anniversary dinner',
    note: null,
    status: null,
    project: 'Personal',
    completed: false,
  },
  {
    id: 4,
    title: 'Buy new yoga mat',
    note: null,
    status: null,
    project: 'Health & Fitness',
    completed: false,
  },
  {
    id: 5,
    title: 'Design system update',
    note: 'Due at 5:00 PM',
    status: 'high',
    project: 'Design Work',
    completed: false,
  },
  {
    id: 6,
    title: 'Client strategy meeting',
    note: '1:30 PM',
    status: 'medium',
    project: null,
    completed: false,
  },
  {
    id: 7,
    title: 'Weekly grocery run',
    note: '6:00 PM',
    status: 'low',
    project: null,
    completed: false,
  },
];

export default function App() {
  const [currentView, setCurrentView] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState(tasksData);
  const [newTaskInput, setNewTaskInput] = useState('');
  const addRowRef = useRef(null);

  const inboxTasks = tasks.filter(t => !t.completed);
  const todayTasks = tasks.filter(t => !t.completed).slice(0, 5);

  const addTask = () => {
    if (newTaskInput.trim()) {
      const newTask = {
        id: Math.max(...tasks.map(t => t.id), 0) + 1,
        title: newTaskInput,
        note: null,
        status: null,
        project: null,
        completed: false,
      };
      console.log('Adding task:', newTask);
      setTasks([...tasks, newTask]);
      setNewTaskInput('');
    }
  };

  const getProjectColor = (project) => {
    if (project === 'Design Work') return '#2563eb';
    if (project === 'Health & Fitness') return '#10b981';
    if (project === 'Personal') return '#8b5cf6';
    return '#6b7280';
  };

  const renderTodayView = () => (
    <>
      <header className="content-header">
        <div>
          <h1>Today</h1>
          <p>{todayTasks.length} tasks remaining</p>
        </div>
        <button className="primary-btn" onClick={addTask}>+ Add Task</button>
      </header>

      <div className="task-list">
        {todayTasks.map((task) => (
          <div key={task.id} className={`task-card ${task.completed ? 'done' : ''}`}>
            <label className="checkbox">
              <input
                type="checkbox"
                defaultChecked={task.completed}
                onChange={() => {
                  setTasks(
                    tasks.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t))
                  );
                }}
              />
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
                    {task.status === 'low' && 'LOW'}
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
          <input
            ref={addRowRef}
            type="text"
            placeholder="Add a new task..."
            value={newTaskInput}
            onChange={(e) => setNewTaskInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            className="add-input"
          />
        </div>
      </div>
    </>
  );

  const renderInboxView = () => {
    const filtered = searchQuery
      ? inboxTasks.filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
      : inboxTasks;

    return (
      <>
        <header className="content-header">
          <div>
            <h1>Inbox</h1>
            <p>All pending items</p>
          </div>
          <button className="primary-btn" onClick={addTask}>+ Add Task</button>
        </header>

        <div className="search-wrapper">
          <svg className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="task-list">
          {filtered.map((task) => (
            <div key={task.id} className={`task-card ${task.completed ? 'done' : ''}`}>
              <label className="checkbox">
                <input
                  type="checkbox"
                  defaultChecked={task.completed}
                  onChange={() => {
                    setTasks(
                      tasks.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t))
                    );
                  }}
                />
                <span className="checkmark" />
              </label>

              <div className="task-body">
                <div className="task-title-row">
                  <span className={`task-title ${task.completed ? 'completed' : ''}`}>
                    {task.title}
                  </span>
                  {task.project && (
                    <span className="project-badge" style={{ backgroundColor: getProjectColor(task.project) }}>
                      {task.project}
                    </span>
                  )}
                </div>
                {task.note && <div className="task-note">{task.note}</div>}
              </div>
            </div>
          ))}

          <div className="task-card add-row">
            <span className="plus">+</span>
            <input
              type="text"
              placeholder="Type to add a new task..."
              value={newTaskInput}
              onChange={(e) => setNewTaskInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              className="add-input"
            />
          </div>
        </div>
      </>
    );
  };

  const renderUpcomingView = () => {
    const upcomingTasks = tasks.filter(t => !t.completed);

    return (
      <>
        <header className="content-header">
          <div>
            <h1>Upcoming</h1>
            <p>{upcomingTasks.length} tasks scheduled</p>
          </div>
          <button className="primary-btn" onClick={addTask}>+ Add Task</button>
        </header>

        <div className="task-list">
          {upcomingTasks.map((task) => (
            <div key={task.id} className={`task-card ${task.completed ? 'done' : ''}`}>
              <label className="checkbox">
                <input
                  type="checkbox"
                  defaultChecked={task.completed}
                  onChange={() => {
                    setTasks(
                      tasks.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t))
                    );
                  }}
                />
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
                      {task.status === 'low' && 'LOW'}
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
            <input
              type="text"
              placeholder="Add a new task..."
              value={newTaskInput}
              onChange={(e) => setNewTaskInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              className="add-input"
            />
          </div>
        </div>
      </>
    );
  };

  const renderCompletedView = () => {
    const completedTasks = tasks.filter(t => t.completed);

    return (
      <>
        <header className="content-header">
          <div>
            <h1>Completed</h1>
            <p>{completedTasks.length} tasks finished</p>
          </div>
        </header>

        <div className="task-list">
          {completedTasks.length === 0 ? (
            <div className="text-center py-12">
              <p style={{ color: '#94a3b8', fontSize: '16px' }}>No completed tasks yet. Keep working!</p>
            </div>
          ) : (
            completedTasks.map((task) => (
              <div key={task.id} className={`task-card done`}>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => {
                      setTasks(
                        tasks.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t))
                      );
                    }}
                  />
                  <span className="checkmark" />
                </label>

                <div className="task-body">
                  <div className="task-title-row">
                    <span className={`task-title completed`}>
                      {task.title}
                    </span>
                    {task.project && (
                      <span className="project-badge" style={{ backgroundColor: getProjectColor(task.project) }}>
                        {task.project}
                      </span>
                    )}
                  </div>
                  {task.note && <div className="task-note">{task.note}</div>}
                </div>
              </div>
            ))
          )}
        </div>
      </>
    );
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">✓</div>
          <div>
            <div className="brand-title">ToDoMe</div>
            <div className="brand-sub">Personal Workspace</div>
          </div>
        </div>

        <nav className="nav">
          <button
            className={`nav-item ${currentView === 'inbox' ? 'active' : ''}`}
            onClick={() => setCurrentView('inbox')}
          >
            <span className="nav-dot neutral" /> Inbox
          </button>
          <button
            className={`nav-item ${currentView === 'today' ? 'active' : ''}`}
            onClick={() => setCurrentView('today')}
          >
            <span className="nav-dot blue" /> Today
          </button>
          <button
            className={`nav-item ${currentView === 'upcoming' ? 'active' : ''}`}
            onClick={() => setCurrentView('upcoming')}
          >
            <span className="nav-dot" /> Upcoming
          </button>
          <button
            className={`nav-item ${currentView === 'completed' ? 'active' : ''}`}
            onClick={() => setCurrentView('completed')}
          >
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
          <div className="avatar">G</div>
          <div>
            <div className="profile-name">Gihansa</div>
            <div className="profile-plan">Free Plan</div>
          </div>
        </div>
      </aside>

      <main className="content">
        {currentView === 'today' && renderTodayView()}
        {currentView === 'inbox' && renderInboxView()}
        {currentView === 'upcoming' && renderUpcomingView()}
        {currentView === 'completed' && renderCompletedView()}
        {currentView === 'upcoming' && renderUpcomingView()}
      </main>
    </div>
  );
}
