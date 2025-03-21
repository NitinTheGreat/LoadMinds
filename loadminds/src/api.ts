import type { Task } from "./types"

// Base URL for the API
const API_BASE_URL = "http://127.0.0.1:5000"

// Get all tasks
export const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks`)

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching tasks:", error)
    throw error
  }
}

// Add a new task
export const addTask = async (title: string): Promise<Task> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error adding task:", error)
    throw error
  }
}

// Delete a task
export const deleteTask = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Error: ${response.status} ${response.statusText}`)
    }

    await response.json()
  } catch (error) {
    console.error("Error deleting task:", error)
    throw error
  }
}

