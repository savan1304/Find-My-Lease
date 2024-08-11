import * as Notifications from 'expo-notifications';

export async function requestNotificationPermissions() {
    const { status } = await Notifications.requestPermissionsAsync({
        ios: {
            allowAlert: true,
            allowSound: true,
            allowBadge: true,
        },
    });
    if (status !== 'granted') {
        alert("Permission Required");
        return false;
    }
    return true;
}

export async function scheduleNotification(date, title, body) {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
        console.log('No notification permissions!');
        return;
    }

    try {
        const now = new Date();
        const timeToNotify = date.getTime() - now.getTime(); 
        if (timeToNotify <= 0) {
            console.log('The scheduled time is in the past. Notification not scheduled.');
            return;
        }

        const schedulingOptions = {
            content: {
                title: title,
                body: body,
                sound: true, 
            },
            trigger: {
                seconds: Math.floor(timeToNotify / 1000), 
                repeats: false 
            },
        };

        await Notifications.scheduleNotificationAsync(schedulingOptions);
        console.log('Notification scheduled:', { title, body, date });
    } catch (error) {
        console.error("Failed to schedule notification", error);
    }
}

