import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000"
})

export default api;

// Alternative fetch-based implementation
const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function apiFetch(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (response.status === 401) {
    localStorage.removeItem("accessToken");

    alert("Sua sessão expirou por inatividade. Por segurança, faça login novamente para continuar.");
    window.location.href = "/";
    throw new Error("401: Unauthorized");
  }

  if (!response.ok) {
    const mensagemErro = `
    Ocorreu um erro ao acessar ${endpoint}.
    Verifique sua conexão com a internet e tente novamente.
    Se o problema persistir, entre em contato com o suporte técnico.
    `;
    throw new Error(`${response.status}: ${mensagemErro}`);
  }

  if (response.status === 204) return null;

  return response.json();
}

export { BASE_URL };
