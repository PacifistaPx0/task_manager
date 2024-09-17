import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxios from "../../utils/useAxios";
import { FaCheckCircle, FaHourglassHalf, FaClipboardList } from "react-icons/fa";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState(""); // State for status filter
  const [createdBy, setCreatedBy] = useState(""); // State for created by filter

  const axiosInstance = useAxios();

  const fetchTaskData = (filters = {}) => {
    axiosInstance
      .get("tasks/", { params: filters }) // Pass the filters as query parameters
      .then((res) => {
        setTasks(res.data);
      })
      .catch((error) => {
        console.error("Failed to fetch tasks", error);
      });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    // Apply filters when user submits
    const filters = {
      status: status || undefined,
      created_by: createdBy || undefined,
    };
    fetchTaskData(filters);
  };

  useEffect(() => {
    fetchTaskData(); // Fetch all tasks on initial render
  }, []);

  return (
    <>
      {/* Task List Section */}
      <section className="min-h-screen flex flex-col mt-20">
        <div className="container mx-auto flex-grow my-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Your Tasks</h1>
            <p className="text-lg text-gray-600 mt-2">Manage and track your tasks below.</p>

            {/* Create Task Button */}
            {tasks.length > 0 && (
              <Link
                to="/create-task"
                className="mt-6 inline-block bg-teal-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-teal-600 transition duration-300"
              >
                Create a Task
              </Link>
            )}
          </div>

          {/* Filter Form */}
          <form className="mb-8 flex space-x-4 justify-center" onSubmit={handleFilterSubmit}>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border p-2 rounded-lg"
            >
              <option value="">All Status</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <input
              type="text"
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
              className="border p-2 rounded-lg"
              placeholder="Created By"
            />

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Apply Filters
            </button>
          </form>

          {/* Task Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <Link
                  key={task.id}
                  to={`/tasks/${task.id}`}
                  className="block bg-white p-6 shadow-lg rounded-lg hover:shadow-xl transition duration-300"
                >
                  <h5 className="text-xl font-bold text-gray-900 mb-2">{task.title}</h5>
                  <p className="text-gray-500 mb-4">
                    {task.description || "No description provided."}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Due: {task.due_date || "N/A"}</span>
                    {getStatusIcon(task.status)}
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-gray-600">
                No tasks available.
                <Link
                  to="/create-task"
                  className="ml-2 inline-block bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 transition duration-300"
                >
                  Create a Task
                </Link>
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
