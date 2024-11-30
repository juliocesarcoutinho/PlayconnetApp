// Service usando o axios para fazer a requisição de login:

import axios from "axios";
import config from "../../config/config";

const api = axios.create({
  baseURL: config.API_BASE_URL,
});

export const LoginService = {
  CHAVE_TOKEN: "auth-token",

  async login(
    email: string,
    senha: string
  ): Promise<{ success: boolean; data?: unknown; message?: string }> {
    try {
      const response = await api.post("/login", { email, senha });

      // Verificar se o token existe e é válido
      if (response.data.token && typeof response.data.token === "string") {
        console.log("Token recebido:", response.data.token);
        localStorage.setItem(this.CHAVE_TOKEN, response.data.token);
        return { success: true, data: response.data };
      } else {
        console.warn("Resposta inesperada:", response.data);
        return {
          success: false,
          message: "Token inválido ou ausente na resposta",
        };
      }
    } catch (error) {
      // Manejo de erros com axios
      if (axios.isAxiosError(error)) {
        const defaultMessage = "Erro inesperado, tente novamente mais tarde.";
        const apiMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          defaultMessage;

        console.error("Erro da API:", error.response?.data);
        return { success: false, message: apiMessage };
      } else {
        console.error("Erro não esperado:", error);
        return { success: false, message: "Erro inesperado no sistema" };
      }
    }
  },

  async logout() {
    localStorage.removeItem(this.CHAVE_TOKEN);
  },

  isAuthenticated(): boolean {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem(this.CHAVE_TOKEN);
    }
    return false;
  },
};
