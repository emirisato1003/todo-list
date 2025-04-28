import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [shownError, setShownError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  // create useEffect and fetching data
  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);

      const options = {
        method: "GET",
        headers: {
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
        console.log(records);
        setTodoList(records.map(record => {
          const todo = {
            id: record.id,
            title: record.fields.Title,
            isCompleted: record.isCompleted,
            ...record.fields,
          };
          if (!todo.isCompleted) {
            todo.isCompleted = false;
          }
          return todo;
        }));
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

  // Part 3 --- update add new Todo functionality
  // function handleAddTodo(title) {
  //   const todoTask = {
  //     title: title,
  //     id: Date.now(),
  //     isCompleted: false
  //   };
  //   setTodoList([...todoList, todoTask]);
  // }

  // --- async handleAddTodo()
  const handleAddTodo = async (newTodo) => {
    // console.log("Using URL:", url);
    // console.log("Token format correct:", token.startsWith("Bearer "));

    const payload = {
      records: [
        {
          fields: {
            Title: newTodo,
            // in the instruction, isCompleted: newTodo.isCompleted. newTodo isn't obj. it's string for title.
            isCompleted: false,
          }
        }
      ]
    };

    console.log("Sending payload:", payload);
    const options = {
      method: "POST",
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    };

    try {
      setIsSaving(true);
      const res = await fetch(url, options);
  
      if (!res.ok) {
        throw new Error(res.status);
      }
      const { records } = await res.json();
      console.log(records);

      const savedTodo = {
        id: records[0].id,
        title: records[0].fields.Title,
        isCompleted: records[0].fields.isCompleted || false,
        ...records
      };
      // is it for avoiding to get falsy value?
      if (!records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }
      setTodoList(prevList => [...prevList, savedTodo]);
    } catch (error) {
      console.log(error.message);
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }

  };

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
      {errorMessage &&
        <>
          <hr />
          <p>{errorMessage}</p>
          <button onClick={setShownError(prev => !prev)}>Dismiss</button>
        </>
      }
    </div>
  );
};

export default App;