import React, { useContext, useEffect, useState } from 'react';
import FullCalendar, { EventApi, DateSelectArg, EventClickArg, EventContentArg, formatDate } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'
import { EventInput } from '@fullcalendar/react';
import axios from '../Axios'
import styled from 'styled-components';
import { UserContext } from '../UserContext'
import { isConstructorDeclaration } from 'typescript';
import Popup from '../components/Popup';
import ActivityInformation from '../components/ActivityComponents/ActivityInformation';
import Activity from '../interfaces/Activity';

const CalendarContainer = styled.div`
  --fc-button-bg-color: #f44336;
  --fc-button-active-bg-color: #f44336;
  --fc-button-hover-bg-color:  #f66055;
  --fc-today-bg-color:#fde9e7;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  --fc-event-font-size:50px;
`;

const todayStr = new Date().toISOString().replace(/T.*$/, '')



const Calender = () => {
  const { user } = useContext(UserContext);
  const [activities, setActivities] = useState<EventInput[]>([]);
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const getMyActivities = () => {
    const url = `/user/1780489954/activity`;
    const activityIds: string[] = [];
    console.log(url)
    axios.get(url).then((response) => {
      activityIds.push(response.data.activityIds);
      console.log(activityIds);
    }).catch((error) => {
      console.log('error' + error.message)
    })
  }

  useEffect(() => {
    const url = '/activity'
    axios.get(url).then((response) => {
      console.log(response)
      response.data.activity.forEach((activity: any) => {
        const date = new Date(activity.time)
        const curr_date = date.getDate();
        const curr_month = (date.getMonth() + 1) >= 10 ? (date.getMonth()) : '0' + (date.getMonth() + 1);
        const curr_year = date.getFullYear();
        const curr_hour = date.getHours() - 2;
        const curr_minutes = date.getMinutes() == 0 ? (date.getMinutes() + '0') : date.getMinutes();
        const curr_seconds = date.getSeconds() == 0 ? (date.getSeconds() + '0') : date.getSeconds();
        const formattedDate = curr_year + "-" + curr_month + "-" + curr_date + "T" + curr_hour + ":" + curr_minutes + ":" + curr_seconds;
        const formattedEnd = curr_year + "-" + curr_month + "-" + curr_date + "T" + (curr_hour + 2) + ":" + curr_minutes + ":" + curr_seconds;
        setActivities(activities => [...activities, {
          ID: activity.activityId,
          title: activity.title,
          start: formattedDate,
          end: formattedEnd,
          backgroundColor: formattedDate > todayStr ? '#f44336' : '#f66055'
        }])
      })
    }).catch((error: any) => {
      console.log('error' + error.message)
    })
    console.log(activities)
  }, []);


  const handleOnClick = (activity: EventInput) => {
    const activityID = activity.event.extendedProps.ID
    const url = `/activity/${activityID}`
    axios.get(url).then(response => {
      console.log(response.data)
    }).catch(error => {
      console.log('Kunne ikke hente aktivitet: ' + error.message)
    })


  }

  return (
    <CalendarContainer>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        height='750px'
        initialView="timeGridWeek"
        editable={false}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        allDaySlot={false}
        locale={'en-GB'}
        displayEventEnd={true}
        buttonText={{
          today: 'I dag',
          month: 'Måned',
          week: 'Uke',
          day: 'Dag',
        }}
        slotEventOverlap={false}
        eventDisplay={'block'}
        progressiveEventRendering={true}
        events={activities}
        firstDay={1}
        dayHeaderFormat={{ weekday: 'short', month: 'numeric', day: 'numeric', omitCommas: true, hour12: false }}
        slotLabelFormat={{
          hour12: false,
          hour: 'numeric',
          minute: '2-digit',
          omitZeroMinute: false,
          meridiem: 'short'
        }}
        eventClick={handleOnClick}
      />
  </CalendarContainer>
  )
}

export default Calender;
