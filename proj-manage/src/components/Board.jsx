import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";

const initialData = {
  tasks: {
    "task-1": { id: "task-1", content: "Design Homepage" },
    "task-2": { id: "task-2", content: "Fix Bugs" },
    "task-3": { id: "task-3", content: "Deploy to Production" },
    "task-4": { id: "task-4", content: "Write Documentation" },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "To Do",
      taskIds: ["task-1", "task-2"],
    },
    "column-2": {
      id: "column-2",
      title: "In Progress",
      taskIds: ["task-3"],
    },
    "column-3": {
      id: "column-3",
      title: "Done",
      taskIds: ["task-4"],
    },
  },
  columnOrder: ["column-1", "column-2", "column-3"],
};

const Board = () => {
  const [data, setData] = useState(initialData);
  const [newTaskContent, setNewTaskContent] = useState("");
  const [showTaskInput, setShowTaskInput] = useState(null); // Track which column is adding a task
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [showProjectInput, setShowProjectInput] = useState(false);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startColumn = data.columns[source.droppableId];
    const finishColumn = data.columns[destination.droppableId];

    const startTaskIds = [...startColumn.taskIds];
    startTaskIds.splice(source.index, 1);

    const finishTaskIds = [...finishColumn.taskIds];
    finishTaskIds.splice(destination.index, 0, draggableId);

    const newColumns = {
      ...data.columns,
      [startColumn.id]: {
        ...startColumn,
        taskIds: startTaskIds,
      },
      [finishColumn.id]: {
        ...finishColumn,
        taskIds: finishTaskIds,
      },
    };

    setData({ ...data, columns: newColumns });
  };

  const addNewTask = (columnId) => {
    if (!newTaskContent.trim()) return;

    const newTaskId = `task-${Object.keys(data.tasks).length + 1}`;
    const newTask = {
      id: newTaskId,
      content: newTaskContent,
    };

    const updatedTasks = { ...data.tasks, [newTaskId]: newTask };

    const updatedColumn = {
      ...data.columns[columnId],
      taskIds: [...data.columns[columnId].taskIds, newTaskId],
    };

    setData({
      ...data,
      tasks: updatedTasks,
      columns: {
        ...data.columns,
        [columnId]: updatedColumn,
      },
    });

    setNewTaskContent(""); // Reset input field
    setShowTaskInput(null); // Hide input field
  };

  const addNewProject = () => {
    if (!newProjectTitle.trim()) return;

    const newColumnId = `column-${Object.keys(data.columns).length + 1}`;
    const newColumn = {
      id: newColumnId,
      title: newProjectTitle,
      taskIds: [],
    };

    setData({
      ...data,
      columns: {
        ...data.columns,
        [newColumnId]: newColumn,
      },
      columnOrder: [...data.columnOrder, newColumnId],
    });

    setNewProjectTitle(""); // Reset project title input
    setShowProjectInput(false); // Hide input field
  };

  const deleteTask = (taskId, columnId) => {
    const updatedTasks = { ...data.tasks };
    delete updatedTasks[taskId];

    const updatedColumn = {
      ...data.columns[columnId],
      taskIds: data.columns[columnId].taskIds.filter((id) => id !== taskId),
    };

    setData({
      ...data,
      tasks: updatedTasks,
      columns: {
        ...data.columns,
        [columnId]: updatedColumn,
      },
    });
  };

  const deleteProject = (columnId) => {
    const updatedColumns = { ...data.columns };
    delete updatedColumns[columnId];

    const updatedColumnOrder = data.columnOrder.filter((id) => id !== columnId);

    setData({
      ...data,
      columns: updatedColumns,
      columnOrder: updatedColumnOrder,
    });
  };

  const editTask = (taskId, newContent) => {
    const updatedTask = {
      ...data.tasks[taskId],
      content: newContent,
    };

    setData({
      ...data,
      tasks: {
        ...data.tasks,
        [taskId]: updatedTask,
      },
    });
  };

  return (
    <div className="flex justify-center mt-10">
      <DragDropContext onDragEnd={onDragEnd}>
        {data.columnOrder.map((columnId) => {
          const column = data.columns[columnId];
          const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

          return (
            <div
              key={column.id}
              className="p-4 bg-white rounded-lg shadow-md mr-4 flex-1"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{column.title}</h2>
                <button
                  onClick={() => deleteProject(column.id)}
                  className="bg-red-500 text-white py-1 px-2 rounded"
                >
                  Delete Project
                </button>
              </div>
              <div className="mb-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-2 mb-2 bg-gray-200 rounded shadow-sm"
                  >
                    <div className="flex justify-between">
                      <span>{task.content}</span>
                      <div>
                        <button
                          onClick={() => {
                            const newContent = prompt(
                              "Edit Task:",
                              task.content
                            );
                            if (newContent) {
                              editTask(task.id, newContent);
                            }
                          }}
                          className="bg-yellow-500 text-white py-1 px-2 rounded mx-1"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTask(task.id, column.id)}
                          className="bg-red-500 text-white py-1 px-2 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {showTaskInput === column.id ? (
                <div className="flex flex-col items-center">
                  <input
                    type="text"
                    className="border p-2 rounded mb-2 w-3/4"
                    value={newTaskContent}
                    onChange={(e) => setNewTaskContent(e.target.value)}
                    placeholder="Enter task..."
                  />
                  <button
                    onClick={() => addNewTask(column.id)}
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                  >
                    Add Task
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowTaskInput(column.id)}
                  className="bg-green-500 text-white py-2 px-4 rounded w-full mt-4"
                >
                  Create New Task
                </button>
              )}
            </div>
          );
        })}

        {/* Create New Project */}
        {showProjectInput ? (
          <div className="flex flex-col items-center mt-4">
            <input
              type="text"
              className="border p-2 rounded mb-2 w-3/4"
              value={newProjectTitle}
              onChange={(e) => setNewProjectTitle(e.target.value)}
              placeholder="Enter project title..."
            />
            <button
              onClick={addNewProject}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Add Project
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowProjectInput(true)}
            className="bg-teal-500 text-white py-2 px-4 rounded mt-6"
          >
            Create New Project
          </button>
        )}
      </DragDropContext>
    </div>
  );
};

export default Board;
