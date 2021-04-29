import ActivityResponse from '../../interfaces/ActivityResponse';
import DefaultCenter from '../../interfaces/DefaultCenter';
import { getDistance } from 'geolib';

const comingSort = (activities: ActivityResponse[]): ActivityResponse[] => {
    return [...activities].sort((act1, act2) => {
        return act1.time - act2.time;
    });
};

const distanceSort = (
    activities: ActivityResponse[],
    location: DefaultCenter | undefined
): ActivityResponse[] => {
    if (location) {
        return [...activities].sort((act1, act2) => {
            const distance1 = getDistance(location, {
                latitude: act1.latitude,
                longitude: act1.longitude,
            });
            const distance2 = getDistance(location, {
                latitude: act2.latitude,
                longitude: act2.longitude,
            });
            return distance1 - distance2;
        });
    }
    return activities;
};

const capacitySort = (activities: ActivityResponse[]): ActivityResponse[] => {
    return [...activities].sort((act1, act2) => {
        return act1.capacity - act2.capacity;
    });
};

const activityLevelSort = (
    activities: ActivityResponse[]
): ActivityResponse[] => {
    console.log('horeri');
    return [...activities].sort((act1, act2) => {
        const lastLetter1: number = act1.activityLevel.charCodeAt(
            act1.activityLevel.length - 1
        );
        const lastLetter2: number = act2.activityLevel.charCodeAt(
            act2.activityLevel.length - 1
        );
        return lastLetter2 - lastLetter1;
    });
};

export const SortFunctions = {
    comingSort,
    distanceSort,
    capacitySort,
    activityLevelSort,
};
