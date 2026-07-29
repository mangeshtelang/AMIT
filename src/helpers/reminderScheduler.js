const cron = require('node-cron');
const prisma = require('../config/prisma');
const { sendOverdueReminder } = require('./emailService');

const fineFor = (dueDate) => {
  const finePerDay = Number(process.env.FINE_PER_DAY || 5);
  const diff = Math.ceil((Date.now() - new Date(dueDate).getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff * finePerDay : 0;
};

async function runOnce() {
  const overdueItems = await prisma.allocation.findMany({
    where: {
      status: 'ISSUED',
      dueDate: { lt: new Date() },
      student: { email: { not: null } }
    },
    include: { student: true, book: true }
  });

  for (const item of overdueItems) {
    await sendOverdueReminder({
      to: item.student.email,
      studentName: item.student.fullName,
      bookTitle: item.book.title,
      dueDate: item.dueDate,
      fineAmount: fineFor(item.dueDate)
    });

    await prisma.allocation.update({ where: { id: item.id }, data: { lastReminderSentAt: new Date() } });
  }
}

exports.startReminderScheduler = () => {
  if (String(process.env.ENABLE_REMINDER_CRON) !== 'true') return;
  const schedule = process.env.REMINDER_CRON || '0 9 * * *';
  cron.schedule(schedule, async () => {
    try {
      await runOnce();
      console.log('Overdue reminder cron executed.');
    } catch (error) {
      console.error('Reminder cron failed:', error.message);
    }
  });
};

exports.sendManualReminders = runOnce;
