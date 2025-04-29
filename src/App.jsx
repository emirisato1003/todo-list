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
        // console.log(records);
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
        // console.log('action completed');
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
    // console.log("Sending payload:", payload);
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
      // console.log(records);

      const savedTodo = {
        id: records[0].id,
        title: records[0].fields.Title,
        isCompleted: records[0].fields.isCompleted || false,
      };
      // if (!records[0].fields.isCompleted) {
      //   savedTodo.isCompleted = false;
      // }
      setTodoList(prevList => [...prevList, savedTodo]);
    } catch (error) {
      console.log(error.message);
      // setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Last Part --- update functionality to complete Todos
  function onCompleteTodo(todoId) {
    const updateTodos = todoList.map(todo => {
      if (todo.id === todoId) {
        return { ...todo, isCompleted: true };
      }
      return todo;
    });
    setTodoList(updateTodos);
  }

  // Part 4 --- update functionality of Updata and Complete Todo
  // function updateTodo(editedTodo) {
  //   const updateTodos = todoList.map(todo => {
  //     if (todo.id === editedTodo.id) {
  //       console.log(editedTodo.title);
  //       return { ...editedTodo };
  //     }
  //     return todo;
  //   });
  //   setTodoList(updateTodos);
  // }

  // --- async updateTodo()
  const updateTodo = async (editedTodo) => {
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
    // console.log("Sending payload", payload);

    const options = {
      method: 'PATCH',
      headers: {
        "Authorization": token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    };

    try {
      const res = await fetch(url, options);
      // console.log("response status", res.status);
      if (!res.ok) {
        throw new Error(res.status);
      }
      const { records } = await res.json();
      // console.log(records);
      const updatedTodo = {
        id: records[0].id,
        ...records[0].fields
      };
      if (!records[0].fields.isCompleted) {
        updatedTodo.isCompleted === false;
      }
      // console.log(updatedTodo);

      const updatedTodos = todoList.map(todo => {
        // console.log(`todo id: ${todo.id}, updatedTodo id ${updatedTodo.id}`);
        if (todo.id === updatedTodo.id) {
          return { ...updatedTodo };
        }
        return todo;
      });
      // console.log(updatedTodos);
      setTodoList([...updatedTodos]);
    } catch (error) {
      console.log(error.message);
      setErrorMessage(`${error.message}. Reverting todo...`);
      const revertedTodos = {
        id: originalTodo.id,
        ...originalTodo.fields
      };
      setTodoList([...revertedTodos]);
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