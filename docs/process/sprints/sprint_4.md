# Informações Gerais

| Sprint | Período | Data Reunião de Planejamento | Data Reunião de Review | Participantes |
|---|---|---|---|---|
| 4 | 20/10/26 - 02/11/26 | 20/10/26 | dd/mm/yy | Pedro Henrique da Silva Melo e João Pedro Rodrigues Morbeck |

## Planejamento da Sprint

### 1. Objetivo da Sprint

!!! abstract "Objetivo da Sprint"
    **O que pretendemos entregar de valor prático nesta iteração para o software?**<br>
    Finalizar a implementação do MVP1 com a execução da Feature 3 (Painel de Progresso) e execução das tarefas de configuração de segurança 
    definidas no início do projeto.

### Histórias de Usuário Planejadas — Feature 3: Painel de Progresso

- **Link para o Quadro do Projeto:** [GitHub Projects](https://github.com/CedisUnB/SecurityAPP/projects)

| ID | História de Usuário (US) | Critérios de Aceitação / Como Demonstrar | Status Final |
|---|---|---|---|
| **US10** | Como um Estudante, eu quero visualizar meu percentual de progresso específico em uma trilha, para que eu saiba o quanto falta para concluir o tema atual. | 1. O card de cada trilha já iniciada no catálogo (`/tracks`) deve exibir o progresso como percentual de nós concluídos em relação ao total de nós da trilha, incluindo o nó de teste final na contagem.<br>2. O percentual deve ser acompanhado da contagem de nós (ex: "3/8 concluídos · 38%"), de modo que o estudante saiba quantas etapas faltam.<br>3. Uma trilha com todos os nós concluídos deve exibir 100% e ser identificada como concluída; uma trilha ainda não iniciada não exibe indicador de progresso, conforme a US06.<br>4. O percentual deve considerar apenas o progresso do estudante autenticado, sem refletir o progresso de outros usuários.<br>5. O percentual deve ser atualizado após o estudante concluir um nó, sem ação manual além de retornar à tela. | Entregue |
| **US11** | Como um Estudante, eu quero visualizar meu progresso geral consolidado, para que eu consiga acompanhar meu desempenho total na plataforma. | 1. A tela de perfil (`/profile`) deve exibir um progresso geral consolidado do estudante, calculado sobre todas as trilhas da plataforma (total de nós concluídos em relação ao total de nós).<br>2. O consolidado deve exibir também a quantidade de trilhas concluídas em relação ao total de trilhas disponíveis (ex: "2 de 10 trilhas concluídas").<br>3. Trilhas ainda não iniciadas devem entrar no total, de modo que o percentual geral reflita o que falta cumprir na plataforma.<br>4. Um estudante sem nenhum progresso deve ver o consolidado zerado (0%), sem erro ou área em branco; sem trilhas cadastradas, deve ver uma mensagem de estado vazio.<br>5. O consolidado deve considerar apenas o progresso do estudante autenticado e ser coerente com os percentuais por trilha exibidos no catálogo (US10). | Entregue |

### Tarefas Planejadas

|                            Tarefa                           |                                     Entrega Esperada                                     | Status Final |
|-------------------------------------------------------------|------------------------------------------------------------------------------------------|--------------|
| Ajustar a responsividade das páginas                        | Todas as páginas responsivas                                                             | Entregue     |
| Padronizar cores e atributos de estilização do projeto      | Estilização e cores padronizadas por todo o projeto                                      | Entregue     |
| Configurar cabeçalhos HTTP de segurança                     | Cabeçalhos HTTP configurados e requisições seguras                                       | Entregue     |
| Publicar Política de Privacidade e disponibilizar link      | Página da Política de Privacidade acessível                                              | Entregue     |
| Adicionar indicador de força de senha                       | Indicador de senha na página de cadastro funcionando                                     | Entregue     |
| Implementar Rate Limiting no Login                          | Rate limiting implementado e impedindo acesso por 15 minutos após atingir o limite       | Entregue     |
| Implementar tokens access + refresh                         | Tokens atualizados e funcionando, banco de dados atualizado para receber o refresh token | Entregue     |
| Automatizar verificação de vulnerabilidades de dependências | Novo job criado no CI, operando com npm audit                                            | Entregue     |
| Não expor mensagens internas de erros ao cliente            | Todas as mensagens de erro tratadas                                                      | Entregue     |

### Justificativa da Escolha do Escopo

O foco da sprint é finalizar a entrega do MVP1 focando em entregar o máximo de valor e preparar para validação dos clientes após o deploy, 
além de fazer correções identificadas durante o desenvolvimento da aplicação.

### Feedbacks dos Stakeholders / Clientes / Orientador

O orientador apontou a grande quantidade de trabalho restante e o pouco tempo disponível para finalizar o projeto, o foco da equipe 
se voltou a finalizar o máximo de tarefas possível, com foco nos que são considerados mais importantes e que sua implementação seja rápida.

## 2. Sprint Review
-

### Histórias de Usuário Validadas (Entregues)

- 

## 3. Sprint Retrospective

*Avaliação do processo de trabalho da dupla:*

### ✅ O que funcionou bem (Continue)
- 

### 🛑 O que impediu o progresso (Stop)
- 

### 🚀 Ações de Melhoria para a Próxima Sprint (Act)
- 

---

*Fonte: Autores (2026)*