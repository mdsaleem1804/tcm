import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Header from "../Header";
import Footer from "../Footer";
import Helper from "../../Common/Helper";
import axios from "axios";
export default class ShowAppointment extends React.Component {
  state = {
    appointments: [],
  };
  /*constructor(props) {
    super(props);
  }*/
  handleEventClick = (clickInfo) => {
    //console.log(clickInfo.event.id);
    //this.props.history.push("DiagnosisEntry");
    localStorage.setItem("appointmentID", clickInfo.event.id);
    this.props.history.push({
      pathname: "/DiagnosisEntry",
      appointmentID: clickInfo.event.id,
    });
  };

  componentDidMount() {
    const empCode = localStorage.getItem("staffCode");
    axios
      .post(Helper.getUrl() + "tcmAppointments", {
        empCode: empCode,
      })
      .then((result) => {
        if (result.data.success) {
          this.setState({ appointments: result.data.result });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  render() {
    const calendarEvents = [];
    for (var i = 0; i < this.state.appointments.length; i++) {
      calendarEvents.push({
        id: this.state.appointments[i].appointmentID,
        start: this.state.appointments[i].startTime,
        end: this.state.appointments[i].endTime,
        title: this.state.appointments[i].subject,
        color:
          this.state.appointments[i].apptStatus === "Booking"
            ? "lightblue"
            : this.state.appointments[i].apptStatus === "Confirm"
            ? "#62E741"
            : "#8080FF",
      });
      // console.log(this.state.appointments);
    }

    return (
      <div style={{ paddingBottom: "50px" }}>
        <Header />
        <h4>{localStorage.getItem("fullName")}</h4>
        <div
          style={{
            width: "100%",
            height: "800px",
            overflow: "scroll",
          }}
        >
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            //initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            allDaySlot={false}
            initialView="timeGrid"
            events={calendarEvents}
            weekends={true}
            weekText={false}
            expandRows={true}
            eventClick={this.handleEventClick}
            slotMinTime={"09:00:00"}
            slotMaxTime={"22:00:00"}
            eventTextColor="black"
          />
        </div>
        <Footer />
      </div>
    );
  }
}
