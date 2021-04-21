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

export const FilterFunctions = {
    titleFilter,
    dateFromFilter,
    dateToFilter,
    activityLevelFilter,
};
