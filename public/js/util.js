function decodeJwt(token) {
  const payload = token.split('.')[1];
  const decoded = atob(payload);
  return JSON.parse(decoded);
}

export function getUserInfo() {
  const token = localStorage.getItem('accessToken');
  if (token) {
    const userInfo = decodeJwt(token);
    return userInfo;
  }
}
