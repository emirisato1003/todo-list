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


  function getOptions(method, payload) {
    const options = {
      method: method,
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
    };
    if (payload !== undefined) {
      options.body = JSON.stringify(payload);
    }
    return options
  }

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);

      const options = getOptions('GET')
      try {
        const res = await fetch(url, options);
        if (!res.ok) {
          throw new Error(res.status);
        }
        const { records } = await res.json();
        setTodoList(records.map(record => {
          const todo = {
            id: record.id,
            ...record.fields
          };
          if (!todo.isCompleted) {
            todo.isCompleted = false;
          }
          return todo;
        }));
      } catch (error) {
        console.log(error.message);
        setShownError(prev => !prev);
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const handleAddTodo = async (newTodo) => {
    const payload = {
      records: [
        {
          fields: {
            title: newTodo,
            isCompleted: false,
          }
        }
      ]
    };
    const options = getOptions('POST', payload)
    try {
      setIsSaving(true);

      const res = await fetch(url, options);
      if (!res.ok) {
        throw new Error(res.status);
      }
      const { records } = await res.json();
      setTodoList(prevTodo => {
        const savedTodo = {
          id: records[0].id,
          ...records[0].fields
        };
        if (!records[0].fields.isCompleted) {
          savedTodo.isCompleted = false;
        }
        return [...prevTodo, savedTodo];
      });

    } catch (error) {
      setShownError(prev => !prev);
      console.log(error.message);
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const onCompleteTodo = async (todoId) => {
    const originalTodo = todoList.find(todo => todo.id === todoId);
    const payload = {
      records: [
        {
          id: todoId,
          fields: {
            title: originalTodo.title,
            isCompleted: true
          }
        }
      ]
    };
    const options = getOptions('PATCH', payload)
    try {
      setIsSaving(true);
      const res = await fetch(url, options);
      if (!res.ok) {
        throw new Error(res.status);
      }
      const { records } = await res.json();
      const updatedTodo = {
        id: records[0].id,
        ...records[0].fields
      };
      const updatedTodos = todoList.map(todo => {
        if (todo.id === updatedTodo.id) {
          return { ...updatedTodo };
        }
        return todo;
      });
      setTodoList(updatedTodos);
    } catch (error) {
      console.log(error.message);
      setShownError(prev => !prev);
      setErrorMessage(`${error.message}. Reverting todo...`);
      const revertedTodo = {
        id: originalTodo.id,
        title: originalTodo.title,
        isCompleted: false
      };
      setTodoList([...revertedTodo]);
    } finally {
      setIsSaving(false);
    }
  };


  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find(todo => todo.id === editedTodo.id);
    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          }
        }
      ]
    };
    const options = getOptions('PATCH', payload)
    try {
      setIsSaving(true);

      const res = await fetch(url, options);
      if (!res.ok) {
        throw new Error(res.status);
      }
      const { records } = await res.json();
      const updatedTodo = {
        id: records[0].id,
        ...records[0].fields
      };
      if (!records[0].isCompleted) {
        updatedTodo.isCompleted = false;
      }
      const updatedTodos = todoList.map(todo => {
        if (todo.id === updatedTodo.id) {
          return { ...updatedTodo };
        }
        return todo;
      });
      setTodoList([...updatedTodos]);

    } catch (error) {
      console.log(error.message);
      setErrorMessage(`${error.message}. Reverting todo...`);
      setShownError(prev => !prev);
      const revertedTodo = {
        id: originalTodo.id,
        title: originalTodo.title,
        isCompleted: originalTodo.isCompleted || false
      };
      setTodoList([...revertedTodo]);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={handleAddTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={onCompleteTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading} />
      {errorMessage && shownError &&
        <>
          <hr />
          <p>{errorMessage}</p>
          <button onClick={() => setShownError(prev => !prev)}>Dismiss</button>
        </>
      }
    </div >
  );
};



export default App;