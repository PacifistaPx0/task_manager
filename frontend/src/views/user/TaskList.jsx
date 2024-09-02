import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";
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
            <BaseHeader />
            <section className="container d-flex flex-column vh-100" style={{ marginTop: "150px" }}>
                <div className="container my-5">
                    <div className="row justify-content-center">
                        <div className="col-md-10">
                            <h1 className="fw-bold text-center">Your Tasks</h1>
                            <p className="lead text-center mb-4">Manage and track your tasks below.</p>
                            <div className="row gy-4">
                                {tasks.length > 0 ? (
                                    tasks.map((task) => (
                                        <div key={task.id} className="col-md-6">
                                            <Link to={`/tasks/${task.id}`} className="text-decoration-none">
                                                <div className="card shadow-sm border-0 h-100">
                                                    <div className="card-body d-flex flex-column">
                                                        <div className="d-flex justify-content-between align-items-start">
                                                            <h5 className="card-title text-dark">{task.title}</h5>
                                                            <span className={`badge bg-${getStatusClass(task.status)}`}>
                                                                {task.status}
                                                            </span>
                                                        </div>
                                                        <p className="card-text text-muted mb-4">{task.description || 'No description provided.'}</p>
                                                        <div className="mt-auto d-flex justify-content-between align-items-center">
                                                            <span className="text-muted small">Due: {task.due_date || 'N/A'}</span>
                                                            {getStatusIcon(task.status)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center">No tasks available. <Link to="/create-task" className="btn btn-primary ms-2">Create a Task</Link></p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <BaseFooter />
        </>
    );
}

function getStatusClass(status) {
    switch (status) {
        case "todo":
            return "secondary";
        case "in_progress":
            return "warning";
        case "completed":
            return "success";
        default:
            return "light";
    }
}

function getStatusIcon(status) {
    switch (status) {
        case "todo":
            return <FaClipboardList className="text-secondary" size={20} />;
        case "in_progress":
            return <FaHourglassHalf className="text-warning" size={20} />;
        case "completed":
            return <FaCheckCircle className="text-success" size={20} />;
        default:
            return <FaClipboardList className="text-light" size={20} />;
    }
}

export default TaskList;
