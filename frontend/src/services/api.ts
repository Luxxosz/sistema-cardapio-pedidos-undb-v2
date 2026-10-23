export const URL_BASE: string = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export class ErroApi extends Error {
  status: number;

  constructor(mensagem: string, status: number) {
    super(mensagem);
    this.status = status;
  }
}

async function requisicao<T>(metodo: string, caminho: string, corpo?: unknown): Promise<T> {
  const cabecalhos: Record<string, string> = {};

  if (corpo !== undefined) {
    cabecalhos["Content-Type"] = "application/json";
  }

  // se o usuario esta logado, manda o token em toda requisicao
  const token = localStorage.getItem("token");
  if (token) {
    cabecalhos["Authorization"] = "Bearer " + token;
  }

  const resposta = await fetch(URL_BASE + caminho, {
    method: metodo,
    headers: cabecalhos,
    body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
  });

  if (!resposta.ok) {
    let mensagem = "Erro inesperado. Tente de novo.";

    if (resposta.status === 403) {
      mensagem = "Sua sessão expirou ou você não tem permissão. Entre novamente.";
      // avisa o AuthProvider pra deslogar quem esta com token vencido
      if (token) {
        window.dispatchEvent(new Event("sessao-expirada"));
      }
    } else {
      try {
        const dados = await resposta.json();
        if (dados.mensagem) {
          mensagem = dados.mensagem;
        }
      } catch {
        // resposta sem corpo, fica com a mensagem padrao
      }
    }

    throw new ErroApi(mensagem, resposta.status);
  }

  if (resposta.status === 204) {
    return undefined as T;
  }

  return resposta.json();
}

export const api = {
  get: <T>(caminho: string) => requisicao<T>("GET", caminho),
  post: <T>(caminho: string, corpo?: unknown) => requisicao<T>("POST", caminho, corpo),
  put: <T>(caminho: string, corpo?: unknown) => requisicao<T>("PUT", caminho, corpo),
  patch: <T>(caminho: string, corpo?: unknown) => requisicao<T>("PATCH", caminho, corpo),
  delete: <T>(caminho: string) => requisicao<T>("DELETE", caminho),
};

// mensagem amigavel pra mostrar na tela quando algo da errado
export function mensagemDeErro(erro: unknown): string {
  if (erro instanceof ErroApi) {
    return erro.message;
  }
  return "Não foi possível conectar ao servidor. Confira se o backend está rodando.";
}
