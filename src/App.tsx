import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header/header.index';
import TodoList from './components/Todos/TodoList/todos.index';


function App() {
  return (
    <div>
      <Header/>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<TodoList/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
