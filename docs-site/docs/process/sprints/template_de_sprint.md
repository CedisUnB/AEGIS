# Relatório da Sprint [Número]

## Informações Gerais

| Sprint | Período | Data Reunião de Planejamento | Data Reunião de Review | Participantes | 
| :---: | :---: | :---: | :---: | :--- | 
| **[X]** | dd/mm/yy - dd/mm/yy | dd/mm/yy | dd/mm/yy | Pedro Henrique da Silva Melo e João Pedro Rodrigues Morbeck | 

## 1. Planejamento da Sprint

!!! abstract "Objetivo da Sprint"
    **O que pretendemos entregar de valor prático nesta iteração para o software?**
    
    Objetivo: [Ex: Desenvolver as fundações de autenticação e contas (US01 e US02)].

### Histórias de Usuário Planejadas

[*Link para o Quadro do Projeto (GitHub Projects)*](https://github.com/inserir-link)

| ID | História de Usuário (US) | Critérios de Aceitação / Como Demonstrar | Status Final | 
| --- | --- | --- | --- | 
| **US01** | Como visitante, quero me cadastrar na plataforma... | 1. Validação de formato de e-mail.<br>2. Criptografia da senha no MySQL via Prisma.<br>3. Redirecionamento para a tela `/learn`. | [Entregue / Cancelado / Pendente] | 
| **US02** | Como usuário autenticado, quero consultar meu perfil... | 1. Exibir nickname na barra de navegação.<br>2. Permitir edição de nickname e imagem de perfil. | [Entregue / Cancelado / Pendente] | 

### Justificativa da Escolha do Escopo

[Escrever a justificativa aqui. Ex: As histórias desta sprint foram selecionadas por se tratarem do fluxo de login e identificação inicial do usuário, que funciona como o Trust Boundary (limiar de confiança) e a base de sessão necessária para que o restante das funcionalidades lógicas de trilhas e persistência de progresso consiga operar de forma segura no BFF Next.js.]

## 2. Sprint Review

### Histórias de Usuário Validadas (Entregues)

* **US01 – Cadastrar Visitante**: Validada com sucesso atendendo a todos os critérios de aceitação.
* **US02 – Consultar/Editar Perfil**: [Anotar se foi de fato entregue ou se ficou alguma pendência técnica para a próxima Sprint].

**Total de Pontos Entregues (Velocidade Real):** [Soma dos pontos das USs de fato validadas e entregues nesta Sprint].

### Feedbacks dos Stakeholders / Orientador

[Anotar aqui as observações e considerações feitas pelo orientador durante a apresentação do incremento funcional, ex: "Sugerido ajustar o design do botão de login"].

## 3. Sprint Retrospective

**Avaliação do processo de trabalho da dupla:**

### ✅ O que funcionou bem (Continue)

* [Ex: boa comunicação diária, programação em pares no repositório Prisma]

### 🛑 O que impediu o progresso (Stop)

* [Ex: conciliação com exames de outras matérias, dúvidas com conexão elástica do MySQL]

### 🚀 Ações de Melhoria para a Próxima Sprint (Act)

* [Ex: configurar o pool de conexão do Prisma no primeiro dia da Sprint]

*Fonte: Autores (2026)*