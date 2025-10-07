import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

type FilterStatus = 'all' | 'open' | 'completed';

function TasksPage() {
  const [filter, setFilter] = useState<FilterStatus>('all');

  const { data: tasks, isLoading, error } = useTasks(
    filter === 'all' ? undefined : filter
  );

  const filterOptions: { value: FilterStatus; label: string }[] = [
    { value: 'all', label: 'All Tasks' },
    { value: 'open', label: 'Open' },
    { value: 'completed', label: 'Completed' },
  ];

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading tasks
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>
                {error instanceof Error
                  ? error.message
                  : 'An error occurred while loading tasks. Please try again.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const taskCount = tasks?.length || 0;
  const openCount = tasks?.filter((t) => t.status === 'open').length || 0;
  const completedCount = tasks?.filter((t) => t.status === 'completed').length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Tasks</h2>
          <p className="mt-1 text-sm text-gray-600">
            {taskCount} total tasks - {openCount} open, {completedCount} completed
          </p>
        </div>
      </div>

      <TaskForm />

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Filter:</label>
          <div className="flex space-x-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <TaskList tasks={tasks || []} isLoading={isLoading} />
    </div>
  );
}

export default TasksPage;
