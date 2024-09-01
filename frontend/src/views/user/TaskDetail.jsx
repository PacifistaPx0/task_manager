import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxios from '../../utils/useAxios';
import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";

function TaskDetail() {
    const { taskId } = useParams();  // Extracting taskId from the URL parameters
    const [task, setTask] = useState(null);
    const [comments, setComments] = useState([]);
    const axiosInstance = useAxios();

    useEffect(() => {
        fetchTaskDetail();
        fetchTaskComments();
    }, []);

    const fetchTaskDetail = () => {
        axiosInstance
            .get(`tasks/${taskId}/`)  // Use taskId to get the specific task details
            .then((res) => {
                setTask(res.data);
            })
            .catch((error) => {
                console.error("Failed to fetch task details", error);
            });
    };

    const fetchTaskComments = () => {
        axiosInstance
            .get(`tasks/${taskId}/comments/`)  // Fetch comments related to the task
            .then((res) => {
                setComments(res.data);
            })
            .catch((error) => {
                console.error("Failed to fetch task comments", error);
            });
    };

    if (!task) {
        return <p>Loading task details...</p>;
    }

    return (
        <>
            <BaseHeader />
            <section className="container d-flex flex-column" style={{ marginTop: "100px" }}>
                <div className="container my-5">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h1 className="fw-bold">{task.title}</h1>
                            <p className="text-muted mb-4">{task.description || "No description provided."}</p>
                            <p className="mb-2"><strong>Status:</strong> <span className={`badge bg-${getStatusClass(task.status)}`}>{task.status}</span></p>
                            <p><strong>Due Date:</strong> {task.due_date || "N/A"}</p>
                        </div>
                    </div>

                    <div className="mt-5">
                        <h2 className="fw-bold">Comments</h2>
                        {comments.length > 0 ? (
                            <ul className="list-group mt-3">
                                {comments.map((comment) => (
                                    <li key={comment.id} className="list-group-item">
                                        <p className="mb-1">{comment.content}</p>
                                        <small className="text-muted">- {comment.user}</small>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted mt-3">No comments available.</p>
                        )}
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

export default TaskDetail;
