import { useEffect, useState, useCallback, useReducer, useRef } from 'react';

import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import TodoViewForm from './features/TodoViewForm';
import styles from './App.module.css';
import './App.css';
import {
  reducer as todosReducer,
  initialState as initialTodoState,
  ACTIONS as TODO_ACTIONS
} from './reducers/todos.reducer';
import {
  reducer as sortReducer,
  initialState as initialSortState
} from './reducers/sort.reducer';
import TodosPage from './pages/TodosPage';
import Header from './shared/Header';
import { Route, Routes } from 'react-router';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Footer from './shared/Footer';

// --- Airtable API config ---
const token = `Bearer ${import.meta.env.VITE_PAT}`;
const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;

// --- utility functions ---
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
  // useReducer
  const [todoState, dispatch] = useReducer(todosReducer, initialTodoState);
  const [sortState, sortDispatch] = useReducer(sortReducer, initialSortState);

  // useRef
  // *** additional system: scrolling down when error message shows up ***
  const errorSection = useRef(null);

  // the page scroll down when error message shows up
  useEffect(() => {
    if (todoState.errorMessage !== '' && errorSection.current !== null) {
      errorSection.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [todoState.errorMessage]);

  const encodeUrl = useCallback(() => {
    let searchQuery = "";

    let sortQuery = `sort[0][field]=${sortState.sortField}&sort[0][direction]=${sortState.sortDirection}`;
    if (sortState.queryString) {
      searchQuery = `&filterByFormula=SEARCH("${sortState.queryString}", title)`;
    }
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [sortState.sortField, sortState.sortDirection, sortState.queryString]);

  const fetchTodos = async () => {
    dispatch({ type: TODO_ACTIONS.FETCH_TODO });
    const options = getOptions('GET');
    const { success, records, error } = await apiRequest(encodeUrl(), options, null, null);
    success && dispatch({ type: TODO_ACTIONS.LOAD_TODOS, records: records });
    if (!success) {
      dispatch({ type: TODO_ACTIONS.SET_LOAD_ERROR, error: { message: error } });
    }
  };
  useEffect(() => {
    fetchTodos();
  }, [sortState.sortDirection, sortState.sortField, sortState.queryString]);

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
    const { success, records, error } = await apiRequest(encodeUrl(), options, () => dispatch({ type: TODO_ACTIONS.START_REQUEST }), () => dispatch({ type: TODO_ACTIONS.END_REQUEST }));
    success && dispatch({ type: TODO_ACTIONS.ADD_TODO, records: records });
    if (!success) {
      dispatch({ type: TODO_ACTIONS.SET_LOAD_ERROR, error: {message: error} });
    }
  };

  const onCompleteTodo = async (todoId) => {
    const originalTodo = todoState.todoList.find(todo => todo.id === todoId);
    if (!originalTodo) return;
    const editedTodo = {
      ...originalTodo,
      isCompleted: true
    };
    dispatch({ type: TODO_ACTIONS.COMPLETE_TODO, editedTodo });
    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted
          }
        }
      ]
    };
    const options = getOptions('PATCH', payload);
    const { success, error } = await apiRequest(encodeUrl(), options, () => dispatch({ type: TODO_ACTIONS.START_REQUEST }), null);
    if (!success) {
      dispatch({ type: TODO_ACTIONS.SET_LOAD_ERROR, error: { message: `${error}. Reverting todo...` } });
      dispatch({ type: TODO_ACTIONS.REVERT_TODO, originalTodo });
    }
  };

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoState.todoList.find(todo => todo.id === editedTodo.id);
    dispatch({ type: TODO_ACTIONS.UPDATE_TODO, editedTodo });
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
    const { success, error } = await apiRequest(encodeUrl(), options, () => dispatch({ type: TODO_ACTIONS.START_REQUEST }), null);
    if (!success) {
      dispatch({ type: TODO_ACTIONS.SET_LOAD_ERROR, error: { message: `${error}. Reverting todo...` } });
      dispatch({ type: TODO_ACTIONS.REVERT_TODO, originalTodo });
    }
  };

  return (
    <div className={styles.body}>
      <Header />
      <hr/>
      <Routes>
        <Route path='/' element={<TodosPage
          handleAddTodo={handleAddTodo}
          todoState={todoState}
          onCompleteTodo={onCompleteTodo}
          updateTodo={updateTodo}
          sortState={sortState}
          sortDispatch={sortDispatch}
        />} />
        <Route path='/about' element={<About />} />
        <Route path="/*" element={<NotFound />} />

      </Routes>
      {todoState.errorMessage &&
        <>
          <hr />
          <div ref={errorSection} className={styles.error}>
            <div className={styles.content}>
              <p>{todoState.errorMessage}</p>
            </div>
            <div className={styles.actions}><button onClick={() => { dispatch({ type: TODO_ACTIONS.CLEAR_ERROR }); }}>Dismiss</button></div>
          </div>
        </>
      }
      <hr />
      <Footer />
    </div>
  );
};

export default App;