from app.models.todo import Todo, TodoCreate, TodoUpdate
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from fastapi import HTTPException

# In-memory storage
todos_db: List[Todo] = []

def get_todos() -> List[Todo]:
    return todos_db

def get_todo(todo_id: UUID) -> Todo:
    for todo in todos_db:
        if todo.id == todo_id:
            return todo
    raise HTTPException(status_code=404, detail=f"Todo with ID {todo_id} not found")

def create_todo(todo_create: TodoCreate) -> Todo:
    new_todo = Todo(**todo_create.dict())
    todos_db.append(new_todo)
    return new_todo

def update_todo(todo_id: UUID, todo_update: TodoUpdate) -> Todo:
    todo = get_todo(todo_id)  # This will raise 404 if not found
    
    # Update only provided fields
    update_data = todo_update.dict(exclude_unset=True)
    
    if update_data:
        # Update the todo with provided fields
        for key, value in update_data.items():
            setattr(todo, key, value)
        
        # Update the updated_at timestamp
        todo.updated_at = datetime.now()
    
    return todo

def delete_todo(todo_id: UUID) -> None:
    todo = get_todo(todo_id)  # This will raise 404 if not found
    todos_db.remove(todo) 