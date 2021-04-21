import ActivityResponse from '../../interfaces/ActivityResponse';
import ActivityLevels from '../../interfaces/ActivityLevels';

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
            .map((par) => par.userId['userId'])
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
    })
}

const tagFilter = (
    activities: ActivityResponse[],
    tags: string[] | undefined
): ActivityResponse[] => {
    return activities.filter((act: ActivityResponse) => {
        if (!tags) {
            return act
        } else {
            console.log(act.tags.forEach((tag) => {
                console.log(tag);
            }))
        }
    })
}

export const FilterFunctions = {
    titleFilter,
    showMyActivities,
    showFutureActivities,
    changeCapacity,
    activityLevelFilter,
    dateToFilter,
    dateFromFilter,
    tagFilter
};
