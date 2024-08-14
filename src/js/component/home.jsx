import React, { useState, useEffect } from 'react';

const apiUrl = 'https://playground.4geeks.com/todo/users/ChristianDVillar';

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [task, setTask] = useState("");

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = () => {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setTodos(data.todos))
            .catch(error => console.error('Error fetching tasks:', error));
    };

    const updateTodos = (updatedTodos) => {
        fetch("https://playground.4geeks.com/todo/todos/ChristianDVillar", {
            method: 'POST',
            body: JSON.stringify({
                label: updatedTodos,
                is_done: false
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(resp => {
                if (!resp.ok) {
                    throw new Error('Network response was not ok');
                }
                return resp.json();
            })
            .then(data => {
                console.log(data);
                fetchTodos();
            })
            .catch(error => console.error('Error updating tasks:', error));
    };
    const deleteTask = (id) => {
        fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
            method: 'DELETE',

            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(resp => {
                if (!resp.ok) {
                    throw new Error('Network response was not ok');
                }
                return resp.text();
            })
            .then(data => {
                console.log(data);
                fetchTodos();
            })
            .catch(error => console.error('Error updating tasks:', error));
    };

    const toggleTaskStatus = (index) => {
        const newTodos = todos.map((todo, idx) => {
            if (idx === index) {
                return { ...todo, done: !todo.done };
            }
            return todo;
        });
        updateTodos(newTodos);
    };

    return (
        <div>
            <h1>To-Do List</h1>
            <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Add a new task"
            />
            <button onClick={() => updateTodos(task)}>Add Task</button>
            <ul>
                {todos.map((todo, index) => (
                    <li key={index}>
                        {/* <input
                            type="checkbox"
                            //checked={todo.done}
                           // onChange={() => toggleTaskStatus(index)}
                        /> */}
                        {todo.label}
                        <button onClick={() => deleteTask(todo.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;
