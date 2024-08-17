import React, { useState, useEffect } from 'react';

const apiBaseUrl = 'https://playground.4geeks.com/todo/users';

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [task, setTask] = useState("");
    const [username, setUsername] = useState("");
    const [isUserCreated, setIsUserCreated] = useState(false);

    // Manejo de usuario
    const handleCreateUser = () => {
        fetch(`${apiBaseUrl}/${username}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                setIsUserCreated(true);
                fetchTodos(); // Obtener las tareas después de crear el usuario
            } else {
                throw new Error('Error al crear el usuario');
            }
        })
        .catch(error => console.error('Error al crear el usuario:', error));
    };

    const handleDeleteUser = () => {
        fetch(`${apiBaseUrl}/${username}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                setTodos([]); // Limpiar las tareas
                setUsername(""); // Limpiar el nombre de usuario
                setIsUserCreated(false); // Actualizar el estado del usuario
                console.log('Usuario eliminado con éxito');
            } else {
                throw new Error('Error al eliminar el usuario');
            }
        })
        .catch(error => console.error('Error al eliminar el usuario:', error));
    };

    useEffect(() => {
        if (isUserCreated) {
            fetchTodos();
        }
    }, [isUserCreated]);

    const fetchTodos = () => {
        fetch(`${apiBaseUrl}/${username}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener las tareas');
                }
                return response.json();
            })
            .then(data => {
                if (data && Array.isArray(data.todos)) {
                    setTodos(data.todos);
                } else {
                    setTodos([]);
                }
            })
            .catch(error => console.error('Error al obtener las tareas:', error));
    };

    const addTask = () => {
        if (task.trim() === "") return;

        const newTask = {
            label: task,
            is_done: false
        };

        fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
            method: 'POST',
            body: JSON.stringify(newTask),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(resp => {
            if (!resp.ok) {
                throw new Error('Error al crear la tarea');
            }
            return resp.json();
        })
        .then(data => {
            console.log(data);
            fetchTodos(); // Actualizar la lista de tareas
        })
        .catch(error => console.error('Error al crear la tarea:', error));

        setTask(""); // Limpiar el input después de agregar la tarea
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
                throw new Error('Error al eliminar la tarea');
            }
            return resp.text();
        })
        .then(data => {
            console.log(data);
            fetchTodos(); // Actualizar la lista de tareas
        })
        .catch(error => console.error('Error al eliminar la tarea:', error));
    };

    return (
        <div>
            <h1>To-Do List</h1>
            {!isUserCreated ? (
                <div>
                    <label>
                        Create Username:
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                        />
                    </label>
                    <button onClick={handleCreateUser}>Create User</button>
                </div>
            ) : (
                <div>
                    <h2>User: {username}</h2>
                    <button onClick={handleDeleteUser}>Delete User</button>
                    <input
                        type="text"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        placeholder="Add a new task"
                    />
                    <button onClick={addTask}>Add Task</button>
                    <ul>
                        {todos.map((todo, index) => (
                            <li key={index}>
                                {todo.label}
                                <button onClick={() => deleteTask(todo.id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Home;