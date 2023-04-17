export const getTokenFromStorage = (): string | null => {
  return localStorage.getItem("token");
};

export const saveToStorage = (token: string): void => {
  localStorage.setItem("token", token);
};

export const removeTokenFromStorage = (): void => {
  localStorage.removeItem("token");
};
