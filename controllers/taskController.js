const asyncHandler = require('express-async-handler');
const pool = require('../config/db');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Public
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await pool.query('SELECT * FROM tasks ORDER BY id ASC');
  res.status(200).json(tasks.rows);
});

// @desc    Get a task
// @route   GET /api/tasks/:id
// @access  Public
const getTask = asyncHandler(async (req, res) => {
  const task = await pool.query('SELECT * FROM tasks WHERE id = $1', [
    req.params.id,
  ]);
  if (task.rows.length === 0) {
    res.status(404);
    throw new Error('Task not found');
  }
  res.status(200).json(task.rows[0]);
});

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { task } = req.body;
  const newTask = await pool.query(
    'INSERT INTO tasks (task) VALUES ($1) RETURNING *',
    [task]
  );
  res.status(201).json(newTask.rows[0]);
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const { task } = req.body;
  const updatedTask = await pool.query(
    'UPDATE tasks SET task = $1 WHERE id = $2 RETURNING *',
    [task, req.params.id]
  );
  if (updatedTask.rows.length === 0) {
    res.status(404);
    throw new Error('Task not found');
  }
  res.status(200).json(updatedTask.rows[0]);
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const deletedTask = await pool.query('DELETE FROM tasks WHERE id = $1', [
    req.params.id,
  ]);
  if (deletedTask.rowCount === 0) {
    res.status(404);
    throw new Error('Task not found');
  }
  res.status(200).json({ message: 'Task deleted' });
});

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
}
