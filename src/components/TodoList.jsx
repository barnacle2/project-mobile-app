import { useState, useEffect } from 'react';
import './TodoList.css';  // Importing the CSS for styling

function TodoList() {
  const [todos, setTodos] = useState([]);  // State to hold the fetched data
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state

  useEffect(() => {
    // Function to fetch data
    const fetchTodos = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos');
        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }
        const data = await response.json();
        setTodos(data);  // Store the fetched data in the state
        setLoading(false);  // Set loading to false after data is fetched
      } catch (err) {
        setError(err.message);  // Store error message if any
        setLoading(false);  // Set loading to false in case of error
      }
    };

    fetchTodos();  // Call the fetch function on component mount
  }, []);  // Empty dependency array means this runs only once when the component mounts

  if (loading) {
    return <div className="loading">Loading...</div>;  // Show loading text while fetching data
  }

  if (error) {
    return <div className="error">Error: {error}</div>;  // Show error message if fetch fails
  }

  return (
    <div className="todo-container">
      <h2>Todo List</h2>
      <ul className="todo-list">
        {todos.map((todo, index) => (
          <li key={todo.id} className="todo-item">
            <span className="todo-number">{index + 1}.</span>
            <span className="todo-title">{todo.title}</span> - 
            <span className={`todo-status ${todo.completed ? 'completed' : 'not-completed'}`}>
              {todo.completed ? 'Completed' : 'Not Completed'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
