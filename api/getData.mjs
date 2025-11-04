// 파일 위치: /api/getData.js

export default async function handler(request, response) {

  // 1. Vercel에 저장된 '진짜' API 키를 몰래 가져옵니다.
  const apiKey = process.env.MY_API_KEY;

  if (!apiKey) {
// ... (이하 코드 생략) ...
