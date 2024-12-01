// LoginService.ts
import axios from 'axios';
import config from '../../config/config';

const api = axios.create({
    baseURL: config.API_BASE_URL
});

export const LoginService = {
    CHAVE_TOKEN: 'authToken',

    async login(email: string, senha: string): Promise<{ success: boolean; data?: never; message?: string }> {
        try {
            const response = await api.post('/login', { email, senha });
            if (response.data.token) {
                localStorage.setItem(this.CHAVE_TOKEN, response.data.token);
                return { success: true, data: response.data };
            } else {
                return { success: false, message: 'Token not found in response' };
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return { success: false, message: error.response?.data.message || 'Erro inesperado' };
            } else {
                return { success: false, message: 'Erro inesperado' };
            }
        }
    },


    logout(): void {
        localStorage.removeItem(this.CHAVE_TOKEN);
    },

    isAuthenticated(): boolean {
        if (typeof window !== 'undefined') {
            return !!localStorage.getItem(this.CHAVE_TOKEN);
        }
        return false;
    }
};
