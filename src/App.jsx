import { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("kanbanTasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
  });

  const columns = ["Todo", "In Progress", "Completed"];

  useEffect(() => {
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesPriority =
      priorityFilter === "All" || task.priority === priorityFilter;

    const matchesStatus =
      statusFilter === "All" || task.status === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Task title is required!");
      return;
    }

    if (editingId) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingId ? { ...task, ...formData } : task,
        ),
      );
    } else {
      const newTask = {
        id: Date.now(),
        ...formData,
        status: "Todo",
      };
      console.log("New Task:", newTask);
      setTasks((prev) => [...prev, newTask]);
    }

    closeForm();
  };

  const closeForm = () => {
    setFormData({
      title: "",
      description: "",
      priority: "Medium",
      dueDate: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
    });

    setEditingId(task.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks((prev) => prev.filter((task) => task.id !== id));
    }
  };

  const handleStatusChange = (id, status) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status } : task)),
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">TaskFlow</h1>
            <p className="mt-1 text-slate-500">
              Manage your tasks and stay productive.
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700"
          >
            + Add New Task
          </button>
        </header>

        {showForm && (
          <div className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">
              {editingId ? "Edit Task" : "Create New Task"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Task title *"
                className="w-full rounded-lg border p-3"
              />

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Task description"
                rows="3"
                className="w-full rounded-lg border p-3"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="rounded-lg border p-3"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>

                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="rounded-lg border p-3"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-5 py-3 text-white"
                >
                  {editingId ? "Update Task" : "Add Task"}
                </button>

                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg bg-slate-200 px-5 py-3"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        {/* Search and Filters */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full rounded-lg border bg-white px-4 py-3 sm:flex-1"
          />

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-lg border bg-white px-4 py-3"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border bg-white px-4 py-3"
          >
            <option value="All">All Status</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {columns.map((column) => {
            const columnTasks = filteredTasks.filter(
              (task) => task.status === column,
            );

            return (
              <section
                key={column}
                className="min-h-64 rounded-xl bg-slate-200/70 p-4"
              >
                <h2 className="mb-4 font-semibold text-slate-800">
                  {column} ({columnTasks.length})
                </h2>

                {columnTasks.length === 0 ? (
                  <div className="rounded-lg border-2 border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                    {search ||
                    priorityFilter !== "All" ||
                    statusFilter !== "All"
                      ? "No tasks found"
                      : "No tasks yet"}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {columnTasks.map((task) => (
                      <div
                        key={task.id}
                        className="rounded-lg bg-white p-4 shadow-sm"
                      >
                        <h3 className="font-semibold text-slate-800">
                          {task.title}
                        </h3>

                        <p className="my-2 text-sm text-slate-500">
                          {task.description}
                        </p>

                        <p className="text-xs text-indigo-600">
                          {task.priority} Priority
                        </p>

                        {task.dueDate && (
                          <p className="mt-2 text-xs text-slate-500">
                            Due: {task.dueDate}
                          </p>
                        )}

                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            onClick={() => handleEdit(task)}
                            className="rounded bg-blue-100 px-3 py-2 text-xs text-blue-700"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(task.id)}
                            className="rounded bg-red-100 px-3 py-2 text-xs text-red-700"
                          >
                            Delete
                          </button>
                        </div>

                        <select
                          value={task.status}
                          onChange={(e) =>
                            handleStatusChange(task.id, e.target.value)
                          }
                          className="mt-3 w-full rounded border p-2 text-sm"
                        >
                          {columns.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
