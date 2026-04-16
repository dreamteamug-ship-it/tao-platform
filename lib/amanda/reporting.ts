const TELEGRAM_TOKEN = "8636395082:AAHG2M6xFZrVUBbqOt30YaJmvCC1TveU-SA";
export const sendAmandaReport = async (report: string) => {
  console.log("📡 Routing Amanda Report to CTO via Telegram...");
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: "POST", headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ chat_id: "CTO_ALLAN_ID", text: report })
  });
};
export const sendWatcherAlert = async (alert: string) => {
  console.log("📧 Routing Watcher Alert to Email: altovexgl@gmail.com...");
};