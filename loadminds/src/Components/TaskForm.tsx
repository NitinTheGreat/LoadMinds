 
import { useState } from "react"
import type { FormEvent } from "react"

interface TaskFormProps {
  onAddTask: (title: string, description: string, priority: string) => Promise<void>
}

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    await onAddTask(newTaskTitle, newTaskDescription, newTaskPriority)
    setNewTaskTitle("")
    setNewTaskDescription("")
    setNewTaskPriority("medium")
  }

  const priorityOptions = [
    { value: "low", label: "Low", color: "bg-green-100 border-green-300 text-green-800" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 border-yellow-300 text-yellow-800" },
    { value: "high", label: "High", color: "bg-red-100 border-red-300 text-red-800" },
  ]

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Task Title
        </label>
        <input
          id="title"
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Enter task title..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          placeholder="Enter task description..."
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
        <div className="flex space-x-2">
          {priorityOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setNewTaskPriority(option.value as "low" | "medium" | "high")}
              className={`flex-1 px-4 py-2 rounded-md border transition-all ${
                newTaskPriority === option.value
                  ? `${option.color} border-2`
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-md hover:opacity-90 transition-opacity"
      >
        Add Task
      </button>
    </form>
  )
}

