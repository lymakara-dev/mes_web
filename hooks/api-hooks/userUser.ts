// import api from '@/service/api';
// import { useMutation } from '@tanstack/react-query';

// type LoginPayload = {
//   email: string;
//   password: string;
// };

// export const useLogin = () => {
//   return useMutation(async (data: LoginPayload) => {
//     const response = await api.post('/login', data);
//     const { token } = response.data;
//     localStorage.setItem('token', token);
//     return token;
//   });
// };
