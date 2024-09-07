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
    const [newComment, setNewComment] = useState(""); // State for the new comment
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
                const updatedUsers = task.assigned_users.filter((user) => user.id !== user_id);
                await axiosInstance.patch(`/tasks/${taskId}/`, { assigned_users: updatedUsers });
                navigate('/tasks'); // Redirect after removal
            } catch (error) {
                console.error("Failed to remove assignment:", error);
            }
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post(`tasks/${taskId}/comments/`, {
                content: newComment,
            });
            setComments([...comments, response.data]); // Append new comment to the list
            setNewComment(""); // Clear the comment input
        } catch (error) {
            console.error("Failed to submit comment", error);
        }
    };

    if (!task) {
        return <p>Loading task details...</p>;
    }

    const isTaskCreator = task.created_by === user().email;
    const isAssignedUser = task.assigned_users.some((assignedUser) => assignedUser.id === user_id);

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

                            {/* Display assigned users */}
                            <div className="mt-4">
                                <h5 className="fw-bold">Assigned Users:</h5>
                                {task.assigned_users.length > 0 ? (
                                    <ul className="list-group mt-2">
                                        {task.assigned_users.map((user) => (
                                            <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                <div>
                                                    <strong>{user.full_name}</strong> <span className="text-muted">({user.username})</span><br />
                                                    <small className="text-muted">{user.email}</small>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-muted">No users assigned to this task.</p>
                                )}
                            </div>
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
                                        <small className="text-muted">
                                            - {comment.user} on {new Date(comment.created_at).toLocaleString()}
                                        </small>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted mt-3">No comments available.</p>
                        )}
                    </div>

                    {/* Comment form */}
                    <div className="mt-4">
                        <h5 className="fw-bold">Leave a Comment</h5>
                        <form onSubmit={handleCommentSubmit}>
                            <div className="mb-3">
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Write your comment here..."
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Submit Comment
                            </button>
                        </form>
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
