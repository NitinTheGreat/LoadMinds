
import { useState, useEffect } from "react"
import { getTasks, addTask, deleteTask } from "../api"
import type { Task, Toast } from "../types"
import ToastComponent from "../Components/Toast"
import TaskForm from "../Components/TaskForm"
import { X } from "lucide-react"

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [priorityFilter, setPriorityFilter] = useState<string>("all")

  const addToast = (type: "success" | "error", message: string) => {
    const newToast = {
      id: Date.now().toString(),
      type,
      message,
    }
    setToasts((prev) => [...prev, newToast])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksData = await getTasks()
        setTasks(tasksData)
      } catch (error) {
        console.error("Failed to fetch tasks:", error)
        addToast("error", "Failed to fetch tasks")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const handleAddTask = async (title: string, description: string, priority: string) => {
    if (!title.trim()) {
      addToast("error", "Task title cannot be empty")
      return
    }

    try {
      const newTask = await addTask(title, description, priority)
      setTasks([newTask, ...tasks])
      addToast("success", "Task added successfully")
    } catch (error) {
      console.error("Failed to add task:", error)
      addToast("error", error instanceof Error ? error.message : "Failed to add task")
    }
  }

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id)
      setTasks(tasks.filter((task) => task.id !== id))
      addToast("success", "Task deleted successfully")
    } catch (error) {
      console.error("Failed to delete task:", error)
      addToast("error", error instanceof Error ? error.message : "Failed to delete task")
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredTasks = priorityFilter === "all" ? tasks : tasks.filter((task) => task.priority === priorityFilter)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-3xl w-full mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-purple-800">Task Dashboard</h1>

        {/* Toast container */}
        <div className="fixed top-4 right-4 space-y-2 z-50">
          {toasts.map((toast) => (
            <ToastComponent key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
          ))}
        </div>

        <TaskForm onAddTask={handleAddTask} />

        {isLoading ? (
          <div className="text-center py-4 text-gray-500">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No tasks yet. Add your first task above!</div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-700">Your Tasks</h2>
              <div className="flex items-center">
                <label htmlFor="priorityFilter" className="text-sm font-medium text-gray-700 mr-2">
                  Filter by:
                </label>
                <select
                  id="priorityFilter"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
            <ul className="space-y-3">
              {filteredTasks.map((task) => (
                <li
                  key={task.id}
                  className="p-4 bg-white rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-800">{task.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      {task.description && <p className="text-gray-600 text-sm">{task.description}</p>}
                      <p className="text-xs text-gray-400">{new Date(task.created_at).toLocaleString()}</p>
                    </div>
                    <button
                      className="p-1 text-pink-600 hover:bg-pink-50 rounded-full"
                      onClick={() => handleDeleteTask(task.id)}
                      aria-label="Delete task"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

