import React, { useEffect, useState } from 'react';
import Create from './Create';
import './App.css';
import axios from 'axios';
import { BsCircleFill, BsFillCheckCircleFill, BsFillTrashFill, BsPencil } from 'react-icons/bs';

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [updatetask, setUpdatetask] = useState('');
    const [taskid, setTaskid] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/get')
            .then(result => {
                console.log(result.data);
                setTodos(result.data);
            })
            .catch(err => console.log(err));
    }, []);

    const edit = (id) => {
        axios.put(`http://localhost:5000/edit/${id}`)
            .then(result => {
                const updatedTodos = todos.map(todo => {
                    if (todo._id === id) {
                        return { ...todo, done: !todo.done };
                    }
                    return todo;
                });
                setTodos(updatedTodos);
            })
            .catch(err => console.log(err));
    };

    const Update = (id, updatedTask) => {
        axios.put(`http://localhost:5000/update/${id}`, { task: updatedTask })
            .then(result => {
                const updatedTodos = todos.map(todo => {
                    if (todo._id === id) {
                        return result.data;
                    }
                    return todo;
                });
                setTodos(updatedTodos);
                setTaskid('');
                setUpdatetask('');
            })
            .catch(err => console.log(err));
    };

    const Hdelete = (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this task?');
        if (confirmDelete) {
            axios.delete(`http://localhost:5000/delete/${id}`)
                .then(result => {
                    const updatedTodos = todos.filter(todo => todo._id !== id);
                    setTodos(updatedTodos);
                })
                .catch(err => console.log(err));
        }
    };

    // Format date to a readable format
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Invalid date";
        
        // Calculate time ago
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) {
            return interval + (interval === 1 ? " year ago" : " years ago");
        }
        
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
            return interval + (interval === 1 ? " month ago" : " months ago");
        }
        
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
            return interval + (interval === 1 ? " day ago" : " days ago");
        }
        
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
            return interval + (interval === 1 ? " hour ago" : " hours ago");
        }
        
        interval = Math.floor(seconds / 60);
        if (interval >= 1) {
            return interval + (interval === 1 ? " minute ago" : " minutes ago");
        }
        
        return Math.floor(seconds) + (seconds === 1 ? " second ago" : " seconds ago");
    };

    // Determine if task has been updated after creation
    const isUpdated = (createdAt, updatedAt) => {
        if (!updatedAt || !createdAt) return false;
        // Convert to Date objects to compare
        const created = new Date(createdAt);
        const updated = new Date(updatedAt);
        // Check if updated is after created by at least 1 second (account for small inconsistencies)
        return (updated - created) > 1000;
    };

    return (
        <main>
            <Create />
            {
                todos.length === 0 ? <div className='task'>No tasks found</div> :
                    todos.map((todo) => (
                        <div className='task' key={todo._id}>
                            <div className='checkbox'>
                                {todo.done ? <BsFillCheckCircleFill className='icon' /> :
                                    <BsCircleFill className='icon' onClick={() => edit(todo._id)} />}
                                <div className="task-content">
                                    {taskid === todo._id ?
                                        <input 
                                            type='text' 
                                            value={updatetask} 
                                            onChange={e => setUpdatetask(e.target.value)}
                                            onKeyPress={e => {
                                                if (e.key === 'Enter') {
                                                    Update(todo._id, updatetask);
                                                }
                                            }}
                                        />
                                        :
                                        <>
                                            <p className={todo.done ? 'through' : 'normal'}>{todo.task}</p>
                                            <div className="timestamp-info">
                                                {isUpdated(todo.createdAt, todo.updatedAt) ? 
                                                    <small>Updated {formatDate(todo.updatedAt)}</small> : 
                                                    <small>Created {formatDate(todo.createdAt)}</small>
                                                }
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                            <div className="action-buttons">
                                {taskid === todo._id ? (
                                    <BsFillCheckCircleFill 
                                        className='icon' 
                                        onClick={() => {
                                            Update(todo._id, updatetask);
                                        }} 
                                    />
                                ) : (
                                    <BsPencil 
                                        className='icon' 
                                        onClick={() => {
                                            setTaskid(todo._id);
                                            setUpdatetask(todo.task);
                                        }} 
                                    />
                                )}
                                <BsFillTrashFill className='icon' onClick={() => Hdelete(todo._id)} />
                            </div>
                        </div>
                    ))
            }
        </main>
    );
};

export default Home;
