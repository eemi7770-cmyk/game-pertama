export const GOOGLE_SHEETS_WEBAPP_URL =
  'https://script.google.com/macros/s/AKfycbzqQQBebQ6Td4TURgakD4tEztZYyErZ5WXAjQHr8PjZHJzKnzX0SKPq-2GjMNXZfkY_9A/exec';

export interface GoogleSheetsScorePayload {
  nama: string;
  kelas: string;
  nilai: number;
}

export async function sendScoreToGoogleSheets(payload: GoogleSheetsScorePayload): Promise<void> {
  await fetch(GOOGLE_SHEETS_WEBAPP_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nama: payload.nama.trim(),
      kelas: payload.kelas.trim(),
      nilai: payload.nilai,
    }),
  });
}
