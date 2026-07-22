import { TimerData } from "@/app/TimerScreen";
import { db } from "@/db";

export const TimerRepository = {
    async getAllTimers(): Promise<TimerData[]> {
    const rows = await db.getAllAsync<any>('SELECT * FROM timers;');
    
    return rows.map((row) => ({
      id: row.id,
      label: row.label,
      duration: row.duration,
      timeLeft: row.time_left,
      isRunning: row.is_running === 1,
      endTime: row.end_time || null,
      notificationId: row.notification_id || null,
    }));
  },

  async createTimer(timer: TimerData): Promise<void> {
    await db.runAsync(
      `INSERT INTO timers (id, label, duration, time_left, is_running, end_time, notification_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        timer.id,
        timer.label, 
        timer.duration, 
        timer.timeLeft, 
        timer.isRunning ? 1 : 0,
        timer.endTime, 
        timer.notificationId
      ]
    );
  },

  async updateTimer(timer: TimerData): Promise<void> {
    await db.runAsync(
      `UPDATE timers 
       SET label = ?, duration = ?, time_left = ?, is_running = ?, end_time = ?, notification_id = ? 
       WHERE id = ?`,
      [
        timer.label,
        timer.duration,
        timer.timeLeft,
        timer.isRunning ? 1 : 0,
        timer.endTime,
        timer.notificationId,
        timer.id
      ]
    );
  },

  async deleteTimer(id: string): Promise<void> {
    await db.runAsync('DELETE FROM timers WHERE id = ?', [id]);
  }
};