import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxios from "../../utils/useAxios";
import { useAuthStore } from "../../store/auth";

function TaskDetail() {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const axiosInstance = useAxios();

    const user = useAuthStore((state) => state.user);
    const user_id = user().user_id;
    const username = user().username;

    useEffect(() => {
        fetchTaskDetail();
        fetchTaskComments();
    }, []);

    const fetchTaskDetail = () => {
        axiosInstance
            .get(`tasks/${taskId}/`)
            .then((res) => {
                setTask(res.data);
            })
            .catch((error) => {
                console.error("Failed to fetch task details", error);
            });
    };

    const fetchTaskComments = () => {
        axiosInstance
            .get(`tasks/${taskId}/comments/`)
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
                navigate('/tasks');
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
                navigate('/tasks');
            } catch (error) {
                console.error("Failed to remove assignment", error);
            }
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post(`tasks/${taskId}/comments/`, {
                content: newComment,
            });
            setComments([...comments, response.data]);
            setNewComment("");
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
        <section className="flex flex-col min-h-screen mt-20">
            <div className="container mx-auto flex-grow">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h1 className="text-3xl font-bold">{task.title}</h1>
                    <p className="text-gray-600 mb-4">{task.description || "No description provided."}</p>
                    <p className="mb-2">
                        <strong>Status:</strong> <span className={`badge bg-${getStatusClass(task.status)}`}>{task.status}</span>
                    </p>
                    <p>
                        <strong>Due Date:</strong> {task.due_date || "N/A"}
                    </p>

                    {/* Display assigned users */}
                    <div className="mt-4">
                        <h5 className="text-xl font-semibold">Assigned Users:</h5>
                        {task.assigned_users.length > 0 ? (
                            <ul className="mt-2 space-y-2">
                                {task.assigned_users.map((user) => (
                                    <li key={user.id} className="bg-gray-100 p-3 rounded-md shadow-md">
                                        <strong>{user.full_name}</strong> <span className="text-gray-500">({user.username})</span><br />
                                        <small className="text-gray-400">{user.email}</small>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No users assigned to this task.</p>
                        )}
                    </div>
                </div>

                {/* Delete and Remove Assignment buttons */}
                {isTaskCreator && (
                    <button className="btn bg-red-500 text-white mt-3 py-2 px-4 rounded" onClick={handleDeleteTask}>
                        Delete Task
                    </button>
                )}

                {!isTaskCreator && isAssignedUser && (
                    <button className="btn bg-yellow-500 text-white mt-3 py-2 px-4 rounded" onClick={handleRemoveAssignment}>
                        Remove Assignment
                    </button>
                )}

                {/* Comments Section */}
                <div className="mt-6">
                    <h2 className="text-2xl font-bold">Comments</h2>
                    {comments.length > 0 ? (
                        <ul className="space-y-4 mt-4">
                            {comments.map((comment) => (
                                <li key={comment.id} className="bg-gray-100 p-4 rounded-md shadow-sm">
                                    <p>{comment.content}</p>
                                    <small className="text-gray-500">- {comment.user} on {new Date(comment.created_at).toLocaleString()}</small>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 mt-4">No comments available.</p>
                    )}
                </div>

                {/* Comment form */}
                <div className="mt-6">
                    <h5 className="text-xl font-bold">Leave a Comment</h5>
                    <form onSubmit={handleCommentSubmit}>
                        <textarea
                            className="w-full p-3 border rounded mb-3"
                            rows="4"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write your comment here..."
                            required
                        />
                        <button type="submit" className="btn bg-blue-500 text-white py-2 px-4 rounded">
                            Submit Comment
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

function getStatusClass(status) {
    switch (status) {
        case "todo":
            return "gray-400";
        case "in_progress":
            return "yellow-500";
        case "completed":
            return "green-500";
        default:
            return "gray-200";
    }
}

export default TaskDetail;
