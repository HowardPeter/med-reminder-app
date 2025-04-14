import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

// Cấu hình foreground notifications
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

  const scheduleNotification = async (seconds = 10) => {
    const trigger = new Date(Date.now() + 10000);
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '💊 Uống thuốc',
        body: `Đã đến lúc uống thuốc`,
      },
      trigger: trigger,
    });

    const allScheduled = await Notifications.getAllScheduledNotificationsAsync();
    console.log('[🔍 All scheduled notifications]:', allScheduled);
  };

  return {
    scheduleNotification,
  };
};