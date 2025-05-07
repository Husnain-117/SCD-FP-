import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

const Create = () => {
    const [task, setTask] = useState('');

    const createTask = () => {
        const trimmedTask = task.trim();
        if (!trimmedTask) {
            alert('Please enter a task');
            return;
        }

      axios.post('http://localhost:5000/add', { task: trimmedTask })


            .then(result => {
                console.log('Task added:', result.data);
                setTask('');
                window.location.reload(); // reload to fetch tasks
            })
            .catch(err => {
                console.error('Error adding task:', err);
                alert('Failed to add task. Try again.');
            });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') createTask();
    };

    return (
        <main>
            <h1>Todo List</h1>
            <div className='create-form'>
                <input
                    type='text'
                    placeholder='Enter a task'
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button onClick={createTask}>ADD</button>
            </div>
        </main>
    );
};

export default Create;

