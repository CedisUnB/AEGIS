# Checklist de Segurança para API

## Introdução

Este checklist é um guia prático para o desenvolvimento e a verificação da segurança da API desenvolvida. APIs são a espinha dorsal da aplicação, e garantir sua robustez é fundamental para a segurança do projeto como um todo.

Cada item aqui listado deve ser considerado parte do processo de desenvolvimento. Itens que não se aplicam a um endpoint ou funcionalidade específica podem ser marcados como **N/A (Não se Aplica)**, desde que a decisão seja consciente.

## 1. Checagem Essencial (Quick-Check)

Esta seção resume os pontos mais críticos e deve ser revisada a cada nova implementação de endpoint ou alteração significativa na API.

- [ ] **1.1 Autenticação e Autorização**
  - **Autenticação:** todos os endpoints que não são públicos são protegidos por um mecanismo de autenticação forte (ex: **JWT**). Nenhuma requisição é processada sem um token válido.
  - **Autorização:** para cada requisição, após autenticar, é verificado se o usuário tem a **permissão necessária** para acessar aquele recurso ou executar aquela ação específica.

- [ ] **1.2 Validação Rigorosa de Entradas (Input Validation)**
  - Todo e qualquer dado recebido pela API (corpo da requisição, parâmetros de URL, cabeçalhos) é validado quanto ao tipo, formato e regras de negócio antes de ser processado, para prevenir **SQL Injection, XSS** e outras vulnerabilidades de injeção.

- [ ] **1.3 Criptografia de Dados**
  - **Em Trânsito:** a API força o uso de **HTTPS (Transport Layer Security - TLS)** em todos os endpoints para criptografar a comunicação e prevenir ataques de interceptação (Man-in-the-Middle).
  - **Em Repouso:** senhas de usuários são armazenadas no banco de dados usando um algoritmo de **hashing forte com salt** (ex: bcrypt ou Argon2).

- [ ] **1.4 Controle de Acesso e Exposição de Dados**
  - **Limitação de Requisições (Rate Limiting):** a API implementa um limite no número de requisições por um determinado período para proteger contra ataques de força bruta e negação de serviço (DoS).
  - **Não Exposição de IDs Sequenciais:** a API utiliza UUIDs em vez de IDs numéricos incrementais nas URLs para dificultar ataques de enumeração de recursos.
  - **Respostas Filtradas:** as respostas da API nunca incluem dados sensíveis como hashes de senha, tokens ou chaves de API.

- [ ] **1.5 Gerenciamento de Dependências (SCA)**
  - Todas as bibliotecas e dependências do projeto foram verificadas com ferramentas como `npm audit` ou OWASP Dependency-Check, e não existem vulnerabilidades críticas ou altas sem um plano de tratamento.

- [ ] **1.6 Logging para Segurança**
  - A API gera logs para eventos de segurança importantes (ex: tentativas de login falhas, acessos a endpoints críticos), sem nunca registrar informações sensíveis nos logs.

## 2. Autenticação e Gestão de Sessão (JWT)

- [ ] **2.1 Padrões Fortes:** não é usado autenticação básica. A autenticação é baseada em padrões modernos e seguros, como JWT. Portanto, não se reinventa a roda em criptografia, geração de tokens ou armazenamento de senhas.

- [ ] **2.2 Configuração Segura de JWT**
  - **Segredo Forte:** a chave secreta (JWT Secret) usada para assinar os tokens é longa, complexa e aleatória, armazenada de forma segura como uma variável de ambiente.
  - **Algoritmo Fixo:** o backend força o uso de um algoritmo de assinatura forte (ex: `HS256` ou `RS256`) e ignora o que for especificado no cabeçalho do token.
  - **Expiração Curta (Time To Live - TTL):** o tempo de vida do token de acesso é o menor possível para a usabilidade da aplicação (ex: 15-60 minutos).
  - **Payload Mínimo:** o corpo (payload) do JWT não contém informações sensíveis, pois ele pode ser facilmente decodificado.

## 3. Autorização e Controle de Acesso

- [ ] **3.1 Verificação em Todos os Níveis:** a verificação de permissão é feita em cada endpoint. Não assume-se que, por ter passado por um endpoint, o usuário tenha acesso a todos os outros.

- [ ] **3.2 Prevenção de IDOR (Insecure Direct Object Reference):** a lógica de negócio sempre verifica se o usuário autenticado é o "dono" do recurso que ele está tentando acessar.

  > **Prática:** em vez de `GET /users/123/orders`, usa-se `GET /me/orders`, onde `/me` é um atalho para o ID do usuário autenticado a partir do seu token.

## 4. Validação de Requisição e Resposta (I/O)

- [ ] **4.1 Requisições Seguras**
  - **Verbos HTTP Corretos:** são usados os verbos HTTP apropriados para cada ação: `GET` para leitura, `POST` para criação, `PUT`/`PATCH` para atualização e `DELETE` para remoção.
  - **Validação de Cabeçalhos:** a API valida os cabeçalhos `Content-Type` e `Accept` para garantir que está recebendo e enviando dados nos formatos que ela espera (ex: `application/json`).
  - **Dados Sensíveis Fora da URL:** credenciais, tokens e senhas nunca são passados como parâmetros de URL. Usa-se o cabeçalho `Authorization` para tokens.

- [ ] **4.2 Respostas Seguras**
  - **Cabeçalhos de Segurança:** as respostas da API incluem cabeçalhos de segurança essenciais:
    ```
    Content-Security-Policy: default-src 'none'
    X-Content-Type-Options: nosniff
    X-Frame-Options: deny
    ```
  - **Ocultação de Informações:** são removidos cabeçalhos que identificam a tecnologia do servidor (ex: `X-Powered-By`, `Server`).
  - **Códigos de Status Corretos:** são usados códigos de status HTTP que refletem o resultado da operação (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`).

## 5. Processos de Build e Deploy (CI/CD)

- [ ] **5.1 Automação de Segurança**
  - **Testes de Segurança:** testes unitários e de integração cobrem a lógica de segurança (autenticação, autorização).
  - **Análise Estática (SAST):** ferramentas de análise estática são executadas no código a cada commit ou pull request para encontrar vulnerabilidades potenciais.
  - **Análise de Dependências (SCA):** a verificação de dependências vulneráveis é uma etapa automatizada no pipeline.

- [ ] **5.2 Revisão de Código:** todo código novo, especialmente aquele que lida com lógica de segurança, passa por uma revisão cruzada antes de ser integrado à branch principal.

*Fonte e Adaptação: Este checklist foi adaptado para o contexto do projeto de TCC a partir de um checklist do mercado de trabalho na qual é uma obra derivada do API Security Checklist do projeto Shieldfy.*

### Histórico de Versão
Data     | Versão | Descrição | Autor | Revisor
-------- | ------ | --------- | ----- | ---------
26/09/26 | 1.0 | Criação do Checklist de Medidas de Segurança - API do Projeto | [Pedro Henrique](https://github.com/phmelosilva) | [João Pedro Morbeck](https://github.com/uMorbeck) 