import React, { Component } from "react";
import "./App.css";

import Calendar from "./components/calendar/calendar";

const style = {
  position: "relative",
  margin: "50px auto",
};

class App extends Component {
  onDayClick = (e, day) => {
    console.log("day: ", day);
  };

  render() {
    return (
      <div className="App">
        <Calendar
          style={style}
          width="302px"
          onDayClick={(e, day) => this.onDayClick(e, day)}
        />
      </div>
    );
  }
}

export default App;
