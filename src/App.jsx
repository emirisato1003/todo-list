import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  // create useEffect and fetching data
  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);

      const options = {
        method: "GET",
        // body: JSON.stringify()
        headers: {
          // "Content-Type": "application.json",
          "Authorization": token
        }
      };
      // set up try/catch/finally
      try {
        const res = await fetch(url, options);
        if (!res.ok) {
          throw new Error(res.status);
        }

        const { records } = await res.json();

        setTodoList(records.map(record => {
          const todo = {
            id: record.id,
            title: record.title,
            isCompleted: record.isCompleted,
            ...record.fields,
          };
          if (!todo.isCompleted) {
            todo.isCompleted = false;
          }
          return todo;
        }));

        // if (data.error) {
        //   throw new Error(data.status);
        // }
        console.log(records);

      } catch (error) {
        console.log(error.message);
        setErrorMessage(error.message);
      } finally {
        console.log('action completed');
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, []);

  function handleAddTodo(title) {
    const todoTask = {
      title: title,
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

  function updateTodo(editedTodo) {
    const updateTodos = todoList.map(todo => {
      if (todo.id === editedTodo.id) {
        console.log(editedTodo.title);
        return { ...editedTodo };
      }
      return todo;
    });
    setTodoList(updateTodos);
  }

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={handleAddTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={onCompleteTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading} />
    </div>
  );
}

export default App;