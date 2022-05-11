import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./calendar.css";

/* Getting the current timestamp. */
let oneDay = 60 * 60 * 24 * 1000;
let todayTimestamp =
  Date.now() -
  (Date.now() % oneDay) +
  new Date().getTimezoneOffset() * 1000 * 60;

/* Creating a reference to the input element. */
let inputRef = React.createRef();
export default class Calendar extends Component {
  /* A state variable. */
  state = {
    getMonthDetails: [],
  };

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   */
  constructor() {
    super();
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    this.state = {
      year,
      month,
      selectedDay: todayTimestamp,
      monthDetails: this.getMonthDetails(year, month),
    };
  }

  /**
   * When the component mounts, add an event listener to the window that listens for a click and then
   * calls the addBackDrop function. Then, set the date to the input.
   */
  componentDidMount() {
    window.addEventListener("click", this.addBackDrop);
    this.setDateToInput(this.state.selectedDay);
  }

  /**
   * When the component is unmounted, remove the event listener that was added to the window object.
   */
  componentWillUnmount() {
    window.removeEventListener("click", this.addBackDrop);
  }

  /* This is a function that is called when the user clicks on the window. It checks if the date picker
is open and if the user clicked outside of the date picker. If so, it closes the date picker. */
  addBackDrop = (e) => {
    if (
      this.state.showDatePicker &&
      !ReactDOM.findDOMNode(this).contains(e.target)
    ) {
      this.showDatePicker(false);
    }
  };

  /* This is a function that is called when the user clicks on the window. It checks if the date picker
is open and if the user clicked outside of the date picker. If so, it closes the date picker. */
  showDatePicker = (showDatePicker = true) => {
    this.setState({ showDatePicker });
  };

  /* Creating an array of the days of the week. */
  daysMap = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  /* Creating an array of the months of the year. */
  monthMap = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  /* Getting the details of the day. */
  getDayDetails = (args) => {
    let date = args.index - args.firstDay;
    let day = args.index % 7;
    let prevMonth = args.month - 1;
    let prevYear = args.year;
    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear--;
    }
    let prevMonthNumberOfDays = this.getNumberOfDays(prevYear, prevMonth);
    let _date =
      (date < 0 ? prevMonthNumberOfDays + date : date % args.numberOfDays) + 1;
    let month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0;
    let timestamp = new Date(args.year, args.month, _date).getTime();

    return {
      date: _date,
      day,
      month,
      timestamp,
      dayString: this.daysMap[day],
    };
  };

  /* This is a function that returns the number of days in a month. */
  getNumberOfDays = (year, month) => {
    return 32 - new Date(year, month, 32).getDate();
  };

  /* Creating a calendar for the month. */
  getMonthDetails = (year, month) => {
    let firstDay = new Date(year, month).getDay();
    let numberOfDays = this.getNumberOfDays(year, month);
    let monthArray = [];
    let rows = 6;
    let currentDay = null;
    let index = 0;
    let cols = 7;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        currentDay = this.getDayDetails({
          index,
          numberOfDays,
          firstDay,
          year,
          month,
        });
        monthArray.push(currentDay);
        index++;
      }
    }
    return monthArray;
  };

  /* Checking if the day is the current day. */
  isCurrentDay = (day) => {
    return day.timestamp === todayTimestamp;
  };

  /* Checking if the day is the selected day. */
  isSelectedDay = (day) => {
    return day.timestamp === this.state.selectedDay;
  };

  /* This is a function that takes a date string and returns an object with the year, month, and date. */
  getDateFromDateString = (dateValue) => {
    let dateData = dateValue.split("-").map((d) => parseInt(d));
    if (dateData.length < 3) return null;

    let year = dateData[0];
    let month = dateData[1];
    let date = dateData[2];
    return { year, month, date };
  };

  /* This is a function that takes a month number and returns the month string. */
  getMonthStr = (month) =>
    this.monthMap[Math.max(Math.min(11, month), 0)] || "Month";

  /* This is a function that takes a timestamp and returns a date string. */
  getDateStringFromTimestamp = (timestamp) => {
    let dateObject = new Date(timestamp);
    let month = dateObject.getMonth() + 1;
    let date = dateObject.getDate();
    return (
      dateObject.getFullYear() +
      "-" +
      (month < 10 ? "0" + month : month) +
      "-" +
      (date < 10 ? "0" + date : date)
    );
  };

  /* This is a function that takes a date object and sets the selected day to the timestamp of the date. */
  setDate = (dateData) => {
    let selectedDay = new Date(
      dateData.year,
      dateData.month - 1,
      dateData.date
    ).getTime();
    this.setState({ selectedDay });
    if (this.props.onChange) {
      this.props.onChange(selectedDay);
    }
  };

  /* This is a function that takes the value of the input and sets the date to the date picker. */
  updateDateFromInput = () => {
    let dateValue = inputRef.current.value;
    let dateData = this.getDateFromDateString(dateValue);
    if (dateData !== null) {
      this.setDate(dateData);
      this.setState({
        year: dateData.year,
        month: dateData.month - 1,
        monthDetails: this.getMonthDetails(dateData.year, dateData.month - 1),
      });
    }
  };

  /* This is a function that takes a timestamp and sets the value of the input to the date string. */
  setDateToInput = (timestamp) => {
    let dateString = this.getDateStringFromTimestamp(timestamp);
    inputRef.current.value = dateString;
  };

  /* This is a function that is called when the user clicks on a date. It sets the selected day to the
timestamp of the day that was clicked. Then, it calls the setDateToInput function and passes the
timestamp of the day that was clicked. Finally, it checks if the onChange prop is defined and if so,
it calls the onChange function and passes the timestamp of the day that was clicked. */
  onDateClick = (day) => {
    this.setState({ selectedDay: day.timestamp }, () =>
      this.setDateToInput(day.timestamp)
    );
    if (this.props.onChange) {
      this.props.onChange(day.timestamp);
    }
  };

  /* This is a function that takes an offset and sets the year to the current year plus the offset. Then,
it sets the month to the current month. Finally, it sets the state to the year and the month
details. */
  setYear = (offset) => {
    let year = this.state.year + offset;
    let month = this.state.month;
    this.setState({
      year,
      monthDetails: this.getMonthDetails(year, month),
    });
  };

  /* This is a function that takes an offset and sets the month to the current month plus the offset.
Then, it sets the year to the current year. Finally, it sets the state to the year, the month, and
the month details. */
  setMonth = (offset) => {
    let year = this.state.year;
    let month = this.state.month + offset;
    if (month === -1) {
      month = 11;
      year--;
    } else if (month === 12) {
      month = 0;
      year++;
    }
    this.setState({
      year,
      month,
      monthDetails: this.getMonthDetails(year, month),
    });
  };

  /* Rendering the calendar Body. */
  renderCalendar() {
    let days = this.state.monthDetails.map((day, index) => {
      return (
        <div
          className={
            "c-day-container " +
            (day.month !== 0 ? " disabled" : "") +
            (this.isCurrentDay(day) ? " highlight" : "") +
            (this.isSelectedDay(day) ? " highlight-green" : "")
          }
          key={index}
        >
          <div className="cdc-day">
            <span onClick={() => this.onDateClick(day)}>{day.date}</span>
          </div>
        </div>
      );
    });

    return (
      <div className="c-container">
        <div className="cc-head">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d, i) => (
            <div key={i} className="cch-name">
              {d}
            </div>
          ))}
        </div>
        <div className="cc-body">{days}</div>
      </div>
    );
  }

  render() {
    return (
      <div className="MyDatePicker">
        <div className="mdp-input" onClick={() => this.showDatePicker(true)}>
          <input
            type="date"
            onChange={this.updateDateFromInput}
            ref={inputRef}
          />
        </div>
        {this.state.showDatePicker ? (
          <div className="mdp-container">
            <div className="mdpc-head">
              <div className="mdpch-button">
                <div className="mdpchb-inner" onClick={() => this.setYear(-1)}>
                  <span className="mdpchbi-left-arrows"></span>
                </div>
              </div>
              <div className="mdpch-button">
                <div className="mdpchb-inner" onClick={() => this.setMonth(-1)}>
                  <span className="mdpchbi-left-arrow"></span>
                </div>
              </div>
              <div className="mdpch-container">
                <div className="mdpchc-year">{this.state.year}</div>
                <div className="mdpchc-month">
                  {this.getMonthStr(this.state.month)}
                </div>
              </div>
              <div className="mdpch-button">
                <div className="mdpchb-inner" onClick={() => this.setMonth(1)}>
                  <span className="mdpchbi-right-arrow"></span>
                </div>
              </div>
              <div className="mdpch-button" onClick={() => this.setYear(1)}>
                <div className="mdpchb-inner">
                  <span className="mdpchbi-right-arrows"></span>
                </div>
              </div>
            </div>
            <div className="mdpc-body">{this.renderCalendar()}</div>
          </div>
        ) : null}
      </div>
    );
  }
}
