export interface Task {
  id: number
  title: string
  description: string
  priority: string
  created_at: string
}

export interface Toast {
  id: string
  type: "success" | "error"
  message: string
}

