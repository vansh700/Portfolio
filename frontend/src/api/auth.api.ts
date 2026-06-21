import api from './axios';

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; name: string | null; role: string };
};

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post('/api/auth/login', { email, password });
  return data;
}

export async function register(
  email: string,
  password: string,
  name?: string
): Promise<LoginResponse> {
  const { data } = await api.post('/api/auth/register', { email, password, name });
  return data;
}

export async function refreshToken(token: string): Promise<{ accessToken: string }> {
  const { data } = await api.post('/api/auth/refresh', { refreshToken: token });
  return data;
}

export async function uploadImage(file: File): Promise<{ url: string; publicId: string }> {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await api.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function sendContact(
  name: string,
  email: string,
  message: string
): Promise<{ message: string }> {
  const { data } = await api.post('/api/contact', { name, email, message });
  return data;
}
