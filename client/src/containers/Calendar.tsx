import React, {useContext, useState} from 'react';
import FullCalendar, { EventApi, DateSelectArg, EventClickArg, EventContentArg, formatDate } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'
import {ActivityList} from '../interfaces/Activity';
import { EventInput } from '@fullcalendar/react';
import axios from '../Axios'
import styled from 'styled-components';
import Popup from '../components/Popup';
import ActivityPopup from '../components/ActivityComponents/ActivityInformationPopup'
import { isAbsolute } from 'node:path';
import {UserContext} from '../UserContext'

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

/*list.forEach(x  => {
  console.log(x.title)
})*/

const INITIAL_EVENTS: EventInput[] = [
  {
    title: 'All-day event',
    start: todayStr + ' 13:00:00',
    end:  todayStr + ' 16:00:00',
    backgroundColor: todayStr + 'T13:00:00' > todayStr ? '#f44336': '#f66055'
  },
  {
    title: 'Timed event',
    start: '2021-04-18 12:00:00',
    end: '2021-04-18 14:00:00',
    backgroundColor: '2021-04-18T 2:00:00' > todayStr ? '#f44336': '#f66055'
  }
]

const Calender = () =>  {
  const { user, setUser } = useContext(UserContext);
  const [activities, setActivities] = useState<EventInput[]>([  {
      title: 'All-day event',
      start: todayStr + 'T13:00:00',
      end:  todayStr + 'T16:00:00',
      backgroundColor: todayStr + 'T13:00:00' > todayStr ? '#f44336': '#f66055',
    },
    {
      title: 'Timed event',
      start: '2021-04-18T12:00:00',
      end: '2021-04-18T14:00:00',
      backgroundColor: '2021-04-18T12:00:00' > todayStr ? '#f44336': '#f66055',
    }]);
    //const Activites = [{title: 'test1', date:'2021-04-15'},{title: 'test2', date:'2021-04-16'}, {title: 'test3', date:'2021-04-14'}]
  
    const handleOnClick = (eventInfo:EventInput) => {
      console.log(user)
      setActivities(activities => [...activities,{
        title: 'New event',
        start: todayStr + 'T18:00:00',
        end:  todayStr + 'T20:00:00',
        backgroundColor: todayStr + 'T13:00:00' > todayStr ? '#f44336': '#f66055'
      }])
      const url = '/activity'
      axios.get(url).then((response) => {
        console.log(response.data);
      }).catch(error => {
        console.log('error' + error.message)
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
        height = '750px'
        initialView="timeGridWeek"
        editable={true}
        selectable={false}
        selectMirror={true}
        dayMaxEvents={true}
        allDaySlot={false}
        locale = {'en-GB'}
        displayEventEnd = {true}
        buttonText = {{
          today:    'I dag',
          month:    'Måned',
          week:     'Uke',
          day:      'Dag',
        }}
        eventDisplay= {'block'}
        events= {activities}
        firstDay = {1}
        dayHeaderFormat = {{ weekday: 'short', month: 'numeric', day: 'numeric', omitCommas: true, hour12: false}}
        slotLabelFormat = {{
          hour12: false,
          hour: 'numeric',
          minute: '2-digit',
          omitZeroMinute: false,
          meridiem: 'short'
        }}
        progressiveEventRendering = {true}
        eventClick = {handleOnClick}
      /></CalendarContainer>
    )
}

export default Calender;
