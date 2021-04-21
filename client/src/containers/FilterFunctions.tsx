import ActivityResponse from '../interfaces/ActivityResponse';

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

const showMyActivities = (
    activities: ActivityResponse[],
    show: boolean,
    user: string
): ActivityResponse[] => {
    console.log(user)
    return activities.filter((act: ActivityResponse) => {
        if (show === false) {
            return act;
        }
        else if (act.registeredParticipants
            .filter((par) => par.userId['userId']).includes(user) && show === true) {
            return act;
        }
    });
};
export const FilterFunctions = { titleFilter, showMyActivities };
