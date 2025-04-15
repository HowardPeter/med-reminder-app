import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import moment from 'moment';

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

  const scheduleNotification = async (prescriptions = []) => {
    await Notifications.cancelAllScheduledNotificationsAsync(); // Reset cũ trước khi set mới

    for (const prescription of prescriptions) {
      const { name, time = [] } = prescription;

      for (const timeString of time) {
        const [hour, minute] = timeString.split(':').map(Number);
        const now = moment();
        let scheduleTime = moment().hour(hour).minute(minute).second(0);

        // Nếu thời điểm đã qua hôm nay, đặt cho ngày mai
        if (scheduleTime.isBefore(now)) {
          scheduleTime = scheduleTime.add(1, 'day');
        }

        const trigger = new Date(scheduleTime.valueOf());

        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title: '💊 Uống thuốc',
            body: `Đã đến lúc uống thuốc: ${name}`,
            sound: 'default',
          },
          trigger,
        });

        //console.log(`[🔔 Scheduled for ${name} at ${timeString}] ID:`, id);
      }
    }

    // const all = await Notifications.getAllScheduledNotificationsAsync();
    // console.log('[📅 All scheduled notifications]:', all);
  };

  return {
    scheduleNotification,
  };
};