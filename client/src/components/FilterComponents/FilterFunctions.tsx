import ActivityResponse from '../../interfaces/ActivityResponse';
import ActivityLevels from '../../interfaces/ActivityLevels';
import DefaultCenter from '../../interfaces/DefaultCenter';
import { getDistance } from 'geolib';


const titleFilter = (
    activities: ActivityResponse[],
    titleSearch: string
): ActivityResponse[] => {
    return activities.filter((act: ActivityResponse) => {
        if (titleSearch == '') {
            return act;
        } else if (
            act.title != null &&
            act.title.toLowerCase().includes(titleSearch.toLocaleLowerCase())
        ) {
            return act;
        }
    });
};

const dateFromFilter = (activities: ActivityResponse[], fromDate: Date) => {
    return activities.filter((act) => act.time > fromDate.getTime());
};

const dateToFilter = (activities: ActivityResponse[], fromDate: Date) => {
    return activities.filter((act) => act.time < fromDate.getTime());
};

const activityLevelFilter = (
    activities: ActivityResponse[],
    activityLevel: ActivityLevels
): ActivityResponse[] => {
    return activities.filter((act) => {
        if (activityLevel.Low && act.activityLevel == 'LOW') return act;
        if (activityLevel.Medium && act.activityLevel == 'MEDIUM') return act;
        if (activityLevel.High && act.activityLevel == 'HIGH') return act;
    });
};

const showMyActivities = (
    activities: ActivityResponse[],
    show: boolean,
    user: string
): ActivityResponse[] => {
    console.log(user);
    return activities.filter((act: ActivityResponse) => {
        const registered = act.registeredParticipants
            .map((par) => par['userId'])
            .filter((userID) => userID == user && userID.length !== 0);
        if (show === false) {
            return act;
        } else if (registered.length !== 0 && show === true) {
            return act;
        }
    });
};

const showFutureActivities = (
    activities: ActivityResponse[],
    show: boolean
): ActivityResponse[] => {
    return activities.filter((act: ActivityResponse) => {
        const today = new Date();
        if (show === false) {
            return act;
        } else if (act.time >= today.getTime()) {
            return act;
        }
    });
};

const changeCapacity = (
    activities: ActivityResponse[],
    capacity: number[]
): ActivityResponse[] => {
    return activities.filter((act: ActivityResponse) => {
        if (act.capacity >= capacity[0] && act.capacity <= capacity[1]) {
            return act;
        }
    });
};

const tagFilter = (
    activities: ActivityResponse[],
    tags: string[] | undefined
): ActivityResponse[] => {
    return activities.filter((act: ActivityResponse) => {
        if (!tags || tags.length === 0) {
            return act;
        } else {
            let containsTags = true;
            if (tags.length > 1) {
                containsTags = true;
                act.tags.forEach((tag) => {
                    tags.forEach((myTag) => {
                        console.log('min tag' + myTag + 'din tag ' + tag);
                        if (tag.indexOf(myTag) === -1) {
                            containsTags = false;
                        }
                    });
                });
            } else {
                containsTags = false;
                console.log('mindre enn 1 tag');
                act.tags.forEach((tag) => {
                    tags.forEach((myTag) => {
                        console.log('min tag' + myTag + 'din tag ' + tag);
                        if (tag === myTag) {
                            containsTags = true;
                        }
                    });
                });
            }
            if (containsTags) {
                return act;
            }
        }
    });
};

const distanceFilter = (
    activities: ActivityResponse[],
    distance: number | undefined,
    location: DefaultCenter | undefined
): ActivityResponse[] => {
    return activities.filter((act) => {
        if (location && distance) {
            let dist = getDistance(location, {
                latitude: act.latitude,
                longitude: act.longitude,
            });
            dist = dist / 1000;
            if (dist <= distance) {
                return act;
            }
        } else {
            return act;
        }
    });
};

export const FilterFunctions = {
    titleFilter,
    showMyActivities,
    showFutureActivities,
    changeCapacity,
    activityLevelFilter,
    dateToFilter,
    dateFromFilter,
    tagFilter,
    distanceFilter,
};
