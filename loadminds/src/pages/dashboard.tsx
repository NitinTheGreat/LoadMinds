"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { getTasks, addTask, deleteTask } from "../api"
import type { Task, Toast } from "../types"
import ToastComponent from "../Components/toast"

function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [toasts, setToasts] = useState<Toast[]>([])

  // Add a toast notification
  const addToast = (type: "success" | "error", message: string) => {
    const newToast = {
      id: Date.now().toString(),
      type,
      message,
    }
    setToasts((prev) => [...prev, newToast])
  }

  // Remove a toast notification
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

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) {
      addToast("error", "Task title cannot be empty")
      return
    }

    try {
      const newTask = await addTask(newTaskTitle)
      setTasks([newTask, ...tasks])
      setNewTaskTitle("")
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

  return (
    <div className="max-w-2xl mx-auto p-6 my-8 bg-white/90 rounded-lg shadow-md relative">
      <h1 className="text-2xl font-bold mb-6 text-center text-purple-800">Task Dashboard</h1>

      {/* Toast container */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <ToastComponent key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>

      <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Enter a new task..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-md hover:opacity-90 transition-opacity"
        >
          Add Task
        </button>
      </form>

      {isLoading ? (
        <div className="text-center py-4 text-gray-500">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No tasks yet. Add your first task above!</div>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200 shadow-sm"
            >
              <span className="text-gray-800">{task.title}</span>
              <button
                className="p-1 text-pink-600 hover:bg-pink-50 rounded-full"
                onClick={() => handleDeleteTask(task.id)}
                aria-label="Delete task"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Dashboard

