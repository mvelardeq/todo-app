import { Fragment, useEffect, useState } from "react";
import "./App.css";
import { useLocalStorage } from "./hooks/useLocalStorage";

import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

function App() {
  const defaultDarkTheme = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const defaultTheme = () => {
    if (window.localStorage.getItem("theme")) {
      return window.localStorage.getItem("theme");
    } else {
      return defaultDarkTheme ? "dark" : "light";
    }
  };

  const [theme, setTheme] = useLocalStorage("theme", defaultTheme());

  useEffect(() => {
    document.documentElement.classList.add(theme);
  }, []);

  const onChangeTheme = () => {
    const newTheme = theme == "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.removeAttribute("class");
    document.documentElement.classList.add(newTheme);
  };

  const onOver = (e) => {
    e.currentTarget.querySelector(".cross").classList.toggle("hidden");
    e.currentTarget
      .querySelector(".checked-symbol")
      .classList.remove("border-gray-200");
    e.currentTarget
      .querySelector(".checked-symbol")
      .classList.add("border-purple-300");
  };
  const onOut = (e) => {
    e.currentTarget.querySelector(".cross").classList.toggle("hidden");
    e.currentTarget
      .querySelector(".checked-symbol")
      .classList.add("border-gray-200");
    e.currentTarget
      .querySelector(".checked-symbol")
      .classList.remove("border-purple-300");
  };

  const [inputTask, setInputTask] = useState({
    task: "",
  });
  const { task } = inputTask;
  const onInputForm = ({ target }) => {
    setInputTask({ ...inputTask, [target.name]: target.value });
  };

  const [tasks, setTasks] = useState([]);
  const onSendForm = (e) => {
    e.preventDefault();
    if (e.target.task.value === "") return;
    setTasks([
      ...tasks,
      { task: e.target.task.value, state: false, id: new Date().getTime() },
    ]);
    setInputTask({ task: "" });
  };

  const leftItems = (tasks) => {
    return tasks.filter((task) => task.state == false).length;
  };

  const [showTasks, setShowTasks] = useState(tasks);
  const [modeShow, setModeShow] = useState("all");

  useEffect(() => {
    setShowTasks(tasks);
  }, [tasks]);

  const selectAll = (tasks) => {
    const newarr = tasks;
    setShowTasks(newarr);
    setModeShow("all");
  };
  const selectActives = (tasks) => {
    const activeTasks = tasks.filter((task) => task.state == false);
    setShowTasks(activeTasks);
    setModeShow("active");
  };
  const selectCompleted = (tasks) => {
    const completedTasks = tasks.filter((task) => task.state == true);
    setShowTasks(completedTasks);
    setModeShow("completed");
  };
  const removeCompletedTask = (tasks) => {
    const activeTasks = tasks.filter((task) => task.state == false);
    setTasks(activeTasks);
    setShowTasks(activeTasks);
    setModeShow("all");
  };

  const reorder = (list,startIndex,endIndex) =>{
    const result = [...list];
    const [removed] = result.splice(startIndex,1);
    result.splice(endIndex,0,removed);
    return result;
  }

  const onChangeStateTask = (task) => {
    const newTasks = tasks.map((item) =>
      item.id == task.id
        ? { id: task.id, state: !task.state, task: task.task }
        : item
    );
    setTasks(newTasks);
  };
  const onDeleteTask = (task) => {
    const newTasks = tasks.filter((item) => item.id !== task.id);
    setTasks(newTasks);
  };

  return (
    <>
      <DragDropContext
        onDragEnd={(result) => {
          const { source, destination } = result;
          if(!destination){
            return
          }
          if(source.index === destination.index && source.droppableId == destination.droppableId){
            return
          }
          setShowTasks((prevTasks)=> reorder(prevTasks,source.index,destination.index))
          setTasks((prevTasks)=> reorder(prevTasks,source.index,destination.index))
        }}
      >
        <div className="min-w-full min-h-screen mx-auto bg-bg-main-light dark:bg-bg-main-dark static grid place-items-center">
          <img
            src="./assets/images/bg-desktop-dark.jpg"
            alt="background images"
            className="absolute top-0 left-0 h-80 w-full object-cover"
          />
          <div className="w-11/12 max-w-screen-sm relative  mx-auto pt-5">
            <div className="title flex justify-between items-center mb-12">
              <h1 className="text-bg-cards-light uppercase text-5xl">Todo</h1>
              {theme === "light" ? (
                <img
                  src="./assets/images/icon-moon.svg"
                  alt=""
                  className="w-8 h-8 hover:cursor-pointer"
                  onClick={onChangeTheme}
                />
              ) : (
                <img
                  src="./assets/images/icon-sun.svg"
                  alt=""
                  className="w-8 h-8 hover:cursor-pointer"
                  onClick={onChangeTheme}
                />
              )}
            </div>
            <div className="card-title bg-bg-cards-light dark:bg-bg-cards-dark p-5 rounded-md mb-6">
              <form className="input-checkbox flex" onSubmit={onSendForm}>
                <div className="mr-4 check-container rounded-full w-6 h-6 grid place-items-center border-2 border-gray-300"></div>
                <input
                  type="text"
                  placeholder="Create a new todo..."
                  className="bg-inherit focus:outline-none focus:dark:bg-bg-cards-dark dark:text-task-dark "
                  name="task"
                  onChange={onInputForm}
                  value={task}
                  autoComplete="off"
                />
              </form>
            </div>
            <Droppable droppableId="task">
              {(droppableProvided) => (
                <div
                  {...droppableProvided.droppableProps}
                  ref={droppableProvided.innerRef}
                  className={`card-title bg-bg-cards-light dark:bg-bg-cards-dark rounded-md mb-6 flex flex-col ${
                    tasks.length > 0 ? "" : "hidden"
                  }`}
                >
                  {showTasks.map((task, index) => {
                    return (
                      <Draggable
                        key={task.id}
                        draggableId={`${task.id}`}
                        index={index}
                      >
                        {(draggableProvided) => (
                          <div
                            {...draggableProvided.draggableProps}
                            ref={draggableProvided.innerRef}
                            {...draggableProvided.dragHandleProps}
                          >
                            <div
                              className="py-5 input-checkbox flex items-center px-5"
                              onMouseOver={onOver}
                              onMouseOut={onOut}
                            >
                              <div
                                className={`hover:cursor-pointer checked-symbol mr-4 check-container rounded-full w-6 h-6 grid place-items-center border-2 border-gray-200 ${
                                  task.state
                                    ? "border-0 bg-gradient-to-tl from-gradient2 to-gradient1"
                                    : ""
                                }`}
                                onClick={() => onChangeStateTask(task)}
                              >
                                {task.state && (
                                  <img
                                    src="./assets/images/icon-check.svg"
                                    alt=""
                                    className="h-1/2"
                                  />
                                )}
                              </div>
                              <p
                                className={`flex-auto hover:cursor-pointer ${
                                  task.state
                                    ? "line-through text-task-completed-light"
                                    : "text-all-link-light dark:text-task-dark"
                                }`}
                                onClick={() => onChangeStateTask(task)}
                              >
                                {task.task}
                              </p>
                              <img
                                src="./assets/images/icon-cross.svg"
                                alt=""
                                className="cross ml-auto hidden hover:cursor-pointer"
                                onClick={() => onDeleteTask(task)}
                              />
                            </div>
                            <hr className="dark:border-1 dark:border-slate-500" />
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {droppableProvided.placeholder}

                  <div className="px-5 py-3 flex justify-between items-center">
                    <div>
                      <p className="text-task-light text-sm">
                        {" "}
                        {leftItems(tasks)} Items left
                      </p>
                    </div>
                    <div className="flex gap-3 text-task-light">
                      <div
                        className={`${
                          modeShow == "all" ? "text-bright-blue" : ""
                        } hover:cursor-pointer dark:hover:text-task-hover-dark`}
                        onClick={() => selectAll(tasks)}
                      >
                        <p className="hover:text-task-completed-dark">All</p>
                      </div>
                      <div
                        className={`${
                          modeShow == "active" ? "text-bright-blue" : ""
                        } hover:cursor-pointer`}
                        onClick={() => selectActives(tasks)}
                      >
                        <p className="hover:text-task-completed-dark">Active</p>
                      </div>
                      <div
                        className={`${
                          modeShow == "completed" ? "text-bright-blue" : ""
                        } hover:cursor-pointer`}
                        onClick={() => selectCompleted(tasks)}
                      >
                        <p className="hover:text-task-completed-dark">
                          Completed
                        </p>
                      </div>
                    </div>
                    <div
                      className="hover:cursor-pointer"
                      onClick={() => removeCompletedTask(tasks)}
                    >
                      <p className="text-task-completed-light text-sm hover:text-task-completed-dark">
                        Clear Completed
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
    </>
  );
}

export default App;
