import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxios from "../../utils/useAxios";
import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";
import { useAuthStore } from "../../store/auth";

function TaskDetail() {
    const { taskId } = useParams(); // Extracting taskId from the URL parameters
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [comments, setComments] = useState([]);
    const axiosInstance = useAxios();

    const user = useAuthStore((state) => state.user); // Get the user object directly
    const user_id = user().user_id;
    const username = user().username;

    useEffect(() => {
        fetchTaskDetail();
        fetchTaskComments();
    }, []);

    const fetchTaskDetail = () => {
        axiosInstance
            .get(`tasks/${taskId}/`) // Use taskId to get the specific task details
            .then((res) => {
                setTask(res.data);
                console.log("Task data (for button display):", res.data);
            })
            .catch((error) => {
                console.error("Failed to fetch task details", error);
            });
    };

    const fetchTaskComments = () => {
        axiosInstance
            .get(`tasks/${taskId}/comments/`) // Fetch comments related to the task
            .then((res) => {
                setComments(res.data);
            })
            .catch((error) => {
                console.error("Failed to fetch task comments", error);
            });
    };

    const handleDeleteTask = async () => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await axiosInstance.delete(`tasks/${taskId}/`);
                navigate('/tasks'); // Redirect to task list after deletion
            } catch (error) {
                console.error("Failed to delete task", error);
            }
        }
    };

    const handleRemoveAssignment = async () => {
        if (window.confirm("Are you sure you want to remove yourself from this task?")) {
            try {
                const updatedUsers = task.assigned_users.filter((userId) => userId !== user_id);
                await axiosInstance.patch(`/tasks/${taskId}/`, { assigned_users: updatedUsers });
                navigate('/tasks'); // Redirect after removal
            } catch (error) {
                console.error("Failed to remove assignment:", error);
            }
        }
    };

    if (!task) {
        return <p>Loading task details...</p>;
    }

    // Debugging: Log user information and task creator info
    console.log("User ID:", user_id);
    console.log("Username:", username);
    console.log("Task Created By:", task.created_by);
    console.log("Assigned Users:", task.assigned_users);
    console.log("User Email:", user().email);

    const isTaskCreator = task.created_by === user().email;
    const isAssignedUser = task.assigned_users.includes(user_id);

    // Debugging: Log the results of the checks
    console.log("Is Task Creator:", isTaskCreator);
    console.log("Is Assigned User:", isAssignedUser);

    return (
        <>
            <BaseHeader />
            <section className="container d-flex flex-column vh-100" style={{ marginTop: "150px" }}>
                <div className="container my-5">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h1 className="fw-bold">{task.title}</h1>
                            <p className="text-muted mb-4">{task.description || "No description provided."}</p>
                            <p className="mb-2"><strong>Status:</strong> <span className={`badge bg-${getStatusClass(task.status)}`}>{task.status}</span></p>
                            <p><strong>Due Date:</strong> {task.due_date || "N/A"}</p>
                        </div>
                    </div>

                    {isTaskCreator && (
                        <button className="btn btn-danger mt-3" onClick={handleDeleteTask}>
                            Delete Task
                        </button>
                    )}

                    {!isTaskCreator && isAssignedUser && (
                        <button className="btn btn-warning mt-3" onClick={handleRemoveAssignment}>
                            Remove Assignment
                        </button>
                    )}

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
