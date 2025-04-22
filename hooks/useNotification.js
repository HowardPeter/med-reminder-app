import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import moment from 'moment';
import { useCrud } from './useCrud';

// Cấu hình foreground notification
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const useNotification = () => {
  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    console.log('[Notification Permission Status]:', finalStatus);

    if (finalStatus !== 'granted') {
      console.warn('Không có quyền gửi thông báo.');
    }
  };

  const getPills = async (prescriptionId) => {
    if (!prescriptionId) {
      console.log('[Notification] prescriptionId is undefined or null');
      return [];
    };

    const { fetchPillsData } = useCrud();
    const pills = await fetchPillsData(prescriptionId);
    return pills;
  }

  const scheduleNotification = async (prescriptions = []) => {
    await Notifications.cancelAllScheduledNotificationsAsync(); // Reset notification cũ trước khi set mới

    for (const prescription of prescriptions) {
      const { id, name, time = [] } = prescription;
      const pills = await getPills(id);
      const pillInfo = pills.map(pill => `- ${pill?.name} (${pill?.dosage})`).join("\n");

      for (const timeString of time) {
        const [hour, minute] = timeString.split(':').map(Number);
        const now = moment();
        let scheduleTime = moment().hour(hour).minute(minute).second(0);

        // Nếu thời điểm đã qua hôm nay, đặt cho ngày mai
        if (scheduleTime.isBefore(now)) {
          scheduleTime = scheduleTime.add(1, 'day');
        }

        // Nếu thời gian cách hiện tại < 1 giây → lùi lại 1 giây
        if (scheduleTime.diff(now, 'seconds') < 1) {
          scheduleTime.add(1, 'second');
        }

        // const trigger = new Date(scheduleTime.valueOf());
        const trigger = {
          type: 'date',
          timestamp: scheduleTime.valueOf(),
        };

        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title: `💊 Hey, it's time to take your medicine!`,
            body: `Prescription: ${name}\n${pillInfo}`,
            sound: 'default',
          },
          trigger,
        });

        console.log(`[🔔 Scheduled for ${name} at ${timeString}]`, {
          id,
          triggerTime: scheduleTime.format('YYYY-MM-DD HH:mm:ss'),
        });
      }
    }
  };

  return {
    scheduleNotification,
  };
};