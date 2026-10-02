# Checklist de Segurança para Backend

## Introdução

Este checklist detalha as medidas de segurança essenciais para o desenvolvimento, teste e publicação da camada de backend do nosso projeto. Ele serve como um guia prático para garantir que a lógica de negócio, o acesso a dados e as APIs sejam robustos e resilientes contra ameaças comuns.

Cada item deve ser considerado uma parte integral do processo de desenvolvimento. Itens que não se aplicam a uma funcionalidade específica podem ser marcados como **N/A (Não se Aplica)**, com a devida justificativa documentada.

---

## 1. Checagem Essencial (Quick-Check)

Esta seção cobre os pilares da segurança de backend e deve ser revisada a cada nova funcionalidade ou alteração significativa.

### 1.1 Validação de Entradas no Servidor

*O backend é a última e mais importante linha de defesa. Nenhuma entrada do cliente (frontend, mobile, etc.) pode ser considerada confiável.*

- [ ] **Validação Rigorosa:** Todos os dados recebidos em endpoints (corpo da requisição, parâmetros de URL, cabeçalhos) são validados quanto ao tipo, formato, tamanho e intervalo de valores antes de serem processados pela lógica de negócio.
- [ ] **Rejeição de Dados Inválidos:** A aplicação rejeita requisições com dados inválidos, retornando um código de erro HTTP apropriado (ex: `400 Bad Request`) com uma mensagem clara, sem expor detalhes internos da falha de validação.

### 1.2 Autenticação e Autorização

Garantir que apenas os usuários certos possam realizar as ações certas.

- [ ] **Autenticação Forte:** Mecanismos de autenticação robustos e padronizados, como **JWT** ou **OAuth 2.0**, são utilizados para verificar a identidade do usuário.
- [ ] **Autorização em Todos os Endpoints:** Cada endpoint que realiza uma ação verifica não apenas se o usuário está autenticado, mas também se ele tem as permissões necessárias para realizar aquela ação específica (ex: verificar se o usuário é "Admin" ou se é o "dono" do recurso que tenta modificar).
- [ ] **Proteção Contra Força Bruta:** O endpoint de login possui mecanismos para mitigar ataques de força bruta, como l**imitação de tentativas** (rate limiting) e, se possível, bloqueio temporário de conta após múltiplas falhas.

### 1.3 Prevenção Contra Injeção de Código

*A causa raiz de muitas das vulnerabilidades mais devastadoras.*

- [ ] **SQL Injection:** Todas as interações com o banco de dados são feitas exclusivamente através de um **ORM (Object-Relational Mapper)** ou, em casos de SQL bruto, com o uso mandatório de c**onsultas parametrizadas (Prepared Statements)**. Nenhuma string de SQL é construída por concatenação de entradas do usuário.
- [ ] **OS Command Injection:** A aplicação evita executar comandos no sistema operacional. Se for absolutamente necessário, a entrada do usuário nunca é usada diretamente para construir o comando.

### 1.4 Criptografia de Dados Sensíveis

*Proteger informações em repouso (no banco de dados) e em trânsito.*

- [ ] **Criptografia de Senhas (Hashing):** Senhas de usuários **NUNCA** são armazenadas em texto plano. Elas são processadas com um algoritmo de hashing forte, lento e com "salt", como **Argon2** ou **bcrypt**.
- [ ] **Criptografia de Outros Dados Sensíveis:** Se a aplicação armazena outros dados sensíveis (ex: tokens de API de terceiros), eles também devem ser criptografados no banco de dados.

### 1.5 Gerenciamento de Sessão Seguro

*Proteger a identidade do usuário após o login.*

- [ ] **Invalidação de Sessão:** A aplicação fornece um mecanismo de logout que invalida o token JWT no lado do servidor (ex: usando uma blocklist).
- [ ] **Tempo Limite de Sessão:** Os tokens JWT possuem um tempo de expiração razoável (ex: 15 minutos para tokens de acesso, 7 dias para refresh tokens) para limitar a janela de oportunidade de um token roubado.

## 2. Configurações de Servidor, Cabeçalhos e APIs

A forma como nosso servidor se apresenta e se comunica com o mundo é uma superfície de ataque crítica.

### 2.1 Configuração de Cabeçalhos HTTP de Segurança

Instruir o navegador do cliente a se comportar de maneira mais segura.

- [ ] **Content-Security-Policy (CSP):** O backend envia um cabeçalho CSP para restringir de onde os recursos (scripts, estilos, fontes) podem ser carregados, mitigando ataques de XSS.
- [ ] **HTTP Strict-Transport-Security (HSTS):** O cabeçalho HSTS é enviado para forçar o navegador a se comunicar apenas via HTTPS, prevenindo ataques de downgrade.
- [ ] **X-Frame-Options / frame-ancestors:** O backend envia cabeçalhos para prevenir que a aplicação seja carregada dentro de um `<iframe>` em sites maliciosos, mitigando ataques de *Clickjacking*.
- [ ] **X-Content-Type-Options:** O cabeçalho é configurado como `nosniff` para prevenir que o navegador tente adivinhar o tipo de um recurso.
- [ ] **Ocultação de Informações:** O servidor está configurado para não enviar cabeçalhos que revelem sua versão e tecnologia (ex: `X-Powered-By`, `Server`).

### 2.2 Configuração Segura de Cookies

*Se cookies são usados para gerenciar sessão, eles devem ser "blindados".*

- [ ] **Atributo `HttpOnly`:** O cookie de sessão é definido com `HttpOnly` para que não possa ser acessado por scripts JavaScript no navegador, protegendo contra roubo via XSS.
- [ ] **Atributo `Secure`:** O cookie é definido com `Secure` para garantir que ele só seja enviado em requisições HTTPS.
- [ ] **Atributo `SameSite`:** O cookie é configurado como `Lax` ou `Strict` para mitigar ataques de Cross-Site Request Forgery (CSRF).

### 2.3 Prevenção de Cross-Site Request Forgery (CSRF) na API

- [ ] **Técnica de Duplo Submit Cookie ou Token Sincronizador:** O backend implementa e valida um mecanismo anti-CSRF para todas as requisições que modificam estado (`POST`, `PUT`, `DELETE`), garantindo que a requisição se origina de uma sessão de usuário legítima.

## 3. Processos e Boas Práticas de Implementação

A segurança é um hábito, não um ato.

### 3.1 Gerenciamento de Dependências (SCA)

- [ ] **Verificação Contínua:** Uma ferramenta de Análise de Composição de Software (SCA) (ex: **OWASP Dependency-Check**, npm audit) está integrada ao nosso pipeline ou é executada regularmente.
- [ ] **Política de Correção:** Vulnerabilidades críticas ou altas em dependências são tratadas como bugs de alta prioridade e devem ser corrigidas ou mitigadas antes de um deploy.

### 3.2 Logging e Monitoramento

- [ ] **Logs de Auditoria:** A aplicação gera logs para eventos de segurança relevantes (ex: tentativas de login falhas, sucesso no login, alteração de senha, acesso a recursos críticos).
- [ ] **Não Registrar Dados Sensíveis:** O sistema de log está configurado para **NUNCA** registrar informações sensíveis em texto plano (senhas, tokens, chaves de API, dados de cartão de crédito).

### 3.3 Aderência aos Requisitos de Segurança do Projeto

- [ ] **Conexão com o Planejamento:** O backend da funcionalidade foi revisado em relação aos Requisitos de Segurança definidos na Seção 2 das [Diretrizes](./guidelines.md), garantindo que as defesas necessárias foram implementadas.

### 3.4 Outras Boas Práticas

- [ ] **Não Usar Modo de Depuração:** O modo de depuração do framework (`DEBUG=True`) está **desabilitado** no ambiente de produção para evitar o vazamento de informações de configuração sensíveis.
- [ ] **Limitar Uploads de Arquivos:** Se a aplicação permite o upload de arquivos, há uma validação estrita do tipo de arquivo (MIME type), tamanho e um processo para escanear os arquivos em busca de malware.
- [ ] **Usar UUIDs:** Para IDs de recursos expostos em APIs, preferimos usar UUIDs em vez de IDs numéricos sequenciais para prevenir ataques de enumeração (ex: `/api/users/1`, `/api/users/2`...).

*Fonte e Adaptação: Este checklist foi adaptado para o contexto do projeto a partir da obra derivada do "The ultimate security checklist for developers" de Julien Enselme, licenciado sob Creative Commons Attribution-ShareAlike.*

### Histórico de Versão
Data     | Versão | Descrição | Autor | Revisor
-------- | ------ | --------- | ----- | ---------
26/09/26 | 1.0 | Criação do Checklist de Medidas de Segurança - Backend | [Pedro Henrique](https://github.com/phmelosilva) | [João Pedro Morbeck](https://github.com/uMorbeck) 