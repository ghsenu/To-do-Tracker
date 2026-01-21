import { useState, useRef, useEffect } from 'react';
import './App.css';

const loadingMessages = [
  'Organizing your day...',
  'Loading your tasks...',
  'Preparing your workspace...',
  'Almost ready...'
];

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
  const [isLoading, setIsLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const [currentView, setCurrentView] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState(tasksData);
  const [newTaskInput, setNewTaskInput] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalTaskInput, setModalTaskInput] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([
    { name: 'Design Work', color: '#2563eb' },
    { name: 'Health & Fitness', color: '#10b981' },
    { name: 'Personal', color: '#8b5cf6' },
  ]);
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const addRowRef = useRef(null);
  const modalInputRef = useRef(null);
  const projectInputRef = useRef(null);

  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        setLoadingProgress(100);
        setLoadingMessage('Almost ready...');
        clearInterval(interval);
        setTimeout(() => {
          setIsLoading(false);
          setShowSkeleton(true);
          setTimeout(() => setShowSkeleton(false), 1200);
        }, 500);
      } else {
        setLoadingProgress(progress);
        const messageIndex = Math.min(
          Math.floor(progress / 30),
          loadingMessages.length - 1
        );
        setLoadingMessage(loadingMessages[messageIndex]);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

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

  const addTaskFromModal = () => {
    if (modalTaskInput.trim()) {
      const newTask = {
        id: Math.max(...tasks.map(t => t.id), 0) + 1,
        title: modalTaskInput,
        note: null,
        status: null,
        project: currentView === 'project' ? selectedProject : null,
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setModalTaskInput('');
      setShowAddModal(false);
    }
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setCurrentView('project');
  };

  const openAddTaskModal = () => {
    setShowAddModal(true);
    setModalTaskInput('');
    setTimeout(() => modalInputRef.current?.focus(), 100);
  };

  const getProjectColor = (projectName) => {
    const project = projects.find(p => p.name === projectName);
    return project ? project.color : '#6b7280';
  };

  const projectColors = [
    '#2563eb', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', 
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
  ];

  const addProject = () => {
    if (newProjectName.trim()) {
      const usedColors = projects.map(p => p.color);
      const availableColors = projectColors.filter(c => !usedColors.includes(c));
      const color = availableColors.length > 0 
        ? availableColors[0] 
        : projectColors[Math.floor(Math.random() * projectColors.length)];
      
      setProjects([...projects, { name: newProjectName.trim(), color }]);
      setNewProjectName('');
      setShowAddProject(false);
    }
  };

  const renderTodayView = () => (
    <>
      <header className="content-header">
        <div>
          <h1>Today</h1>
          <p>{todayTasks.length} tasks remaining</p>
        </div>
        <button className="primary-btn" onClick={openAddTaskModal}>+ Add Task</button>
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
          <button className="primary-btn" onClick={openAddTaskModal}>+ Add Task</button>
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
          <button className="primary-btn" onClick={openAddTaskModal}>+ Add Task</button>
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

  const renderProjectView = () => {
    const projectTasks = tasks.filter(t => t.project === selectedProject && !t.completed);

    return (
      <>
        <header className="content-header">
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="dot" style={{ backgroundColor: getProjectColor(selectedProject), width: '12px', height: '12px' }} />
              {selectedProject}
            </h1>
            <p>{projectTasks.length} tasks in this project</p>
          </div>
          <button className="primary-btn" onClick={openAddTaskModal}>+ Add Task</button>
        </header>

        <div className="task-list">
          {projectTasks.length === 0 ? (
            <div className="text-center py-12">
              <p style={{ color: '#94a3b8', fontSize: '16px' }}>No tasks in this project yet. Add one!</p>
            </div>
          ) : (
            projectTasks.map((task) => (
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
                      </span>
                    )}
                  </div>
                  {task.note && <div className="task-note">{task.note}</div>}
                </div>
              </div>
            ))
          )}

          <div className="task-card add-row">
            <span className="plus">+</span>
            <input
              type="text"
              placeholder="Add a task to this project..."
              value={newTaskInput}
              onChange={(e) => setNewTaskInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newTaskInput.trim()) {
                  const newTask = {
                    id: Math.max(...tasks.map(t => t.id), 0) + 1,
                    title: newTaskInput,
                    note: null,
                    status: null,
                    project: selectedProject,
                    completed: false,
                  };
                  setTasks([...tasks, newTask]);
                  setNewTaskInput('');
                }
              }}
              className="add-input"
            />
          </div>
        </div>
      </>
    );
  };

  const mainContent = (
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
          {projects.map((project) => (
            <button
              key={project.name}
              className={`project-row ${currentView === 'project' && selectedProject === project.name ? 'active' : ''}`}
              onClick={() => handleProjectClick(project.name)}
            >
              <span className="dot" style={{ backgroundColor: project.color }} /> {project.name}
            </button>
          ))}
          
          {showAddProject ? (
            <div className="add-project-input">
              <input
                ref={projectInputRef}
                type="text"
                placeholder="Project name..."
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addProject()}
                onBlur={() => {
                  if (!newProjectName.trim()) {
                    setShowAddProject(false);
                  }
                }}
                className="project-name-input"
              />
              <button className="add-project-confirm" onClick={addProject}>✓</button>
            </div>
          ) : (
            <button 
              className="add-project-btn"
              onClick={() => {
                setShowAddProject(true);
                setTimeout(() => projectInputRef.current?.focus(), 100);
              }}
            >
              <span className="plus-icon">+</span> Add Project
            </button>
          )}
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
        {currentView === 'project' && selectedProject && renderProjectView()}
      </main>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Task</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <input
                ref={modalInputRef}
                type="text"
                placeholder="What do you need to do?"
                value={modalTaskInput}
                onChange={(e) => setModalTaskInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTaskFromModal()}
                className="modal-input"
              />
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="primary-btn" onClick={addTaskFromModal}>
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          {/* Spinner */}
          <div className="loading-spinner">
            <svg viewBox="0 0 50 50" className="spinner-svg">
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="3"
              />
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
                strokeLinecap="round"
                className="spinner-circle"
              />
            </svg>
          </div>

          {/* Icon and Title */}
          <div className="loading-icon">
            <svg viewBox="0 0 24 24" fill="none" className="check-icon">
              <circle cx="12" cy="12" r="10" fill="#2563eb" />
              <path
                d="M8 12l2.5 2.5L16 9"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="loading-title">Focus</h1>

          {/* Progress Bar */}
          <div className="loading-progress-container">
            <div className="loading-progress-header">
              <span className="loading-message">{loadingMessage}</span>
              <span className="loading-percent">{Math.round(loadingProgress)}%</span>
            </div>
            <div className="loading-progress-bar">
              <div
                className="loading-progress-fill"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <p className="loading-status">PREPARING YOUR WORKSPACE</p>
          </div>
        </div>

        {/* Footer */}
        <div className="loading-footer">
          <span>PERSONAL TASK MANAGEMENT</span>
          <span className="loading-dot">•</span>
          <span>V2.4.0</span>
        </div>
      </div>
    );
  }

  if (showSkeleton) {
    return (
      <div className="app-shell">
        {/* Skeleton Sidebar */}
        <aside className="sidebar skeleton-sidebar">
          <div className="skeleton-brand">
            <div className="skeleton-box skeleton-icon"></div>
            <div className="skeleton-text-group">
              <div className="skeleton-box skeleton-text-lg"></div>
              <div className="skeleton-box skeleton-text-sm"></div>
            </div>
          </div>

          <nav className="skeleton-nav">
            <div className="skeleton-box skeleton-nav-item active"></div>
            <div className="skeleton-box skeleton-nav-item"></div>
            <div className="skeleton-box skeleton-nav-item"></div>
            <div className="skeleton-box skeleton-nav-item"></div>
          </nav>

          <div className="skeleton-projects">
            <div className="skeleton-box skeleton-label"></div>
            <div className="skeleton-project-item">
              <div className="skeleton-box skeleton-dot"></div>
              <div className="skeleton-box skeleton-text-md"></div>
            </div>
            <div className="skeleton-project-item">
              <div className="skeleton-box skeleton-dot"></div>
              <div className="skeleton-box skeleton-text-md"></div>
            </div>
          </div>

          <div className="skeleton-profile">
            <div className="skeleton-box skeleton-avatar"></div>
            <div className="skeleton-text-group">
              <div className="skeleton-box skeleton-text-md"></div>
              <div className="skeleton-box skeleton-text-sm"></div>
            </div>
          </div>
        </aside>

        {/* Skeleton Content */}
        <main className="content skeleton-content">
          <div className="skeleton-header">
            <div className="skeleton-box skeleton-title"></div>
            <div className="skeleton-box skeleton-subtitle"></div>
          </div>

          <div className="skeleton-tabs">
            <div className="skeleton-box skeleton-tab active"></div>
            <div className="skeleton-box skeleton-tab"></div>
            <div className="skeleton-box skeleton-tab"></div>
          </div>

          <div className="skeleton-task-list">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton-task-card">
                <div className="skeleton-box skeleton-checkbox"></div>
                <div className="skeleton-task-content">
                  <div className="skeleton-box skeleton-task-title"></div>
                  <div className="skeleton-box skeleton-task-note"></div>
                </div>
                <div className="skeleton-box skeleton-task-action"></div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return mainContent;
}
