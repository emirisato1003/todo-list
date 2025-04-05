import TodoList from './TodoList';
import TodoForm from './TodoForm';
import './App.css';
import { useState } from 'react';

function App() {
  const [todoList, setTodoList] = useState([])

  function handleAddTodo(newTodo){
    setTodoList([...todoList, newTodo])
  }
  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={(newTodo) => handleAddTodo(newTodo)}/>
      <TodoList todoList={todoList}/>
    </div>
  );
}

export default App;