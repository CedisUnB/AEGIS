import "server-only";

/**
 * Descrições sumárias por trilha, mantidas manualmente.
 * A chave precisa bater com `Track.theme` (normalizado) após cada
 * trilha nova cadastrada no seed/bootstrap — atualizar aqui junto.
 */
export const THEME_DESCRIPTIONS: Record<string, string> = {
  "security by design": "Aprenda a mover as verificações de segurança para o início do desenvolvimento, antes de chegarem à produção.",
  "shift-left security": "Aprenda a mover as verificações de segurança para o início do desenvolvimento, antes de chegarem à produção.",
  "owasp top 10": "Conheça as vulnerabilidades mais críticas de aplicações web e como preveni-las na prática.",
  "sql injection": "Como lidar com injeções de código.",
  "proteção de dados": "Conheça princípios de privacidade, tratamento responsável de dados e medidas para protegê-los.",
  "autenticação e identidade": "Explore autenticação, autorização, gestão de sessões e proteção de credenciais.",
  "segurança de apis": "Pratique a proteção de APIs, validação de entradas e controle de acesso a recursos.",
  "criptografia aplicada": "Entenda como usar mecanismos criptográficos para proteger informações e comunicações.",
  "desenvolvimento seguro": "Aplique práticas de segurança ao longo do ciclo de desenvolvimento de software.",
  "segurança em nuvem": "Explore controles e boas práticas para proteger aplicações e dados em ambientes de nuvem.",
  // adicionar aqui conforme novas trilhas forem cadastradas
};

export function normalizeThemeKey(theme: string): string {
  return theme.trim().toLocaleLowerCase("pt-BR");
}