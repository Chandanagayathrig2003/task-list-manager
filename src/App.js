// Import necessary libraries
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'; // For custom styles

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch initial tasks
    axios.get('https://jsonplaceholder.typicode.com/todos')
      .then((response) => {
        const fetchedTasks = response.data.slice(0, 20).map(task => ({
          id: task.id,
          title: task.title,
          description: `Description for task ${task.id}`, // Placeholder descriptions
          status: task.completed ? 'Done' : 'To Do',
        }));
        setTasks(fetchedTasks);
      })
      .catch(() => toast.error('Failed to load tasks'));
  }, []);

  useEffect(() => {
    // Initialize Tabulator table
    const table = new Tabulator("#task-table", {
      data: tasks,
      layout: "fitColumns",
      columns: [
        { title: "ID", field: "id", width: 50 },
        { title: "Title", field: "title", editor: "input" },
        { title: "Description", field: "description", editor: "input" },
        {
          title: "Status",
          field: "status",
          editor: "select",
          editorParams: { values: ["To Do", "In Progress", "Done"] },
        },
        {
          title: "Actions",
          formatter: () => "<button class='delete-btn'>Delete</button>",
          width: 100,
          cellClick: (e, cell) => handleDelete(cell.getRow().getData().id),
        },
      ],
    });

    return () => table.destroy(); // Cleanup
  }, [tasks]);

  const handleAddTask = (event) => {
    event.preventDefault();
    const newTask = {
      id: tasks.length + 1,
      title: event.target.title.value,
      description: event.target.description.value,
      status: event.target.status.value,
    };
    setTasks([...tasks, newTask]);
    toast.success('Task added successfully');
    event.target.reset();
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success('Task deleted successfully');
  };

  const filteredTasks = tasks.filter(task => {
    return (
      (!filterStatus || task.status === filterStatus) &&
      (task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       task.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="App">
      <h1>Task List Manager</h1>

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="add-task-form">
        <input name="title" placeholder="Title" required className="input-field" />
        <input name="description" placeholder="Description" required className="input-field" />
        <select name="status" required className="input-field">
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <button type="submit" className="btn-primary">Add Task</button>
      </form>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Title or Description"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      {/* Filter Dropdown */}
      <select
        onChange={(e) => setFilterStatus(e.target.value)}
        className="filter-dropdown"
      >
        <option value="">All</option>
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>

      {/* Task Table */}
      <div id="task-table"></div>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default App;
