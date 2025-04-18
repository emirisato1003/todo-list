import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import './App.css';
import { useState } from 'react';

function App() {
  const [todoList, setTodoList] = useState([]);

  function handleAddTodo(newTodo) {
    const todoTask = {
      title: newTodo,
      id: Date.now(),
      isCompleted: false
    };
    setTodoList([...todoList, todoTask]);
  }

  function onCompleteTodo(todoId) {
    const updateTodos = todoList.map(todo => {
      if (todo.id === todoId) {
        return { ...todo, isCompleted: true };
      }
      return todo;
    });
    setTodoList(updateTodos);
  }
  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={handleAddTodo} />
      <TodoList todoList={todoList} onCompleteTodo={onCompleteTodo} />
    </div>
  );
}

export default App;