# Informações Gerais

| Sprint | Período | Data Reunião de Planejamento | Data Reunião de Review | Participantes |
|---|---|---|---|---|
| 1 | 22/09/26 - 06/10/26 | 22/09/26 | dd/mm/yy | Pedro Henrique da Silva Melo e João Pedro Rodrigues Morbeck |

## Planejamento da Sprint

### 1. Objetivo da Sprint

*O que pretendemos entregar de valor prático nesta iteração para o software?*

- **Objetivo:** Sendo a sprint que mais agrega valor ao cliente, o objetivo envolve desenvolver o motor de navegação e mapa interativo das trilhas (Feature 2), os laboratórios de prática e avaliação de código e exercícios (Feature 4) e Central de Consulta Rápida - Guias de Revisão (Feature 5).
- O planejamento envolve desenvolver a Feature 5 até o final da primeira semana da sprint ao mesmo tempo em que o planejamento e refinamento dos requisitos relacionados às Features 2 e 4 são realizados em paralelo tendo início de desenvolvimento para a segunda semana da sprint.

### Histórias de Usuário Planejadas

- **Link para o Quadro do Projeto:** [GitHub Projects](https://github.com/users/uMorbeck/projects/3/views/1)

| ID | História de Usuário (US) | Critérios de Aceitação / Como Demonstrar | Status Final |
|---|---|---|---|
| **US01** | Como visitante, quero me cadastrar na plataforma de estudos para que eu possa criar uma conta de usuário e acessar os conteúdos. | 1. O formulário deve exigir username, email e senha.<br>2. A senha deve possuir no mínimo 8 caracteres e no máximo 20, contendo ao menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.<br>3. O email deve ser único, caso já esteja cadastrado, a aplicação deve retornar uma mensagem indicando que o email já foi cadastrado.<br>4. A senha deve ser criptografada antes de ser armazenada no banco de dados.<br>5. Após um cadastro com sucesso, a aplicação deve autenticar o usuário e direcionar para a página principal. | [Entregue / Cancelado / Pendente] |
| **US02** | Como estudante, eu quero visualizar as informações do meu próprio perfil, para que eu possa conferir meus dados cadastrais. | 1. Deve exibir nome de usuário na barra de navegação.<br>2. A tela deve exibir os dados do estudante: nome de usuário, e-mail, data de cadastro.<br>3. Informações sensíveis (como senha ou tokens de autenticação) não devem ser exibidas nem expostas no payload da resposta da API.<br>4. Apenas o próprio usuário autenticado pode acessar a rota do seu perfil; requisições não autenticadas devem retornar código 401 Unauthorized. | [Entregue / Cancelado / Pendente] |
| **US03** | Como estudante, eu quero editar as informações do meu perfil, para que eu possa manter meus dados atualizados. | 1. O usuário deve poder alterar nome, email e senha.<br>2. A alteração de e-mail deve exigir reautenticação (inserção da senha atual) e envio de link de validação para o novo endereço.<br>3. Ao salvar as alterações com sucesso, o sistema deve exibir uma mensagem toast/notificação: *"Perfil atualizado com sucesso"* e refletir os novos dados imediatamente na interface.<br>4. Caso a conexão falhe ou os dados sejam inválidos, o sistema deve manter os dados anteriores e exibir o erro correspondente sem limpar os campos preenchidos. | [Entregue / Cancelado / Pendente] |
| **US04** | Como estudante, eu quero deletar a minha conta da plataforma, para que eu possa gerenciar a privacidade dos meus dados. | 1. O botão de exclusão deve acionar um modal de confirmação com aviso explícito de ação irreversível.<br>2. Para confirmar a exclusão, o sistema deve exigir a digitação da senha atual do usuário.<br>3. Após a confirmação, a sessão do usuário deve ser encerrada imediatamente, redirecionando-o para a página pública inicial com a mensagem: *"Sua conta foi excluída com sucesso"*.<br>4. Os dados pessoais devem passar por exclusão lógica (soft delete) com anonimização conforme as diretrizes da LGPD, revogando imediatamente todos os tokens de acesso ativos. | [Entregue / Cancelado / Pendente] |
| **US05** | Como administrador, eu quero visualizar as informações da minha conta, para que eu possa conferir os dados do meu perfil administrativo. | 1. A tela deve exibir nome, e-mail cadastrado, nível de acesso/permissão administrativa (role) e último acesso registrado.<br>2. O acesso a esta rota deve ser restrito exclusivamente a usuários com a role ADMIN; tentativas de acesso por estudantes comuns devem retornar 403 Forbidden. | [Entregue / Cancelado / Pendente] |
| **US06** | Como estudante, eu quero acessar o catálogo de trilhas com visualização em cards, para que eu possa comparar os temas disponíveis e selecionar a trilha adequada aos meus objetivos de estudo. | 1. Cada trilha cadastrada deve ser exibida em um card contendo: título, descrição sumária e total de etapas/módulos.<br>2. Caso não tenha trilhas cadastradas, a interface deve renderizar uma mensagem informativa de estado vazio (empty state), indicando que nenhuma trilha está disponível no momento.<br>3. Ao clicar em um dos cards, a aplicação deve redirecionar a rota para a visualização do mapa daquela respectiva trilha. | [Entregue / Cancelado / Pendente] |
| **US07** | Como estudante, eu quero visualizar o fluxo da trilha estruturado em nós interativos (mapa) e carregar a tela de conteúdo ao acionar um nó selecionado, para que eu possa percorrer visualmente a sequência de tópicos e acessar o material didático de cada etapa. | 1. Todas as etapas/módulos devem ser dispostos visualmente como nós interativos interligados que representam o encadeamento do conteúdo.<br>2. Ao clicar em um dos nós, a aplicação deve carregar na tela a visualização correspondente ao conteúdo/exercício daquela etapa.<br>3. Ao retornar da visualização do nó, o sistema deve restaurar a visualização do mapa da trilha mantendo o foco/centralização no nó previamente selecionado. | [Entregue / Cancelado / Pendente] |

### Justificativa da Escolha do Escopo

O motor de navegação das trilhas e o laboratório de exercícios são as prioridades desta sprint pelo fato de comporem o principal valor da aplicação que gera aos usuários.

## 2. Sprint Review

### Histórias de Usuário Validadas (Entregues)

- **US01 — Cadastrar Visitante:** Validada com sucesso atendendo a todos os critérios de aceitação.
- **US02 — Consultar/Editar Perfil:** [Anotar se foi de fato entregue ou se ficou alguma pendência técnica para a próxima Sprint].
- **Total de Pontos Entregues (Velocidade Real):** [Soma dos pontos das USs de fato validadas e entregues nesta Sprint]

### Feedbacks dos Stakeholders / Orientador

As atividades estão em conformidade com o planejado. [Anotar aqui as observações e considerações feitas pelo orientador durante a apresentação do incremento funcional, ex: "Sugerido ajustar o design do botão de login"].

## 3. Sprint Retrospective

*Avaliação do processo de trabalho da dupla:*

- **O que funcionou bem (Continue):**
- **O que impediu o progresso (Stop):**
- **Ações de Melhoria para a Próxima Sprint (Act):**

---

*Fonte: Autores (2026)*