import React, { useContext, useEffect, useState } from 'react';
import FullCalendar, { EventApi, DateSelectArg, EventClickArg, EventContentArg, formatDate, triggerDateSelect } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'
import { EventInput } from '@fullcalendar/react';
import axios from '../Axios'
import styled from 'styled-components';
import { UserContext } from '../UserContext'
import Popup from '../components/Popup';
import ActivityInformation from '../components/ActivityComponents/ActivityInformation';
import ActivityResponse from '../interfaces/ActivityResponse';

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

const todayStr = new Date().toISOString().replace(/T.*$/, '') + "T" + new Date().toLocaleTimeString()



const Calender = () => {
  const { setUser, user } = useContext(UserContext);
  const [activities, setActivities] = useState<EventInput[]>([]);
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [activity, setActivity] = useState<ActivityResponse>({
    activityId: 0,
    activityLevel: 'MEDIUM',
    capacity: 0,
    daysToRepeat: 0,
    description: 'test',
    equipments: [],
    groupId: 0,
    image: '',
    latitude: 0,
    longitude: 0,
    registeredParticipants: [],
    tags: 'SII',
    time: 1618924200000,
    timeCreated: 1618830691000,
    title: 'Test',
    user: 1231323
  }
  );

  const getMyActivities = () => {
    const url = `/user/${user}/activity`;
    axios.get(url).then((response) => {
      console.log(response.data);
    }).catch((error) => {
      console.log('error' + error.message)
    })
  }

  useEffect(() => {
    const url = '/activity'
    axios.get(url).then((response) => {
      console.log(response.data['activities'])
      response.data['activities'].forEach((activity: any) => {
        const date = new Date(activity.time)
        const curr_date = date.getDate();
        const curr_month = (date.getMonth() + 1) >= 10 ? (date.getMonth()) : '0' + (date.getMonth() + 1);
        const curr_year = date.getFullYear();
        const curr_hour = (date.getHours() - 2) < 10 ? ('0' + (date.getHours() - 2)) : (date.getHours() - 2);
        const curr_minutes = date.getMinutes() == 0 ? (date.getMinutes() + '0') : date.getMinutes();
        const curr_seconds = date.getSeconds() == 0 ? (date.getSeconds() + '0') : date.getSeconds();
        const formattedDate = curr_year + "-" + curr_month + "-" + curr_date + "T" + curr_hour + ":" + curr_minutes + ":" + curr_seconds;
        const formattedEnd = curr_year + "-" + curr_month + "-" + curr_date + "T" + (curr_hour) + ":" + curr_minutes + ":" + curr_seconds;
        setActivities(activities => [...activities, {
          ID: activity.activityId,
          title: activity.title,
          start: formattedDate,
          end: formattedEnd,
          formattedDate: formattedDate,
          backgroundColor: formattedDate > todayStr ? '#f44336' : '#f66055'
        }])
      })
    }).catch((error: any) => {
      console.log('error' + error.message)
    })
  }, []);


  const handleOnClick = (eventInfo: EventInput) => {
    console.log(activities)
    const activityID = eventInfo.event.extendedProps.ID
    const url = `/activity/${activityID}`
    axios.get(url).then(response => {
      setActivity(response.data)
      setOpenPopup(!openPopup)
    }).catch(error => {
      console.log('Kunne ikke hente aktivitet: ' + error.message)
    })
  }

  const handleEventEnter = (eventInfo: any) => {
    eventInfo.event.setProp('backgroundColor', '#f66055');
  }

  const handleEventLeave = (eventInfo: any) => {
    const normalColor = eventInfo.event.extendedProps.formattedDate > todayStr ? '#f44336' : '#f66055'
    eventInfo.event.setProp('backgroundColor', normalColor);
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
        editable={true}
        selectable={false}
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
        eventMouseEnter={handleEventEnter}
        eventMouseLeave={handleEventLeave}
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
      <Popup
        title="Legg til aktivitet"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        maxWidth="md"
      >
        <ActivityInformation
          activity={activity}
        />
      </Popup>
    </CalendarContainer>
  )
}

export default Calender;
