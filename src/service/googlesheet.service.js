import { google } from "googleapis";
import path from "path";

const auth = new google.auth.GoogleAuth({
  keyFile: path.resolve("credentials.json"),
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
  ],
});

const spreadsheetId = process.env.GOOGLE_SHEET_ID;

export const appendAppointment = async (appointment) => {
  const client = await auth.getClient();

  const sheets = google.sheets({
    version: "v4",
    auth: client,
  });

  await sheets.spreadsheets.values.append({
    spreadsheetId, // <- THÊM DÒNG NÀY
    range: "Trang tính1!A:F",
    valueInputOption: "RAW",
    requestBody: {
      values: [[
        appointment.firstName,
        appointment.lastName,
        appointment.phone,
        appointment.content,
        appointment.status,
        new Date().toLocaleString("vi-VN"),
      ]],
    },
  });
};