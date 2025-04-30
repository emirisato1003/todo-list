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

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);

      const options = {
        method: "GET",
        headers: {
          "Authorization": token
        }
      };
      try {
        const res = await fetch(url, options);
        if (!res.ok) {
          throw new Error(res.status);
        }
        const { records } = await res.json();
        // ---------- make sure if record.field.sisCompleted ? true : false works
        setTodoList(records.map(record => {
          const todo = {
            id: record.id,
            title: record.fields.Title,
            isCompleted: record.fields.isCompleted,
          };
          if (!todo.isCompleted) {
            todo.isCompleted = false;
          }
          return todo;
        }));
        console.log(todoList);
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
            Title: newTodo,
            // ------------------ in the instruction, isCompleted: newTodo.isCompleted. newTodo isn't obj. it's string for title. -------------------
            isCompleted: false,
          }
        }
      ]
    };

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
      // ------------ make sure if we can do setTotdoList and savedTodo. e.g. setTodoList(prevList => [...prevList, savedTodo]);? OR from line 33 setTodoList(records.map...)------------------
      const savedTodo = {
        id: records[0].id,
        title: records[0].fields.Title,
        isCompleted: records[0].fields.isCompleted || false,
        // --------------- ...records[0].fields from instruction ----------------
      };

      setTodoList([...todoList, savedTodo]);
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
            Title: originalTodo.title,
            isCompleted: true
          }
        }
      ]
    };
    const options = {
      method: 'PATCH',
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
      const updatedTodo = {
        id: records[0].id,
        ...records[0].fields
      };
      console.log(updatedTodo);
      const updatedTodos = todoList.map(todo => {
        if (todo.id === updatedTodo.id) {
          return { ...updatedTodo };
        }
        return todo;
      });
      setTodoList(updatedTodos)
    } catch (error) {
      console.log(error.message);
      setShownError(prev => !prev);
      setErrorMessage(`${error.message}. Reverting todo...`);
      const revertedTodo = {
        id: originalTodo.id,
        Title: originalTodo.title,
        isCompleted: false
      };
    
      setTodoList([...revertedTodo]);
    } finally {
      setIsSaving(false);
    }
  };


  const updateTodo = async (editedTodo) => {
    console.log(editedTodo);
    const originalTodo = todoList.find(todo => todo.id === editedTodo.id);
    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            Title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          }
        }
      ]
    };
    const options = {
      method: 'PATCH',
      headers: {
        "Authorization": token,
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
      const updatedTodo = {
        id: records[0].id,
        // --------------------- error before ...records[0].fields -----------------------------------
        title: records[0].fields.Title,
        isCompleted: records[0].fields.isCompleted || false
        // ...records[0].fields
      };
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