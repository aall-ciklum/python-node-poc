import axios from "axios";
import config from "../config";

// Configure the API URL to point to your Python API service
const API_URL = config.api.baseUrl;

// Configure axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: config.api.timeout,
  withCredentials: config.api.withCredentials,
});

// Add request/response interceptors for debugging
api.interceptors.request.use((request) => {
  console.log("API Request:", request);
  return request;
});

api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response);
    return response;
  },
  (error) => {
    console.error("API Error:", error.response || error);
    return Promise.reject(error);
  }
);

export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
}

export interface CreateTodoPayload {
  title: string;
  description: string;
}

export const todoService = {
  async getAllTodos(): Promise<Todo[]> {
    // Some Flask APIs might use /api/todos instead of /todos
    try {
      const response = await api.get("/todos");
      return response.data;
    } catch (error) {
      // Fallback to /api/todos if /todos fails
      console.log("Trying fallback endpoint /api/todos");
      const response = await api.get("/api/todos");
      return response.data;
    }
  },

  async getTodoById(id: number): Promise<Todo> {
    try {
      const response = await api.get(`/todos/${id}`);
      return response.data;
    } catch (error) {
      // Fallback to /api/todos if /todos fails
      console.log(`Trying fallback endpoint /api/todos/${id}`);
      const response = await api.get(`/api/todos/${id}`);
      return response.data;
    }
  },

  async createTodo(todo: CreateTodoPayload): Promise<Todo> {
    try {
      const response = await api.post("/todos", todo);
      return response.data;
    } catch (error) {
      // Fallback to /api/todos if /todos fails
      console.log("Trying fallback endpoint /api/todos");
      const response = await api.post("/api/todos", todo);
      return response.data;
    }
  },

  async updateTodo(id: number, todo: Partial<Todo>): Promise<Todo> {
    try {
      const response = await api.put(`/todos/${id}`, todo);
      return response.data;
    } catch (error) {
      // Fallback to /api/todos if /todos fails
      console.log(`Trying fallback endpoint /api/todos/${id}`);
      const response = await api.put(`/api/todos/${id}`, todo);
      return response.data;
    }
  },

  async deleteTodo(id: number): Promise<void> {
    try {
      await api.delete(`/todos/${id}`);
    } catch (error) {
      // Fallback to /api/todos if /todos fails
      console.log(`Trying fallback endpoint /api/todos/${id}`);
      await api.delete(`/api/todos/${id}`);
    }
  },

  async toggleTodoStatus(id: number, completed: boolean): Promise<Todo> {
    try {
      // Most Flask APIs use this endpoint structure for toggling status
      const response = await api.patch(`/todos/${id}`, {
        completed,
      });
      return response.data;
    } catch (error: any) {
      // If the first attempt fails, try alternative endpoint patterns
      try {
        console.log(`First attempt failed, trying /todos/${id}/toggle`);
        const response = await api.patch(`/todos/${id}/toggle`);
        return response.data;
      } catch (secondError: any) {
        try {
          console.log(`Second attempt failed, trying /api/todos/${id}`);
          const response = await api.patch(`/api/todos/${id}`, {
            completed: !completed,
          });
          return response.data;
        } catch (thirdError: any) {
          // If none of the patch endpoints work, fall back to getting and updating
          console.log("All patch attempts failed, using get/update method");
          const todo = await this.getTodoById(id);
          return this.updateTodo(id, { completed: !todo.completed });
        }
      }
    }
  },
};
