import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";

const Column = ({ column, tasks }) => {
  return (
    <div className="bg-white p-4 rounded shadow-md w-1/3">
      <h2 className="text-lg font-bold text-gray-700 mb-3">{column.title}</h2>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2 min-h-[100px] bg-gray-50 p-2 rounded"
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="p-2 bg-blue-100 rounded shadow-sm"
                  >
                    {task.content}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
