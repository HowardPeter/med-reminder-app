import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import moment from 'moment';
import { useCrud } from './useCrud';
import { useTaken } from './useTaken';

// Cấu hình foreground notification
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const useNotification = () => {
  const { fetchPillsData } = useCrud();
  const { checkPrescriptionTaken } = useTaken();

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

    // console.log('[Notification Permission Status]:', finalStatus);

    if (finalStatus !== 'granted') {
      console.warn('Không có quyền gửi thông báo.');
    }
  };

  const scheduleReminderNotification = async (userId, prescriptionId, name, timeString, delayMinutes = 5) => {
    const [hour, minute] = timeString.split(":").map(Number);

    // Lấy thời điểm uống thuốc theo prescription
    let baseTime = moment().hour(hour).minute(minute).second(0);

    if (baseTime.isBefore(moment())) {
      baseTime.add(1, "day");
    }
    console.log(baseTime);
    
    // Thời điểm thông báo nhắc lại = sau thời điểm uống thuốc X phút
    const reminderTime = baseTime.clone().add(delayMinutes, "minutes");

    if (!userId) return;

    const isTaken = await checkPrescriptionTaken(
      userId,
      prescriptionId,
      new Date(moment(baseTime).format("YYYY-MM-DD").valueOf()),
      timeString
    );
    if (isTaken) return;

    const trigger = new Date(reminderTime.valueOf());

    const pills = await fetchPillsData(prescriptionId);
    const pillInfo = pills.map(pill => `- ${pill.name} - Dosage: ${pill.dosage}`).join("\n");

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `⏰ Reminder: Did you take your ${timeString} medicine?`,
        body: `📝 Prescription: ${name}\n${pillInfo}`,
        sound: "default",
        data: { prescriptionId, time: timeString },
      },
      trigger,
    });

    console.log(`[🔁 Reminder scheduled in ${delayMinutes} mins for ${name} at ${timeString}]`);
  };

  const scheduleNotification = async (prescriptions = []) => {
    await Notifications.cancelAllScheduledNotificationsAsync(); // Reset cũ trước khi set mới

    for (const prescription of prescriptions) {
      const { id, userId, name, time = [] } = prescription;
      const pills = await fetchPillsData(id);
      const pillInfo = pills.map(pill => `- ${pill?.name} - Dosage: ${pill?.dosage}`).join("\n");

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
        
        const trigger = new Date(scheduleTime.valueOf());

        const notifiId = await Notifications.scheduleNotificationAsync({
          content: {
            title: `💊 HEY, IT'S TIME TO TAKE YOUR ${timeString} MEDICINE!`,
            body: `📝 Prescription: ${name}\n${pillInfo}`,
            sound: 'default',
          },
          trigger,
        });

        console.log(`[Scheduled for ${name} at ${timeString}]`, {
          notifiId,
          triggerTime: scheduleTime.format('YYYY-MM-DD HH:mm:ss'),
        });

        await scheduleReminderNotification(userId, id, name, timeString, 5);
      }
    }
  };

  return {
    scheduleNotification,
  };
};