# Requisitos Não Funcionais (RNF)

Os Requisitos Não Funcionais especificam características e restrições de qualidade, desempenho, segurança e usabilidade do sistema como um todo. A seguir está listado os requisitos não funcionais elicitados pela tabela 1.

**Tabela 1 – Requisitos Não Funcionais**

| ID | Categoria | Descrição |
|---|---|---|
| RNF01 | Segurança | O sistema deve ser seguro, protegendo os dados dos usuários contra vulnerabilidades web e garantir controle de acesso restrito (impedindo que usuários acessem rotas do administrador). |
| RNF02 | Usabilidade | A interface da aplicação (feita em React) deve ser responsiva, adaptando-se perfeitamente a diferentes tamanhos de tela (desktop, tablets e smartphones). |
| RNF03 | Desempenho | O sistema deve processar o *feedback* das avaliações de código e quizzes com tempo de resposta de até 3 segundos. |
| RNF04 | Suportabilidade | A arquitetura do sistema deve ser projetada de forma modular e extensível, permitindo a implementação futura de novas features (funcionalidades) com o mínimo de impacto e refatoração no código existente. |
| RNF05 | Implementação | O ambiente de implantação/banco de dados deve ser configurado para que a única conta de administrador seja criada automaticamente durante a inicialização do sistema, tornando-a previamente disponível para uso. |

*Fonte: Elaborada pelos autores.*

---

# Requisitos Funcionais

Os Requisitos Funcionais especificam o que é esperado de funcionalidades e características que definem o sistema de software. Foi estabelecido 6 features distintas para a tabela 2 os requisitos funcionais estão especificados no formato de histórias de usuário.

- Feature 1: Autenticação e Gestão de Contas
- Feature 2: Motor de Navegação de Trilhas - Mapa de exibição Trilhas
- Feature 3: Painel de Progresso do Estudante
- Feature 4: Laboratório de Prática e Avaliação de Código - Exercícios
- Feature 5: Central de Consulta Rápida - Guias de Revisão
- Feature 6: Painel de Gestão e Métricas do Administrador - Registro dos Conteúdos

**Tabela 2 – Requisitos Funcionais**

| Feature | ID | Como um (a)... (Ator) | Eu quero... (Ação) | Para que... (Valor/Justificativa) |
|---|---|---|---|---|
| 1 | US01 | Visitante | Me cadastrar na plataforma de estudos | Eu possa criar uma conta de usuário e acessar os conteúdos |
| 1 | US02 | Estudante | Visualizar as informações do meu próprio perfil | Eu possa conferir meus dados cadastrais |
| 1 | US03 | Estudante | Editar as informações do meu perfil | Eu possa manter meus dados atualizados |
| 1 | US04 | Estudante | Deletar a minha conta da plataforma | Eu possa gerenciar a privacidade dos meus dados. |
| 1 | US05 | Administrador | Visualizar as informações da minha conta | Eu possa conferir os dados do meu perfil administrativo. |
| 2 | US06 | Estudante | Acessar o catálogo de trilhas com visualização em cards | Eu possa comparar os temas disponíveis e selecionar a trilha adequada aos meus objetivos de estudo. |
| 2 | US07 | Estudante | Visualizar o fluxo da trilha estruturado em nós interativos (mapa) e carregar a tela de conteúdo ao acionar um nó selecionado | Eu possa percorrer visualmente a sequência de tópicos e acessar o material didático de cada etapa. |
| 3 | US08 | Estudante | Visualizar meu percentual de progresso específico em uma trilha | Eu saiba o quanto falta para concluir o tema atual. |
| 3 | US09 | Estudante | Visualizar meu progresso geral consolidado | Eu consiga acompanhar meu desempenho total na plataforma |
| 4 | US10 | Estudante | Submeter respostas para exercícios práticos e receber validação | Eu possa testar o conhecimento adquirido na prática. |
| 5 | US11 | Estudante | Acessar guias de revisão estruturados com base no tema | Eu possa relembrar conceitos técnicos de forma rápida. |
| 6 | US12 | Administrador | Criar novas trilhas de conhecimento e guias de revisão | Eu possa disponibilizar novos conteúdos para os estudantes. |
| 6 | US13 | Administrador | Visualizar as trilhas e guias já cadastrados | Eu possa auditar e acompanhar o catálogo da plataforma. |
| 6 | US14 | Administrador | Editar o conteúdo e a estrutura das trilhas e guias | Eu possa manter os materiais de apoio atualizados. |
| 6 | US15 | Administrador | Excluir trilhas de conhecimento e guias de revisão | Eu possa remover conteúdos obsoletos ou incorretos |
| 6 | US16 | Administrador | Acessar um painel métrico (dashboard) com dados de uso | Eu possa remover conteúdos obsoletos ou incorretos |

*Fonte: Elaborada pelos autores.*

---

# Definição de MVPs – Prioridade MoSCoW

## 1. Critérios de Priorização

Para definir a priorização de quais Features e Histórias devem ser desenvolvidas primeiro, é utilizada a regra MoSCoW a partir de uma pontuação composta por três critérios: Valor de Negócio, Viabilidade e Facilidade de Implementação. Os três critérios são definidos na mesma direção — quanto maior a pontuação em cada eixo, maior a prioridade da Feature — de modo que a soma resulte em um valor consistente.

### 1.1 Valor de Negócio

Definido numa escala de 1 a 5, resultante da soma de três critérios de pontuação binária:

| Pergunta | Pontos | O que avaliar |
|---|---|---|
| É necessário? | 2 pts | A funcionalidade é indispensável para que o produto cumpra seu propósito central — sem ela, o MVP não funciona ou perde sentido. |
| É urgente? | 2 pts | Sua ausência bloqueia ou atrasa a validação de outras funcionalidades, ou atende a uma demanda crítica identificada na pesquisa com usuários (TCC1). |
| É desejável? | 1 pt | Melhora a experiência ou complementa o produto, mas sua ausência não compromete o funcionamento do MVP. |

### 1.2 Viabilidade

Definida numa escala de 1 a 5, indicando o quanto a funcionalidade tem espaço para ser implementada sem preparação adicional de ambiente ou infraestrutura. Quanto maior a pontuação, mais viável é a funcionalidade no momento atual do projeto:

| Pontuação | Significado |
|---|---|
| 1 | Inviável no momento — depende de recursos/infraestrutura que ainda não existem. |
| 2 | Baixa viabilidade — exige preparação extensa (nova infraestrutura, pesquisa, integração externa). |
| 3 | Viabilidade moderada — exige alguma preparação, mas com caminho claro. |
| 4 | Alta viabilidade — poucos ajustes de ambiente necessários. |
| 5 | Totalmente viável — pode ser implementada imediatamente, sem preparação adicional. |

### 1.3 Facilidade de Implementação

Definida numa escala de 1 a 5, indicando o quão simples é desenvolver a funcionalidade. Este critério substitui o eixo originalmente nomeado "Complexidade", mantendo a mesma escala, porém invertendo o sentido da pontuação para alinhá-la à mesma direção dos demais critérios:

| Pontuação | Significado |
|---|---|
| 1 | Muito complexa — exige pesquisa técnica extensa ou integração com sistemas ainda não validados. |
| 2 | Complexa — exige esforço significativo de design técnico. |
| 3 | Complexidade moderada — esforço médio, com pontos de incerteza técnica. |
| 4 | Simples — implementação direta, poucos riscos técnicos. |
| 5 | Muito simples — praticamente direta, sem riscos técnicos relevantes. |

*Nota metodológica: o eixo originalmente nomeado "Complexidade" pontuava o quão difícil era implementar a funcionalidade, o que invertia o sentido da soma — uma Feature mais complexa recebia nota mais alta, elevando indevidamente sua pontuação MoSCoW final. O eixo foi redefinido como Facilidade de Implementação, preservando a mesma escala de 1 a 5, porém alinhada na mesma direção de Valor de Negócio e Viabilidade, de modo que a soma dos três critérios reflita corretamente a prioridade da Feature.*

## 2. Tabela de Priorização MoSCoW (Atualizada)

| Feature | Valor de Negócio | Viabilidade | Facilidade de Implementação | Pontuação | MoSCoW | MVP |
|---|---|---|---|---|---|---|
| F01 | 5 | 5 | 3 | 13 | Deve Ter | MVP1 |
| F02 | 5 | 4 | 2 | 11 | Deveria Ter | MVP1 |
| F03 | 3 | 3 | 4 | 10 | Deveria Ter | MVP2 |
| F04 | 5 | 4 | 1 | 10 | Deveria Ter | MVP1 |
| F05 | 3 | 4 | 4 | 11 | Deveria Ter | MVP1 |
| F06 | 3 | 2 | 3 | 8 | Pode Ter | MVP2 |

*Faixas de pontuação: 0–4 Não Ter · 5–8 Pode Ter · 9–12 Deveria Ter · 13–15 Deve Ter.*

<center>

Fonte: Elaborada pelos autores.

</center>

## 3. Justificativa da Composição do MVP1

Embora F02 e F04 tenham migrado de "Deve Ter" para "Deveria Ter" após a correção da direção de pontuação do eixo de Facilidade de Implementação, ambas permanecem no MVP1 por dependência funcional direta: sem o Motor de Navegação de Trilhas (F02), o Estudante não consegue consumir nenhum conteúdo cadastrado, tornando o cadastro (F01) inútil isoladamente; sem o Laboratório de Prática (F04), o MVP se reduz a conteúdo passivo, sem a validação prática que constitui o diferencial da plataforma. A pontuação MoSCoW é um insumo de priorização, não uma regra mecânica de corte — a composição final do MVP1 combina a pontuação obtida com a análise de dependência funcional entre as Histórias de Usuário.

### Histórico de Versão
Data     | Versão | Descrição | Autor | Revisor
-------- | ------ | --------- | ----- | ---------
27/09/26 | 1.0 | Inclusão do documento no git pages | [Pedro Henrique](https://github.com/phmelosilva) | [João Pedro Morbeck](https://github.com/uMorbeck) 