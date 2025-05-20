import { useEffect, useState, useCallback } from 'react';

import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import TodoViewForm from './features/TodoViewForm';
import styles from './App.module.css';
import './App.css';


const token = `Bearer ${import.meta.env.VITE_PAT}`;
const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;

const apiRequest = async (url, options, onStart, onEnd) => {
  try {
    onStart && onStart();
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error(res.status);
    }
    const { records } = await res.json();
    return { success: true, records };
  } catch (error) {
    console.log(error.message);
    return { error: error.message };
  } finally {
    onEnd && onEnd();
  }
};

const getOptions = (method, payload) => {
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
  return options;
};


function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [shownError, setShownError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sortDirection, setSortDirection] = useState("desc");
  const [sortField, setSortField] = useState("title");
  const [queryString, setQueryString] = useState("");

  const encodeUrl = useCallback(() => {
    let searchQuery = "";

    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}", +title)`;
    }
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [sortField, sortDirection, queryString]);

  const fetchTodos = async () => {
    setIsLoading(true);

    const options = getOptions('GET');
    const { success, records, error } = await apiRequest(encodeUrl(), options, null, () => setIsLoading(false));

    success && setTodoList(records.map(record => {
      const todo = {
        id: record.id,
        ...record.fields
      };
      if (!todo.isCompleted) {
        todo.isCompleted = false;
      }
      return todo;
    }));
    if (!success) {
      setErrorMessage(error);
      setShownError(true);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [sortDirection, sortField, queryString]);

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
    const options = getOptions('POST', payload);
    const { success, records, error } = await apiRequest(encodeUrl(), options, () => setIsLoading(true), () => setIsLoading(false));
    success && setTodoList(prevTodo => {
      const savedTodo = {
        id: records[0].id,
        ...records[0].fields
      };
      if (!records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }
      return [...prevTodo, savedTodo];
    });
    if (!success) {
      setErrorMessage(error);
      setShownError(true);
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
    const options = getOptions('PATCH', payload);
    const { success, records, error } = await apiRequest(encodeUrl(), options, () => setIsSaving(true), () => setIsSaving(false));
    if (success) {
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
    } else {
      setShownError(true);
      setErrorMessage(`${error}. Reverting todo...`);
      const revertedTodo = {
        id: originalTodo.id,
        title: originalTodo.title,
        isCompleted: false
      };
      setTodoList([...revertedTodo]);
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
    const options = getOptions('PATCH', payload);
    const { success, records, error } = await apiRequest(encodeUrl(), options, () => setIsSaving(true), () => setIsSaving(false));
    if (success) {
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
    } else {
      setErrorMessage(`${error}. Reverting todo...`);
      setShownError(true);
      const revertedTodo = {
        id: originalTodo.id,
        title: originalTodo.title,
        isCompleted: originalTodo.isCompleted || false
      };
      setTodoList([...revertedTodo]);
    }
  };

  return (
    <div className={styles.body}>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={handleAddTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={onCompleteTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading} />
      <hr />
      <TodoViewForm
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        sortField={sortField}
        setSortField={setSortField}
        queryString={queryString}
        setQueryString={setQueryString}
      />
      {errorMessage && shownError &&
        <>
          <hr />
          <div className={styles.error}>
            <div className={styles.content}>
              <p>{errorMessage}</p>
            </div>
            <div className={styles.actions}><button onClick={() => setShownError(prev => !prev)}>Dismiss</button></div>
          </div>
        </>
      }
    </div>
  );
};



export default App;