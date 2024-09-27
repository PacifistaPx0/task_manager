import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxios from "../../utils/useAxios";
import { useAuthStore } from "../../store/auth";
import Select from 'react-select';

function TaskDetail() {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [allUsers, setAllUsers] = useState([]); // Added state for all users
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false); // State to toggle edit mode
    const [editedTask, setEditedTask] = useState({ title: "", description: "", status: "", due_date: "" });
    const axiosInstance = useAxios();

    const user = useAuthStore((state) => state.user);
    const user_id = user().user_id;

    useEffect(() => {
        fetchTaskDetail();
        fetchTaskComments();
        fetchAllUsers(); // Fetch all users for assigning
    }, []);

    const fetchTaskDetail = () => {
        axiosInstance
            .get(`tasks/${taskId}/`)
            .then((res) => {
                setTask(res.data);
                setEditedTask({
                    title: res.data.title,
                    description: res.data.description,
                    status: res.data.status,
                    due_date: res.data.due_date,
                });
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

    const fetchAllUsers = () => {
        axiosInstance
            .get("/users/") // Users endpoint to fetch all users
            .then((res) => {

                //remove the current user from the list of users
                const filteredUsers = res.data.filter((user) => user.id!== user_id);
                setAllUsers(filteredUsers); // Set the list of all users
            })
            .catch((error) => {
                console.error("Failed to fetch users", error);
            });
    };

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };

    const handleEditChange = (e) => {
        setEditedTask({ ...editedTask, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.patch(`/tasks/${taskId}/`, editedTask);
            setTask(response.data); // Update the task with the new data
            setIsEditMode(false); // Close edit mode
        } catch (error) {
            console.error("Failed to update task", error);
        }
    };

    const handleAssignUsers = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                assigned_users: selectedUsers,
                action: 'add'
            };
            const response = await axiosInstance.patch(`/tasks/${taskId}/`, payload);
            fetchTaskDetail(); // Refresh task details after assignment
            setSelectedUsers([]); // Clear the selected users
        } catch (error) {
            console.error("Failed to assign users", error);
        }
    };

    const handleRemoveSelectedUsers = async () => {
        if (selectedUsers.length === 0) {
            alert("No users selected to remove.");
            return;
        }
    
        try {
            const payload = {
                assigned_users: selectedUsers,
                action: 'remove'
            };

            console.log("Payload being sent for removal:", payload); // Debugging
    
            const response = await axiosInstance.patch(`/tasks/${taskId}/`, payload);
            console.log("PATCH request response:", response.data);
            fetchTaskDetail(); // Refresh task details after removal
            setSelectedUsers([]); // Clear the selected users
        } catch (error) {
            console.error("Failed to remove selected users", error);
        }
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
                const response = await axiosInstance.post(`/tasks/${taskId}/remove-user/`);
                navigate('/tasks');  // Redirect to task list after removal
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

    const handleUserSelection = (selectedOptions) => {
        const selectedUserIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setSelectedUsers(selectedUserIds); // Set selected users by their IDs
    };

    if (!task) {
        return <p>Loading task details...</p>;
    }

    const isTaskCreator = task.created_by === user().email;
    const isAssignedUser = task.assigned_users.some((assignedUser) => assignedUser.id === user_id);

    return (
        <section className="min-h-screen flex flex-col mt-20">
            <div className="container mx-auto flex-grow grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Task Details Section */}
                <div className="md:col-span-2 bg-white shadow-md rounded-lg p-6">
                    {!isEditMode ? (
                        <>
                            <h1 className="text-3xl font-bold mb-4">{task.title}</h1>
                            <p className="text-gray-600 mb-4">{task.description || "No description provided."}</p>
                            <p className="mb-2">
                                <strong>Status:</strong>{" "}
                                <span className={getStatusClass(task.status)}>
                                    {task.status.replace("_", " ")}
                                </span>
                            </p>
                            <p>
                                <strong>Due Date:</strong> {task.due_date || "N/A"}
                            </p>

                            {/* Buttons */}
                            {isTaskCreator && (
                                <div className="flex space-x-4 mt-6">
                                    <button className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600" onClick={handleDeleteTask}>
                                        Delete Task
                                    </button>
                                    <button
                                        className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600"
                                        onClick={toggleEditMode}
                                    >
                                        Edit Task
                                    </button>
                                    <button
                                        className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600"
                                        onClick={() => document.getElementById('assignUsersForm').classList.toggle('hidden')}
                                    >
                                        Assign Users
                                    </button>
                                </div>
                            )}

                            {!isTaskCreator && isAssignedUser && (
                                <button className="mt-6 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600" onClick={handleRemoveAssignment}>
                                    Remove Assignment
                                </button>
                            )}

                            <div id="assignUsersForm" className="hidden mt-6">
                                <h3 className="text-xl font-bold mb-4">Assign Users to Task</h3>
                                <form onSubmit={handleAssignUsers}>
                                    {/* Replace the select with react-select */}
                                    <Select
                                        isMulti
                                        options={allUsers.map(user => ({
                                            value: user.id,
                                            label: `${user.full_name} (${user.username})`
                                        }))}
                                        onChange={handleUserSelection}
                                        value={selectedUsers.map(userId => {
                                            const user = allUsers.find(user => user.id === userId);
                                            return { value: userId, label: `${user.full_name} (${user.username})` };
                                        })}
                                    />
                                    <button
                                        type="submit"
                                        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                                    >
                                        Assign Users
                                    </button>
                                    <button
                                        type="button"
                                        className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                                        onClick={handleRemoveSelectedUsers}
                                    >
                                        Remove Users
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                            <h3 className="text-2xl font-bold mb-4">Edit Task</h3>
                            <form onSubmit={handleEditSubmit}>
                                <div className="mb-4">
                                    <label className="block text-lg font-medium">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={editedTask.title}
                                        onChange={handleEditChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-lg font-medium">Description</label>
                                    <textarea
                                        name="description"
                                        value={editedTask.description}
                                        onChange={handleEditChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                    ></textarea>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-lg font-medium">Status</label>
                                    <select
                                        name="status"
                                        value={editedTask.status}
                                        onChange={handleEditChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                    >
                                        <option value="todo">To Do</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-lg font-medium">Due Date</label>
                                    <input
                                        type="date"
                                        name="due_date"
                                        value={editedTask.due_date}
                                        onChange={handleEditChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                </div>
                                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    className="ml-4 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                                    onClick={toggleEditMode}
                                >
                                    Cancel
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Comments Section */}
                    <div className="mt-6">
                        <h2 className="text-2xl font-bold">Comments</h2>
                        {comments.length > 0 ? (
                            <ul className="space-y-4 mt-4">
                                {comments.map((comment) => (
                                    <li key={comment.id} className="bg-gray-100 p-4 rounded-md shadow-sm">
                                        <p>{comment.content}</p>
                                        <small className="text-gray-500">
                                            - {comment.user} on {new Date(comment.created_at).toLocaleString()}
                                        </small>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 mt-4">No comments available.</p>
                        )}
                    </div>

                    {/* Comment Form */}
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
                            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                                Submit Comment
                            </button>
                        </form>
                    </div>
                </div>

                {/* Assigned Users Section */}
                <div className="bg-gray-50 shadow-lg rounded-lg p-6">
                    <h5 className="text-xl font-semibold mb-4">Assigned Users</h5>
                    {task.assigned_users.length > 0 ? (
                        <ul className="space-y-4">
                            {task.assigned_users.map((user) => (
                                <li key={user.id} className="bg-white p-4 rounded-md shadow-md">
                                    <strong>{user.full_name || "No name available"}</strong>{" "}
                                    <span className="text-gray-500">({user.username || "No username"})</span>
                                    <br />
                                    <small className="text-gray-400">{user.email || "No email"}</small>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No users assigned to this task.</p>
                    )}
                </div>
            </div>
        </section>
    );
}

function getStatusClass(status) {
    switch (status) {
        case "todo":
            return "text-gray-400";  // Tailwind class for gray
        case "in_progress":
            return "text-yellow-500";  // Tailwind class for yellow
        case "completed":
            return "text-green-500";  // Tailwind class for green
        default:
            return "text-gray-200";  // Default case
    }
}

export default TaskDetail;
