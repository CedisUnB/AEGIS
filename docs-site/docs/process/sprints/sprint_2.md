# Informações Gerais

| Sprint | Período | Data Reunião de Planejamento | Data Reunião de Review | Participantes |
|---|---|---|---|---|
| 1 | 22/09/26 - 06/10/26 | 22/09/26 | dd/mm/yy | Pedro Henrique da Silva Melo e João Pedro Rodrigues Morbeck |

## Planejamento da Sprint

### 1. Objetivo da Sprint

!!! abstract "Objetivo da Sprint"
    **O que pretendemos entregar de valor prático nesta iteração para o software?**<br>
    Sendo a sprint que mais agrega valor ao cliente, o objetivo envolve desenvolver o motor de navegação e mapa interativo das trilhas (Feature 2), os laboratórios de prática, avaliação e apresentação de conteúdo (Feature 4).<br>Durante o planejamento e refinamento das histórias das Features 2 e 4, chegou-se a conclusão que a Feature 5 não agrega tanto valor quanto ao que foi atribuido anteriormente, assim foi feito uma atualização no MoSCoW e incluído uma funcionalidade de revisão ao permitir que o usuário acesse os conteúdos que já foram concluídos.

### Histórias de Usuário Planejadas

- **Link para o Quadro do Projeto:** [GitHub Projects](https://github.com/CedisUnB/SecurityAPP/projects)

| Feature | ID | História de Usuário (US) | Critérios de Aceitação / Como Demonstrar | Status Final |
|---|---|---|---|---|
| 2 - Motor de Navegação de Trilhas | **US06** | Como um Estudante, eu quero acessar o catálogo de trilhas com visualização em cards, para que eu possa comparar os temas disponíveis e selecionar a trilha adequada aos meus objetivos de estudo. | O catálogo de trilhas deve ser exibido em um formato de grade centralizada e simétrica (visual similar a uma tela de seleção de fases), onde cada trilha é representada por um card contendo título, descrição sumária e total de nós/etapas. Cards de trilhas já iniciadas pelo estudante devem exibir um indicador de progresso (ex: "3 de 8 nós concluídos"). Caso não existam trilhas cadastradas, a interface deve exibir uma mensagem de estado vazio informando que nenhuma trilha está disponível no momento. Ao clicar em um card, a aplicação deve redirecionar para a visualização do mapa da respectiva trilha. | [Entregue / Cancelado / Pendente] |
| 2 - Motor de Navegação de Trilhas | **US07** | Como um Estudante, eu quero visualizar o fluxo da trilha estruturado em nós interativos (mapa), para que eu possa percorrer visualmente a sequência de tópicos e acessar o material didático de cada etapa. | As etapas de uma trilha devem ser exibidas como nós interativos conectados visualmente, dispostos em um caminho sequencial lógico. A estrutura de navegação deve obrigatoriamente intercalar os conteúdos: um nó que representa o conteúdo teórico deve ser ligado diretamente a um nó de exercícios práticos, que em seguida se liga a um nó de uma nova seção teórica, repetindo este ciclo até alcançar o nó de teste final da trilha. O nó correspondente à etapa mais avançada já alcançada pelo estudante deve ser visualmente destacado no mapa. Ao clicar em um nó, a aplicação deve carregar a tela de conteúdo correspondente. Ao retornar, o sistema deve restaurar a visualização do mapa com foco no nó previamente selecionado. | [Entregue / Cancelado / Pendente] |
| 2 - Motor de Navegação de Trilhas | **US08** | Como um Estudante, eu quero visualizar os nós que já concluí e estão disponíveis para revisão, para que eu possa acompanhar o meu progresso e acessar o material para revisar o que já aprendi. | 	Nós já concluídos pelo estudante devem ser visualmente diferenciados dos nós ainda não concluídos no mapa da trilha. Ao clicar em um nó já concluído, o sistema deve permitir reabrir o mesmo conteúdo que foi apresentado no 1° acesso do nó. O progresso geral da trilha (percentual ou contagem de nós concluídos) deve ficar visível para o estudante durante a navegação pelo mapa. | [Entregue / Cancelado / Pendente] |
| 2 - Motor de Navegação de Trilhas | **US09** | Como um Estudante, eu quero visualizar um nó com teste final na conclusão da trilha, para que assim eu possa avaliar meus conhecimentos e objetivos atingidos para finalizar a trilha. | Ao concluir todos os nós de conteúdo (leitura/exercício) de uma trilha, um nó de teste final deve se tornar disponível no mapa. O nó de teste final deve ser visualmente distinto dos demais (ex: ícone ou cor específica), indicando se tratar da etapa avaliativa conclusiva. Ao concluir o teste final com sucesso, a trilha deve ser marcada como concluída, refletindo esse status no catálogo (US06) e no mapa. | [Entregue / Cancelado / Pendente] |
| 3 - Apresentação e Prática de Conteúdos | **US12** | Como um Estudante, eu quero acessar o conteúdo teórico do nó de leitura, para que eu possa aprender o conteúdo antes de iniciar os exercícios. | Ao acessar um nó de leitura, o conteúdo teórico não deve ser exibido como um texto corrido extenso, mas sim distribuído em uma estrutura navegável e interativa (balão navegável com botões "Voltar" e "Próximo"). Ao alcançar o final da página, o sistema deve exibir uma área dedicada às referências bibliográficas e leituras complementares daquele assunto. O estudante deve poder marcar o nó como concluído após visualizá-lo. Deve haver uma ação clara para avançar ao próximo nó (exercício) após a leitura. | [Entregue / Cancelado / Pendente] |
| 3 - Apresentação e Prática de Conteúdos | **US13** | Como um Estudante, eu quero acessar o conteúdo prático do nó de exercício, para que eu possa praticar o que aprendi do assunto e reforçar o meu conhecimento. | Ao acessar um nó de exercício, o sistema deve exibir os enunciados das questões práticas vinculadas àquele nó. O estudante deve poder interagir com os campos de resposta conforme o tipo de exercício. O sistema deve indicar visualmente quais exercícios já foram respondidos anteriormente, mesmo antes da submissão final. | [Entregue / Cancelado / Pendente] |
| 3 - Apresentação e Prática de Conteúdos | **US14** | Como um Estudante, eu quero acessar o teste final da trilha, para que eu possa testar o meu conhecimento e concluir a trilha. | O nó de teste final deve exibir todas as questões avaliativas da trilha em uma única sessão de teste. O sistema deve impedir a submissão do teste caso alguma questão obrigatória não tenha sido respondida. Ao concluir o teste, o estudante deve visualizar um resumo do resultado (pontuação, acertos e erros). | [Entregue / Cancelado / Pendente] |
| 3 - Apresentação e Prática de Conteúdos | **US15** | Como um Estudante, eu quero submeter respostas para exercícios práticos e receber validação, para que eu possa testar o conhecimento adquirido na prática. | Ao submeter uma resposta de exercício, o sistema deve validar e indicar imediatamente se está correta ou incorreta. Caso a resposta esteja incorreta, o sistema deve oferecer a opção de tentar novamente ou visualizar feedback sobre o erro. Respostas corretas devem ser persistidas associadas ao estudante e ao nó, para exibição em modo de revisão (US08). | [Entregue / Cancelado / Pendente] |

### Justificativa da Escolha do Escopo

O motor de navegação das trilhas e o laboratório de exercícios são as prioridades desta sprint pelo fato de comporem o principal valor da aplicação que gera aos usuários.

## 2. Sprint Review

### Histórias de Usuário Validadas (Entregues)

- **US01 — Cadastrar Visitante:** Validada com sucesso atendendo a todos os critérios de aceitação.
- **US02 — Consultar/Editar Perfil:** [Anotar se foi de fato entregue ou se ficou alguma pendência técnica para a próxima Sprint].
- **Total de Pontos Entregues (Velocidade Real):** [Soma dos pontos das USs de fato validadas e entregues nesta Sprint]

### Feedbacks dos Stakeholders / Clientes / Orientador

Nesta sprint precisou-se atuar em atividades de requisitos de software quanto às Features planejadas para o escopo. Para isso, foram apresentadas aos clientes as opções de protótipos para a apresentação do conteúdo das trilhas, bem como as propostas visuais e funcionais para o catálogo e o mapa interativo.

A partir dessas validações, os seguintes pontos foram definidos em conjunto com os clientes:

- **Apresentação de Conteúdo (Nó de Leitura)**: A abordagem de apresentar o texto em blocos menores com navegação interna (formato de "balões navegáveis") foi amplamente preferida pelos clientes por ser visualmente mais dinâmica e menos monótona do que formatos tradicionais de texto corrido.

- **Organização das Referências**: A decisão de consolidar as referências bibliográficas e links complementares sempre ao final da estrutura do balão de conteúdo foi validada e bem recebida.

- **Catálogo de Trilhas**: Validou-se que o acesso primário às trilhas (Catálogo) adotará um layout estruturado em formato de grade (inspirado em telas clássicas de seleção de fases de jogos), facilitando a visão geral das opções disponíveis para o estudante.

- **Mapa Interativo (Navegação Interna)**: A progressão dentro de cada trilha foi validada para seguir um caminho contínuo e estritamente sequencial. A estrutura seguirá o padrão de intercalar conteúdos, fluindo de um nó teórico diretamente para um nó de exercício prático referente ao tema estudado, e em seguida para um novo nó de teoria, até que o estudante alcance o nó do teste final de avaliação.

- **Formato dos Exercícios**: Os exercícios devem atender a diferentes tipos de formatos, os quais os seguintes foram validados:
    - Múltipla escolha;
    - Verdadeiro ou Falso;
    - Completa a Frase ou Complete o Código;
    - Bloco que pode ser arrastável para a resposta.

## 3. Sprint Retrospective

*Avaliação do processo de trabalho da dupla:*

- **O que funcionou bem (Continue):**
- **O que impediu o progresso (Stop):**
- **Ações de Melhoria para a Próxima Sprint (Act):**

---

*Fonte: Autores (2026)*