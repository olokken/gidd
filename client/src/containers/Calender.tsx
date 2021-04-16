import React, {useState} from 'react';
import FullCalendar, { EventApi, DateSelectArg, EventClickArg, EventContentArg, formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import {ActivityList} from '../interfaces/Activity'
import { EventInput } from '@fullcalendar/react'

const todayStr = new Date().toISOString().replace(/T.*$/, '') 

/*list.forEach(x  => {
  console.log(x.title)
})*/

const INITIAL_EVENTS: EventInput[] = [
  {
    title: 'All-day event',
    start: todayStr + 'T13:00:00'
  },
  {
    title: 'Timed event',
    start: todayStr + 'T12:00:00'
  }
]


function renderEventContent(eventContent: EventContentArg) {
  return (
    <>
      <b>{eventContent.timeText}</b>
      <i>{eventContent.event.title}</i>
    </>
  )
}
const Calender = () =>  {
    const [activities, setActivities] = useState<EventInput[]>([]);
    //const Activites = [{title: 'test1', date:'2021-04-15'},{title: 'test2', date:'2021-04-16'}, {title: 'test3', date:'2021-04-14'}]
  
    const handleEventClicked = () => {
    const list = ActivityList();
    console.log(list)
    list.forEach(activity => {
      setActivities(activities => [...activities, {title: activity.title, date: activity.time}])
    })
    console.log(activities);
    }
    
    
    return (
        <FullCalendar
        plugins={[ dayGridPlugin ]}
        initialView="dayGridWeek"
        initialEvents= {INITIAL_EVENTS}
        //eventContent= {renderEventContent}
        eventClick = {handleEventClicked}
      />
    )
}

export default Calender;
