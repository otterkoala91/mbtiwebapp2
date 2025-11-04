// 파일 위치: /api/getData.mjs

export default async function handler(request, response) {

  // 1. Vercel에 저장된 '진짜' API 키를 몰래 가져옵니다.
  //    (Vercel 'Environment Variables'에 'MY_API_KEY'라는 이름으로 저장했다고 가정)
  const apiKey = process.env.MY_API_KEY;

  if (!apiKey) {
    return response.status(500).json({ message: "서버에 API 키가 설정되지 않았습니다." });
  }

  // 2. index.html이 보낸 'prompt' 데이터를 받습니다.
  //    (index.html의 'payload' 객체가 여기에 그대로 전달됩니다)
  const payloadFromIndex = request.body;

  // 3. 우리가 '진짜' Google API 주소를 조립합니다. (비밀 키 포함)
  const googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`;

  try {
    // 4. Vercel 서버가 index.html 대신 Google API를 호출합니다.
    const apiResponse = await fetch(googleApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payloadFromIndex) // 받은 payload 그대로 Google에 전달
    });

    // 5. Google API의 응답을 다시 'data' 변수에 저장합니다.
    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      // Google API가 에러를 반환한 경우, 그 에러 내용을 index.html로 전달
      console.error('Google API Error:', data);
      return response.status(apiResponse.status).json(data);
    }

    // 6. Google API의 성공 결과를 index.html로 그대로 전달
    response.status(200).json(data);

  } catch (error) {
    // Vercel 함수 자체에서 문제가 생긴 경우
    console.error('Vercel Function Error:', error);
    response.status(500).json({ message: 'Vercel 서버 함수에서 에러가 발생했습니다.' });
  }
}
