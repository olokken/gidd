import React, {useState} from 'react';
import FullCalendar, { EventApi, DateSelectArg, EventClickArg, EventContentArg, formatDate } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'
import {ActivityList} from '../interfaces/Activity';
import { EventInput } from '@fullcalendar/react';
import axios from '../Axios'
import styled from 'styled-components';
import Popup from '../components/Popup'

const CalendarContainer = styled.div`
  --fc-button-bg-color: #f44336;
  --fc-button-active-bg-color: #f44336;
  --fc-button-hover-bg-color:  #f66055
;
  

`;

const handleOnClick = (eventInfo:EventInput) => {
    console.log(eventInfo.event.start)
    /*const url = '/activity'
    axios.get(url).then((response) => {
      console.log(response.data);
    }).catch(error => {
      console.log('error' + error.message)
    })*/

}

const todayStr = new Date().toISOString().replace(/T.*$/, '') 

/*list.forEach(x  => {
  console.log(x.title)
})*/

const INITIAL_EVENTS: EventInput[] = [
  {
    title: 'All-day event',
    start: todayStr + 'T13:00:00',
    backgroundColor: '#f44336'
  },
  {
    title: 'Timed event',
    start: '2021-04-18-T12:00:00',
    backgroundColor: '2021-04-18-T12:00:00' > todayStr ? '#f44336': '#f66055'
  }
]

const Calender = () =>  {
    const [activities, setActivities] = useState<EventInput[]>([]);
    //const Activites = [{title: 'test1', date:'2021-04-15'},{title: 'test2', date:'2021-04-16'}, {title: 'test3', date:'2021-04-14'}]
  
    
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
        initialEvents= {INITIAL_EVENTS}
        firstDay = {1}
        //eventBackgroundColor = { colorFormat(INITIAL_EVENTS[0])}
        dayHeaderFormat = {{ weekday: 'short', month: 'numeric', day: 'numeric', omitCommas: true }}
        //eventContent= {renderEventContent}
        eventClick = {handleOnClick}
      /></CalendarContainer>
    )
}

export default Calender;
