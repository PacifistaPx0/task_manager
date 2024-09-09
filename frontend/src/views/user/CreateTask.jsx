import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxios from '../../utils/useAxios';
import BaseHeader from '../partials/BaseHeader';
import BaseFooter from '../partials/BaseFooter';

function CreateTask() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState('todo');
    const axiosInstance = useAxios();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post('tasks/', {
                title,
                description,
                due_date: dueDate,
                status,
            });

            if (response.status === 201) {
                navigate('/tasks'); // Redirect to task list after creation
            }
        } catch (error) {
            console.error('Failed to create task', error);
        }
    };

    return (
        <>
            <section className="container d-flex flex-column vh-100" style={{ marginTop: "150px" }}>
                <div className="container my-5">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <h1 className="fw-bold text-center">Create a New Task</h1>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Task Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        rows="3"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    ></textarea>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="due_date" className="form-label">Due Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="due_date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="status" className="form-label">Status</label>
                                    <select
                                        className="form-select"
                                        id="status"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="todo">To Do</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary">Create Task</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default CreateTask;