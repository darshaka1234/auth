export interface User {
  name: string;
  email: string;
}

export const setAuth = (token: string, user: User) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const getUser = (): User | null => {
  const user = localStorage.getItem("user");
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};
