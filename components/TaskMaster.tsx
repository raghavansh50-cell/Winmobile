
import React, { useState, useEffect } from 'react';
import { Task } from '../types';

const TaskMaster: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('win_tasks');
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('win_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      text: input,
      completed: false
    };
    setTasks([...tasks, newTask]);
    setInput('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="h-full flex flex-col p-6 bg-zinc-900 text-white">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <i className="fa-solid fa-list-check text-emerald-400"></i>
        Task Manager
      </h2>
      
      <div className="flex gap-2 mb-6">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="What needs to be done?"
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-emerald-500 transition"
        />
        <button 
          onClick={addTask}
          className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg transition"
        >
          Add
        </button>
      </div>

      <div className="flex-1 overflow-auto flex flex-col gap-2">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center opacity-30 mt-10">
            <i className="fa-solid fa-clipboard-list text-5xl mb-2"></i>
            <p>No tasks yet</p>
          </div>
        ) : (
          tasks.map(task => (
            <div 
              key={task.id} 
              className={`flex items-center gap-3 p-3 rounded-lg border border-white/5 transition-all ${
                task.completed ? 'bg-white/5 opacity-50' : 'bg-white/10'
              }`}
            >
              <button 
                onClick={() => toggleTask(task.id)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                  task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-white/30'
                }`}
              >
                {task.completed && <i className="fa-solid fa-check text-[10px] text-white"></i>}
              </button>
              <span className={`flex-1 text-sm ${task.completed ? 'line-through' : ''}`}>
                {task.text}
              </span>
              <button 
                onClick={() => removeTask(task.id)}
                className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition"
              >
                <i className="fa-solid fa-trash-can text-sm"></i>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskMaster;
