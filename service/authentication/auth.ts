export const saveToken = (token: string) => {
  localStorage.setItem('mes_auth', token);
};

export const getToken = (): string | null => {
  return localStorage.getItem('mes_auth');
};

export const clearToken = () => {
  localStorage.removeItem('mes_auth');
};
