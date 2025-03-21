import TodoList from './TodoList';
import TodoForm from './TodoForm';
import './App.css';

function App() {
  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm />
      <TodoList />
    </div>
  );
}

export default App;
