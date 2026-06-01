import { google } from "googleapis";
import path from "path";

// Chuỗi JSON từ biến môi trường sẽ được parse thành Object
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

const auth = new google.auth.GoogleAuth({
  credentials: credentials, // Truyền trực tiếp object vào đây thay vì dùng keyFile
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
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