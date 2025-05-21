import React, { useState, useEffect } from 'react';
import { auth } from '../lib/types/config';
import { createTask, getUserTasks, updateTask, deleteTask } from '../lib/firebase/tasks';
import type { Task } from '../lib/types';

export default function Planner() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
  });

  // Load tasks when component mounts
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    if (!auth.currentUser) {
      setError('Please sign in to view your tasks');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Loading tasks for user:', auth.currentUser.uid);
      const userTasks = await getUserTasks(auth.currentUser.uid);
      console.log('Loaded tasks:', userTasks);
      setTasks(userTasks);
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError('Failed to load tasks. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!auth.currentUser) {
      setError('Please sign in to add tasks');
      return;
    }

    if (!newTask.title.trim()) {
      setError('Please enter a task title');
      return;
    }

    if (!newTask.dueDate) {
      setError('Please select a due date');
      return;
    }

    try {
      setLoading(true);
      console.log('Adding new task:', {
        title: newTask.title,
        description: newTask.description,
        dueDate: newTask.dueDate,
        priority: newTask.priority
      });

      const taskData = {
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        dueDate: new Date(newTask.dueDate),
        priority: newTask.priority,
      };

      await createTask(auth.currentUser.uid, taskData);
      setNewTask({ title: '', description: '', dueDate: '', priority: 'medium' });
      setError(''); // Clear any previous errors
      
      // Immediately reload tasks after adding
      const updatedTasks = await getUserTasks(auth.currentUser.uid);
      setTasks(updatedTasks);
    } catch (err) {
      console.error('Error adding task:', err);
      setError(err instanceof Error ? err.message : 'Failed to add task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (taskId: string, completed: boolean) => {
    try {
      setLoading(true);
      await updateTask(taskId, { completed });
      // Immediately reload tasks after updating
      if (auth.currentUser) {
        const updatedTasks = await getUserTasks(auth.currentUser.uid);
        setTasks(updatedTasks);
      }
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      setLoading(true);
      await deleteTask(taskId);
      // Immediately reload tasks after deleting
      if (auth.currentUser) {
        const updatedTasks = await getUserTasks(auth.currentUser.uid);
        setTasks(updatedTasks);
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
    }
  };
  // Throw In loading 
  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
  //       <div className="text-xl text-gray-600">Loading tasks...</div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Study Planner</h1>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Add New Task Form */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-4">Add New Task</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Task title"
                className="col-span-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
                className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="Task description (optional)"
              className="mt-4 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <button
              onClick={addTask}
              disabled={loading}
              className={`mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {loading ? 'Adding Task...' : 'Add Task'}
            </button>
          </div>

          {/* Task List */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Your Tasks</h2>
            {tasks.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No tasks yet. Add your first task above!
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id, !task.completed)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      disabled={loading}
                    />
                    <div>
                      <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Due: {task.dueDate.toLocaleDateString()}
                      </p>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(task.priority)}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                    </span>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      disabled={loading}
                      className={`p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      title="Delete task"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Progress Summary */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Progress Summary</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {tasks.filter(t => t.completed).length}/{tasks.length}
                </p>
                <p className="text-sm text-gray-600">Completed Tasks</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {tasks.filter(t => !t.completed && t.priority === 'high').length}
                </p>
                <p className="text-sm text-gray-600">High Priority Pending</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%
                </p>
                <p className="text-sm text-gray-600">Overall Progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}