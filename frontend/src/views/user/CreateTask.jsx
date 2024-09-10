import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxios from '../../utils/useAxios';

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
            {/* Create Task Section */}
            <section className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
                    <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Create a New Task</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-gray-600 font-medium mb-2">Task Title</label>
                            <input
                                type="text"
                                id="title"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-gray-600 font-medium mb-2">Description</label>
                            <textarea
                                id="description"
                                rows="4"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="due_date" className="block text-gray-600 font-medium mb-2">Due Date</label>
                            <input
                                type="date"
                                id="due_date"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-gray-600 font-medium mb-2">Status</label>
                            <select
                                id="status"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="todo">To Do</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition duration-300"
                        >
                            Create Task
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
}

export default CreateTask;
