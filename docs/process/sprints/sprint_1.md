# Relatório da Sprint 1

## Informações Gerais

| Sprint | Período | Data Reunião de Planejamento | Data Reunião de Review | Participantes |
| :---: | :---: | :---: | :---: | :--- |
| **1** | 07/09/26 - 20/09/26 | 08/09/26 | 21/09/26 | Pedro Henrique da Silva Melo e João Pedro Rodrigues Morbeck |

---

## 1. Planejamento da Sprint

!!! abstract "Objetivo da Sprint"
    **O que pretendemos entregar de valor prático nesta iteração para o software?**<br>
    Desenvolver as fundações de autenticação, gestão de contas e o motor de navegação e mapa interativo das trilhas (US01, US02, US03, US04, US05, US06 e US07).

### Histórias de Usuário Planejadas

*[Link para o Quadro do Projeto (GitHub Projects)](https://github.com/CedisUnB/SecurityAPP/projects)*

| Feature | ID | História de Usuário (US) | Critérios de Aceitação / Como Demonstrar | Status Final |
| :---: | :---: | :--- | :--- | :---: |
| 1 - Autenticação e Gestão de Contas | **US01** | Como visitante, quero me cadastrar na plataforma de estudos para que eu possa criar uma conta de usuário e acessar os conteúdos. | 1. O formulário deve exigir username, email e senha.<br>2. A senha deve possuir no mínimo 8 caracteres e no máximo 20, contendo ao menos uma letra maiuscula, uma letra minuscula, um número e um caracter especial (RN01 - Formato da senha).<br>3. O email deve ser único, caso já esteja cadastrado, a aplicação deve retornar uma mensagem indicando que o email já foi cadastrado (RN02 - Email Único).<br>4. A senha deve ser criptografada antes de ser armazenada no banco de dados (RNF01 - Segurança).<br>5. Após um cadastro com sucesso, a aplicação deve autenticar o usuário e direcionar para a página principal. | ✅ Entregue |
| 1 - Autenticação e Gestão de Contas | **US02** | Como estudante, eu quero visualizar as informações do meu próprio perfil, para que eu possa conferir meus dados cadastrais. | 1. Deve exibir nome de usuário na barra de navegação.<br>2. A tela deve exibir os dados do estudante: nome de usuário, e-mail e data de cadastro.<br>3. Informações sensíveis (como senha ou tokens de autenticação) não devem ser exibidas nem expostas no payload da resposta da API (RNF01 - Segurança).<br>4. Apenas o usuário autenticado pode acessar a rota de perfil (RN03 - Exigir autenticação para ver perfil).<br>5. As requisições não autenticadas devem retornar código 401 Unauthorized (RNF01 - Segurança). | ✅ Entregue |
| 1 - Autenticação e Gestão de Contas | **US03** | Como estudante, eu quero editar as informações do meu perfil, para que eu possa manter meus dados atualizados. | 1. O usuário deve poder alterar nome, email e senha.<br>2. A alteração de e-mail ou senha deve exigir reautenticação (invalidar o token e realizar o login novamente) (RNF01 - Segurança).<br>3. Ao salvar as alterações com sucesso, o sistema deve exibir uma mensagem toast/notificação: "Perfil atualizado com sucesso" e refletir os novos dados imediatamente na interface.<br>4. Caso a conexão falhe ou os dados sejam inválidos, o sistema deve manter os dados anteriores e exibir o erro correspondente sem limpar os campos preenchidos. | ✅ Entregue |
| 1 - Autenticação e Gestão de Contas | **US04** | Como estudante, eu quero deletar a minha conta da plataforma, para que eu possa gerenciar a privacidade dos meus dados. | 1. O botão de exclusão deve acionar um modal de confirmação com aviso explícito de ação irreversível.<br>2. Para confirmar a exclusão, o sistema deve exigir a digitação da senha atual do usuário (RN04 - Exclusão da conta exige senha).<br>3. Após a confirmação, a sessão do usuário deve ser encerrada imediatamente, redirecionando-o para a página pública inicial com a mensagem: "Sua conta foi excluída com sucesso" (RNF01 - Segurança).<br>4. Os dados pessoais devem passar por exclusão lógica (soft delete) com anonimização conforme as diretrizes da LGPD, revogando imediatamente todos os tokens de acesso ativos (RN05 - Exclusão de acordo com a LGPD). | ✅ Entregue |
| 1 - Autenticação e Gestão de Contas | **US05** | Como administrador, eu quero visualizar as informações da minha conta, para que eu possa conferir os dados do meu perfil administrativo. | 1. A tela deve exibir nome, e-mail cadastrado, nível de acesso/permissão administrativa (role) e último acesso registrado.<br>2. O acesso a esta rota deve ser restrito exclusivamente a usuários com a role ADMIN; tentativas de acesso por estudantes comuns devem retornar 403 Forbidden (RNF01 - Segurança). | ✅ Entregue |
| 2 - Motor de Navegação de Trilhas | **US06** | Como estudante, eu quero acessar o catálogo de trilhas com visualização em cards, para que eu possa comparar os temas disponíveis e selecionar a trilha adequada aos meus objetivos de estudo. | 1. O catálogo de trilhas deve ser exibido em um formato de grade centralizada e simétrica (visual similar a uma tela de seleção de fases) (RNF02 - Usabilidade).<br>2. Cada trilha é representada por um card contendo título e total de nós/etapas; ao clicar no card, um modal deve exibir a descrição sumária da trilha.<br>3. Cards de trilhas já iniciadas pelo estudante devem exibir um indicador de progresso (ex: "3 de 8 nós concluídos").<br>4. Caso não existam trilhas cadastradas, a interface deve exibir uma mensagem de estado vazio informando que nenhuma trilha está disponível no momento.<br>5. Ao clicar em um card, a aplicação deve abrir um modal com os detalhes da trilha. A partir dele, o usuário deve poder confirmar e ser redirecionado para a visualização do mapa da respectiva trilha.<br>6. A trilha deve ser estruturada com um tema específico, um conjunto de lições e um conjunto de exercícios (RN06 - Estrutura de Aprendizado Obrigatória).| ⏳ Pendente |
| 2 - Motor de Navegação de Trilhas | **US07** | Como estudante, eu quero visualizar o fluxo da trilha estruturado em nós interativos (mapa) e carregar a tela de conteúdo ao acionar um nó selecionado, para que eu possa percorrer visualmente a sequência de tópicos e acessar o material didático de cada etapa. | 1. As etapas de uma trilha devem ser exibidas como nós interativos conectados visualmente, dispostos em um caminho sequencial lógico.<br>2. A estrutura de navegação deve obrigatoriamente intercalar os conteúdos: um nó teórico ligado a um nó de exercícios práticos, repetindo até o nó de teste final (RN07 - Ordem dos nós).<br> 3. O nó correspondente à etapa mais avançada já alcançada pelo estudante deve ser visualmente destacado no mapa.<br> 4. Ao clicar em um nó, a aplicação deve carregar um modal de confirmação correspondente.<br> 5. Ao retornar, o sistema deve restaurar a visualização do mapa com foco no nó previamente selecionado. | ⏳ Pendente |

### Justificativa da Escolha do Escopo
As histórias desta sprint foram selecionadas por se tratarem do fluxo de login e identificação inicial do usuário, que funciona como base de sessão necessária para que o restante das funcionalidades lógicas de trilhas e persistência de progresso consiga operar de forma segura no BFF Next.js, além de iniciar o desenvolvimento da parte mais fundamental da aplicação, esta sendo a navegação das trilhas de conhecimento.

## 2. Sprint Review

### Histórias de Usuário Validadas (Entregues)
* **US01** – Como visitante, quero me cadastrar na plataforma de estudos para que eu possa criar uma conta de usuário e acessar os conteúdos.
* **US02** – Como estudante, eu quero visualizar as informações do meu próprio perfil, para que eu possa conferir meus dados cadastrais.
* **US03** – Como estudante, eu quero editar as informações do meu perfil, para que eu possa manter meus dados atualizados.
* **US04** – Como estudante, eu quero deletar a minha conta da plataforma, para que eu possa gerenciar a privacidade dos meus dados.
* **US05** – Como administrador, eu quero visualizar as informações da minha conta, para que eu possa conferir os dados do meu perfil administrativo.

**Total de Pontos Entregues (Velocidade Real):** De 7 histórias planejadas, 5 foram concluídas e entregues.

### Feedbacks dos Stakeholders / Orientador
O professor orientador sugeriu focar em como apresentar as trilhas, utilizando-se de apenas 1 trilha com conteúdo pronto como base para demonstrar como elas devem ser apresentadas e estruturadas para o usuário. 

Além disso, ficou sugerido de criar e definir essa estrutura de como apresentar as trilhas e realizar validações com os clientes do produto, e de que o painel de gestão do conteúdo precisa de atenção pensando no aspecto de como cadastrar os conteúdos, de fato, no produto.

## 3. Sprint Retrospective

**Avaliação do processo de trabalho da dupla:**

### ✅ O que funcionou bem (Continue)
* O planejamento da sprint;
* A divisão de tarefas;
* Programação em pares;
* Comunicação;
* Descrição do kanban.

### 🛑 O que impediu o progresso (Stop)
* Trabalhar nas trilhas e no app ficou pesado;
* Conciliação das atividades do projeto com questões pessoais e da faculdade;
* Falta de uma prototipação (pelo menos de baixa).

### 🚀 Ações de Melhoria para a Próxima Sprint (Act)
* Estabelecer um processo de prototipação para as histórias e tarefas;
* Focar em trabalhar no app e sua estrutura enquanto refina-se apenas uma das trilhas para apresentação;
* Ajustar o Docker para instalar novas dependências ao inicializar o container;
* Ajustar o formulário de cadastro para informar as condições sobre a senha ao mesmo tempo que o usuário digita e adicionar um segundo campo para confirmar a senha.

<br>

*Fonte: Autores (2026)*