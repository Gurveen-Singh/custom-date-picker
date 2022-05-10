import React from "react";
import "./App.css";
import Calendar from "./components/calendar/calendar";

function onChange(timestamp) {
  console.log(timestamp);
}

function App() {
  return (
    <div className="App">
      <Calendar onChange={onChange} />
    </div>
  );
}

export default App;
