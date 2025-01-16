/** 토큰 디코딩 */
export function ParseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
      .join(''),
  );
  return JSON.parse(jsonPayload);
}

/** 토큰 만료시간 확인 */
export function IsTokenExpired(token) {
  const decoded = ParseJwt(token);
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}
