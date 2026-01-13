import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: input,
        completed: false,
        priority: 'medium',
        category: 'general',
        dueDate: ''
      }]);
      setInput('');
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

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = (id) => {
    if (editText.trim()) {
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, text: editText } : todo
      ));
      setEditingId(null);
      setEditText('');
    }
  };

  const updatePriority = (id, priority) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, priority } : todo
    ));
  };

  const updateCategory = (id, category) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, category } : todo
    ));
  };

  const updateDueDate = (id, dueDate) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, dueDate } : todo
    ));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const getFilteredTodos = () => {
    let filtered = todos;

    // Filter by status
    switch (filter) {
      case 'active':
        filtered = filtered.filter(todo => !todo.completed);
        break;
      case 'completed':
        filtered = filtered.filter(todo => todo.completed);
        break;
      default:
        break;
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(todo =>
        todo.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredTodos = getFilteredTodos();
  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      work: 'bg-blue-500/20 text-blue-400',
      personal: 'bg-purple-500/20 text-purple-400',
      shopping: 'bg-pink-500/20 text-pink-400',
      health: 'bg-green-500/20 text-green-400',
      general: 'bg-gray-500/20 text-gray-400'
    };
    return colors[category] || colors.general;
  };

  return (
    <div className={darkMode ? 'min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black' : 'min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50'}>
      <div className="max-w-4xl mx-auto p-8">
        {/* Header with Dark Mode Toggle */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-5xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              📝 Todo Tracker
            </h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Stay organized and productive</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-4 py-2 rounded-lg font-semibold transition duration-200 ${
              darkMode
                ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                : 'bg-gray-800/20 text-gray-800 hover:bg-gray-800/30'
            }`}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        {/* Input Section */}
        <div className={`rounded-lg p-6 mb-8 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="Add a new todo..."
              className={`flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode
                  ? 'bg-gray-700 text-white placeholder-gray-400'
                  : 'bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-200'
              }`}
            />
            <button
              onClick={addTodo}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
            >
              Add
            </button>
          </div>

          {/* Search */}
          <div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search todos..."
              className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode
                  ? 'bg-gray-700 text-white placeholder-gray-400'
                  : 'bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-200'
              }`}
            />
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex gap-2 mb-6 justify-center flex-wrap">
          {['all', 'active', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-semibold transition duration-200 ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
            <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total</p>
            <p className="text-2xl font-bold text-blue-400">{todos.length}</p>
          </div>
          <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
            <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active</p>
            <p className="text-2xl font-bold text-yellow-400">{activeCount}</p>
          </div>
          <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
            <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Completed</p>
            <p className="text-2xl font-bold text-green-400">{completedCount}</p>
          </div>
          {completedCount > 0 && (
            <div>
              <button
                onClick={clearCompleted}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200 text-sm"
              >
                Clear Completed
              </button>
            </div>
          )}
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12">
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {todos.length === 0 ? 'No todos yet. Add one to get started!' : 'No todos found.'}
              </p>
            </div>
          ) : (
            filteredTodos.map(todo => (
              <div
                key={todo.id}
                className={`p-4 rounded-lg transition duration-200 ${
                  darkMode
                    ? 'bg-gray-800 hover:bg-gray-700'
                    : 'bg-white hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="w-5 h-5 mt-1 cursor-pointer accent-blue-500"
                  />

                  <div className="flex-1">
                    {editingId === todo.id ? (
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className={`flex-1 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            darkMode
                              ? 'bg-gray-700 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        />
                        <button
                          onClick={() => saveEdit(todo.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition duration-200 text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className={`px-3 py-2 rounded-lg transition duration-200 text-sm ${
                            darkMode
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`text-lg block mb-3 ${
                          todo.completed
                            ? `line-through ${darkMode ? 'text-gray-500' : 'text-gray-400'}`
                            : darkMode ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {todo.text}
                      </span>
                    )}

                    {/* Tags and Date */}
                    <div className="flex gap-2 flex-wrap mb-3">
                      <select
                        value={todo.priority}
                        onChange={(e) => updatePriority(todo.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-sm border ${getPriorityColor(todo.priority)} focus:outline-none`}
                      >
                        <option value="low">🟢 Low</option>
                        <option value="medium">🟡 Medium</option>
                        <option value="high">🔴 High</option>
                      </select>

                      <select
                        value={todo.category}
                        onChange={(e) => updateCategory(todo.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-sm border border-gray-500/50 ${getCategoryColor(todo.category)} focus:outline-none`}
                      >
                        <option value="general">📌 General</option>
                        <option value="work">💼 Work</option>
                        <option value="personal">👤 Personal</option>
                        <option value="shopping">🛒 Shopping</option>
                        <option value="health">❤️ Health</option>
                      </select>

                      <input
                        type="date"
                        value={todo.dueDate}
                        onChange={(e) => updateDueDate(todo.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-sm border border-gray-500/50 ${
                          darkMode
                            ? 'bg-gray-700 text-white'
                            : 'bg-white text-gray-900'
                        } focus:outline-none`}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {editingId !== todo.id && (
                      <button
                        onClick={() => startEdit(todo.id, todo.text)}
                        className={`px-3 py-2 rounded-lg transition duration-200 text-sm ${
                          darkMode
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-blue-100 hover:bg-blue-200 text-blue-900'
                        }`}
                      >
                        ✏️ Edit
                      </button>
                    )}
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className={`px-3 py-2 rounded-lg transition duration-200 text-sm ${
                        darkMode
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-red-100 hover:bg-red-200 text-red-900'
                      }`}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>

                {/* Due Date Warning */}
                {todo.dueDate && (
                  <div className={`mt-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    📅 Due: {new Date(todo.dueDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;