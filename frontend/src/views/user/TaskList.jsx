import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxios from '../../utils/useAxios';
import { FaCheckCircle, FaHourglassHalf, FaClipboardList } from 'react-icons/fa';

function TaskList() {
    const [tasks, setTasks] = useState([]);
    const axiosInstance = useAxios();

    const fetchTaskData = () => {
        axiosInstance
            .get('tasks/')
            .then((res) => {
                setTasks(res.data);
            })
            .catch((error) => {
                console.error('Failed to fetch tasks', error);
            });
    };

    useEffect(() => {
        fetchTaskData();
    }, []);

    return (
        <>
            <section className="flex flex-col min-h-screen mt-20">
                <div className="container mx-auto my-5 flex-grow">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-4">Your Tasks</h1>
                        <p className="text-lg text-gray-600 mb-6">Manage and track your tasks below.</p>

                        {/* Conditionally render the Create Task button */}
                        {tasks.length > 0 && (
                            <Link to="/create-task" className="btn btn-primary mb-4">Create a Task</Link>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tasks.length > 0 ? (
                            tasks.map((task) => (
                                <div key={task.id} className="bg-white shadow rounded-lg p-6">
                                    <Link to={`/tasks/${task.id}`} className="text-decoration-none">
                                        <h5 className="text-lg font-bold text-gray-900">{task.title}</h5>
                                        <p className="text-sm text-gray-500 mb-4">
                                            {task.description || 'No description provided.'}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Due: {task.due_date || 'N/A'}</span>
                                            {getStatusIcon(task.status)}
                                        </div>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-600">No tasks available. 
                                <Link to="/create-task" className="btn btn-primary ml-2">Create a Task</Link>
                            </p>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

function getStatusIcon(status) {
    switch (status) {
        case "todo":
            return <FaClipboardList className="text-gray-400" size={20} />;
        case "in_progress":
            return <FaHourglassHalf className="text-yellow-400" size={20} />;
        case "completed":
            return <FaCheckCircle className="text-green-500" size={20} />;
        default:
            return <FaClipboardList className="text-gray-200" size={20} />;
    }
}

export default TaskList;
