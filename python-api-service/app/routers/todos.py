from fastapi import APIRouter, HTTPException, status
from typing import List
from uuid import UUID

from app.models.todo import Todo, TodoCreate, TodoUpdate
from app.services import todo_service

router = APIRouter(
    prefix="/todos",
    tags=["todos"],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[Todo])
async def get_todos():
    """
    Get all todos.
    """
    return todo_service.get_todos()

@router.get("/{todo_id}", response_model=Todo)
async def get_todo(todo_id: UUID):
    """
    Get a specific todo by ID.
    """
    return todo_service.get_todo(todo_id)

@router.post("/", response_model=Todo, status_code=status.HTTP_201_CREATED)
async def create_todo(todo: TodoCreate):
    """
    Create a new todo.
    """
    return todo_service.create_todo(todo)

@router.patch("/{todo_id}", response_model=Todo)
async def update_todo(todo_id: UUID, todo_update: TodoUpdate):
    """
    Update a todo by ID.
    """
    return todo_service.update_todo(todo_id, todo_update)

@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_todo(todo_id: UUID):
    """
    Delete a todo by ID.
    """
    todo_service.delete_todo(todo_id)
    return None 