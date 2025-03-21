import type { Task } from "./types"

const API_URL = "http://localhost:5000/api/tasks"

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(API_URL)
  if (!response.ok) {
    throw new Error("Failed to fetch tasks")
  }
  return response.json()
}

// for adding a a new task
export async function addTask(title: string): Promise<Task> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  })

  if (!response.ok) {
    throw new Error("Failed to add task")
  }

  return response.json()
}

export async function deleteTask(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete task")
  }
}

