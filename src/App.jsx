import TodoList from './TodoList';
import TodoForm from './TodoForm';
import './App.css';
import { useState } from 'react';

function App() {
  const [todoList, setTodoList] = useState([]);

  function handleAddTodo(newTodo) {
    const todoWithId = {
      newTodo,
      id: Date.now()
    };
    setTodoList([...todoList, todoWithId]);
  }
  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={(newTodo) => handleAddTodo(newTodo)} />
      <TodoList todoList={todoList} />
    </div>
  );
}

export default App;