import { useState, useEffect } from 'react';
import './App.css';

// Schedule color palette matching the reference
const categoryColors = {
  personal: '#3ECDC6',    // Teal
  shopping: '#F5C842',    // Yellow/Gold
  work: '#9B6DD1',        // Purple
  event: '#FF8C42',       // Orange
  birthday: '#FF6B9D',    // Pink
  general: '#6B9DFF',     // Blue
};

function App() {
  const [todos, setTodos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTodo, setNewTodo] = useState({
    text: '',
    category: 'personal',
    time: '09:00',
    dueDate: new Date().toISOString().split('T')[0]
  });

  // Load todos from localStorage on mount (with sample data)
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos && JSON.parse(savedTodos).length > 0) {
      setTodos(JSON.parse(savedTodos));
    } else {
      // Add sample todos matching the reference image
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      setTodos([
        { id: 1, text: 'Breakfast with my family', completed: true, category: 'personal', time: '08:00', dueDate: today },
        { id: 2, text: 'Buy apple, Strawber and banana', completed: true, category: 'shopping', time: '09:00', dueDate: today },
        { id: 3, text: 'Finalise Website for a client', completed: false, category: 'work', time: '17:00', dueDate: today },
        { id: 4, text: 'Live Archive in Tbilisi (full Concert)', completed: false, category: 'event', time: '23:00', dueDate: today },
        { id: 5, text: "Murtazi's Birthday", completed: false, category: 'birthday', time: '19:00', dueDate: tomorrow },
      ]);
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.text.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: newTodo.text,
        completed: false,
        category: newTodo.category,
        time: newTodo.time,
        dueDate: newTodo.dueDate
      }]);
      setNewTodo({
        text: '',
        category: 'personal',
        time: '09:00',
        dueDate: new Date().toISOString().split('T')[0]
      });
      setShowAddModal(false);
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Get week days for calendar strip
  const getWeekDays = () => {
    const days = [];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Group todos by date
  const groupTodosByDate = () => {
    const grouped = {};
    todos.forEach(todo => {
      const date = todo.dueDate || new Date().toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(todo);
    });

    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => (a.time || '00:00').localeCompare(b.time || '00:00'));
    });

    return grouped;
  };

  const groupedTodos = groupTodosByDate();
  const sortedDates = Object.keys(groupedTodos).sort();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return { dayName, fullDate: `${day} ${month} ${year}` };
  };

  const isSameDay = (date1, date2) => {
    return date1.toISOString().split('T')[0] === date2.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between">
        <button className="text-gray-300 text-2xl font-light">‹</button>
        <h1 className="text-xl font-medium text-gray-400 tracking-wide">Schedule</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="text-gray-300 text-2xl font-light hover:text-blue-500 transition-colors"
        >
          +
        </button>
      </div>

      {/* Week Calendar Strip */}
      <div className="px-4 py-3 flex items-center border-b border-gray-100">
        <div className="text-gray-800 font-medium text-sm w-10">
          {monthNames[selectedDate.getMonth()]}
        </div>
        <div className="flex items-center gap-0 flex-1 justify-center">
          {weekDays.map((day, index) => {
            const isSelected = isSameDay(day, selectedDate);
            return (
              <button
                key={index}
                onClick={() => setSelectedDate(day)}
                className={`flex flex-col items-center px-3 py-2 rounded-xl min-w-[48px] transition-all ${
                  isSelected
                    ? 'bg-[#4A6CF7] text-white'
                    : 'text-gray-400'
                }`}
              >
                <span className="text-[11px] font-medium">{dayNames[day.getDay()]}</span>
                <span className={`text-base font-semibold ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                  {day.getDate()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Todo List - Timeline View */}
      <div className="px-5 py-6">
        {sortedDates.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No tasks scheduled</p>
            <p className="text-gray-300 text-sm mt-2">Tap + to add a new task</p>
          </div>
        ) : (
          sortedDates.map(date => {
            const { dayName, fullDate } = formatDate(date);
            return (
              <div key={date} className="mb-8">
                {/* Day Header */}
                <div className="flex items-baseline gap-3 mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">{dayName}</h2>
                  <span className="text-gray-400 text-sm">{fullDate}</span>
                </div>

                {/* Timeline */}
                <div className="relative">
                  {/* Vertical Line */}
                  <div className="absolute left-[10px] top-3 bottom-3 w-[2px] bg-gray-100"></div>

                  {groupedTodos[date].map((todo) => (
                    <div key={todo.id} className="flex items-start mb-4 relative">
                      {/* Checkbox Circle */}
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center z-10 flex-shrink-0 mt-5 transition-all ${
                          todo.completed
                            ? 'border-[#4A6CF7] bg-[#4A6CF7]'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {todo.completed && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>

                      {/* Time */}
                      <div className="text-gray-400 text-sm w-14 text-center mt-5 ml-3">
                        {todo.time || '00:00'}
                      </div>

                      {/* Task Card */}
                      <div
                        onClick={() => deleteTodo(todo.id)}
                        className={`flex-1 ml-4 p-4 rounded-xl cursor-pointer transition-all hover:opacity-90 max-w-[280px] ${
                          todo.completed ? 'opacity-90' : ''
                        }`}
                        style={{ backgroundColor: categoryColors[todo.category] || categoryColors.general }}
                      >
                        <h3 className={`text-white font-medium text-[15px] leading-snug ${todo.completed ? 'line-through' : ''}`}>
                          {todo.text}
                        </h3>
                        <p className="text-white/70 text-[13px] mt-1 capitalize">
                          {todo.category === 'work' ? 'To do' : todo.category}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">New Task</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <input
              type="text"
              value={newTodo.text}
              onChange={(e) => setNewTodo({ ...newTodo, text: e.target.value })}
              placeholder="Task name..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 text-sm"
              autoFocus
            />

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Date</label>
                <input
                  type="date"
                  value={newTodo.dueDate}
                  onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Time</label>
                <input
                  type="time"
                  value={newTodo.time}
                  onChange={(e) => setNewTodo({ ...newTodo, time: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="text-xs text-gray-500 mb-2 block">Category</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(categoryColors).map(([key, color]) => (
                  <button
                    key={key}
                    onClick={() => setNewTodo({ ...newTodo, category: key })}
                    className={`px-2 py-2 rounded-lg text-xs font-medium capitalize transition-all text-white ${
                      newTodo.category === key ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={addTodo}
              className="w-full py-3 rounded-xl bg-[#4A6CF7] text-white font-medium hover:bg-blue-600 transition-colors text-sm"
            >
              Add Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;