const TELEGRAM_TOKEN = "8636395082:AAHG2M6xFZrVUBbqOt30YaJmvCC1TveU-SA";
export const sendTelegramReport = async (msg: string) => {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: "POST", headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ chat_id: "6438788790", text: `[AMANDA_SOP]: ${msg}` })
  });
};