# Checklist de Segurança Front-End, User Interface e User Experience (UI/UX)

## Introdução
Este checklist é uma ferramenta prática para guiar e verificar a implementação de medidas de segurança na camada de frontend do projeto. Ele foi adaptado de padrões da indústria para o contexto de desenvolvimento ágil do trabalho.

Cada item deve ser verificado durante o desenvolvimento e, principalmente, antes da conclusão de uma funcionalidade (*feature*). Itens que não se aplicam ao contexto específico da tarefa podem ser marcados como **N/A (Não se Aplica)**, desde que a decisão seja consciente e, se necessário, documentada.

## 1. Checagem Essencial (Quick-Check)
Esta seção cobre os pontos mais críticos e deve ser revisada para toda funcionalidade que envolva interface de usuário.

### [ ] 1.1 Validação e Sanitização de Entradas
*Toda e qualquer entrada de usuário é um vetor de ataque em potencial. Nunca confie nos dados que chegam ao frontend.*

- [ ] **Validação no Cliente**: Todos os formulários e campos de entrada possuem validação de formato, tipo e tamanho (ex: usando atributos do HTML5 como required, pattern, maxlength, ou bibliotecas como Unform/VeeValidate).
- [ ] **Tratamento de Erros**: A interface reage de forma clara e amigável a dados inválidos, informando ao usuário o que precisa ser corrigido, sem expor detalhes técnicos do erro.
- [ ] **Sanitização de Saída (Output Encoding)**: Todo dado vindo de uma fonte externa (API, usuário) que será exibido na tela é devidamente "escapado" para neutralizar a execução de scripts. Frameworks modernos (React, Vue) fazem isso por padrão, mas é preciso verificar se não está sendo usado mecanismos perigosos como dangerouslySetInnerHTML ou v-html sem um motivo crítico e tratamento adequado.

### [ ] 1.2 Proteção Contra CSRF (Cross-Site Request Forgery)
Garante que uma ação só pode ser iniciada a partir da nossa própria aplicação.

- [ ] **Uso de Tokens Anti-CSRF:** Para todas as requisições que alteram estado (POST, PUT, DELETE), o backend exige um token anti-CSRF, e o frontend está configurado para enviar esse token a cada requisição. (Ex: usando bibliotecas como csurf no backend e garantindo que o Axios/Fetch o inclua nos cabeçalhos).

### [ ] 1.3 Controle de Acesso no Frontend (Autenticação/Autorização)
O frontend deve ser uma camada "burra" em relação às regras de autorização, mas deve reagir corretamente às decisões do backend.

- [ ] **Armazenamento Seguro de Tokens**: Tokens de sessão (como JWT) não são armazenados em locais facilmente acessíveis por scripts, como o localStorage. Preferimos armazenamento em memória ou, se necessário, sessionStorage. (Para este trabalho, localStorage pode ser aceitável, desde que o risco seja documentado).
- [ ] **Envio de Tokens**: Todas as requisições para endpoints protegidos da API incluem o token de autenticação no cabeçalho Authorization.
- [ ] **Tratamento de Respostas 401/403**: A aplicação trata adequadamente respostas de "Não Autorizado" (401) ou "Proibido" (403) da API, redirecionando o usuário para a tela de login ou exibindo uma mensagem de acesso negado, sem quebrar a interface.
- [ ] **Ocultação de UI**: Elementos da interface (botões, menus) que correspondem a ações não autorizadas para o perfil do usuário atual são ocultados ou desabilitados. Importante: Isso é apenas uma medida de UX; a verdadeira segurança está na validação do backend.

### [ ] 1.4 Segurança na Comunicação e APIs
Garantir que a comunicação entre o frontend e o backend é segura e que não expomos informações sensíveis.

- [ ] **Uso de HTTPS**: Todas as chamadas de API são feitas para endpoints com SSL/TLS (HTTPS). O site força o uso de HTTPS em todas as páginas.
- [ ] **Não Exposição de Chaves**: O código do frontend não contém chaves de API, senhas ou qualquer outra credencial sensível "hardcoded". Essas informações devem residir no backend ou ser gerenciadas por variáveis de ambiente seguras.

## 2. Segurança e Experiência do Usuário (UX)
A segurança não deve ser um obstáculo intransponível, mas sim uma camada de confiança para o usuário.

### [ ] 2.1 Feedback de Segurança Claro
- [ ] **Notificações Visíveis**: A interface informa claramente ao usuário sobre o sucesso ou falha de ações de segurança (ex: "Login bem-sucedido", "Senha incorreta", "Sua sessão expirou").
- [ ] **Indicadores de Força de Senha**: O formulário de cadastro/alteração de senha possui um medidor de força que guia o usuário a criar uma senha mais segura, informando os critérios (mínimo de caracteres, uso de números e caracteres especiais, etc.).
- [ ] **Consciência sobre *Phishing***: A interface evita usar padrões que possam ser confundidos com *phishing* (ex: e-mails com links diretos para "redefinir sua senha aqui" sem terem sido solicitados).

### [ ] 2.2 Conformidade e Transparência (LGPD)
Demonstrar respeito aos dados do usuário é um pilar da segurança. Para seguir isso, é indispensável seguir conformidade quanto a Lei Geral de Proteção de Dados Pessoais (LGPD).

- [ ] **Política de Privacidade**: Existe um link claro e acessível para a Política de Privacidade do projeto.
- [ ] **Consentimento de Cookies**: Se cookies não essenciais são usados, um banner de consentimento é exibido, permitindo que o usuário aceite ou rejeite.

## 3. Processos e Integração
Garantir que as práticas de segurança estão integradas ao nosso fluxo de trabalho.

### [ ] 3.1 Aderência aos Requisitos de Segurança do Projeto
Este item substitui uma modelagem de ameaças formal. Ele conecta o desenvolvimento com o nosso planejamento.

- [ ] **Revisão dos Requisitos**: A funcionalidade implementada foi revisada em relação aos Requisitos de Segurança definidos na seção 2 das [Diretrizes](./guidelines.md)? Verifica-se se todos os requisitos aplicáveis à *feature* foram atendidos.

### [ ] 3.2 Gerenciamento de Dependências
Dependências são extensões do código desenvolvido. Por isso é necessário conferir:

[ ] **Verificação de Vulnerabilidades**: Uma verificação com *npm audit*(ou equivalente) foi executada após a adição/atualização de dependências. Não existem vulnerabilidades críticas ou altas sem um plano de tratamento (atualização ou documentação do risco).

### [ ] 3.3 Integração com Outras Camadas
- [ ] **Validação do Checklist de Backend/API**: Confirma-se que os endpoints da API que estão sendo consumidos por esta funcionalidade do frontend também foram verificados e aprovados em seu próprio checklist de segurança.

---

### Histórico de Versão
Data     | Versão | Descrição | Autor | Revisor
-------- | ------ | --------- | ----- | ---------
26/09/26 | 1.0 | Criação do Checklist de Medidas de Segurança - Frontend | [Pedro Henrique](https://github.com/phmelosilva) | [João Pedro Morbeck](https://github.com/uMorbeck) 