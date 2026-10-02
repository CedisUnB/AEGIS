## Requisitos Não Funcionais (RNF)

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

## Requisitos Funcionais

Os Requisitos Funcionais especificam o que é esperado de funcionalidades e características que definem o sistema de software. Foi estabelecido 6 features distintas para a tabela 2 os requisitos funcionais estão especificados no formato de histórias de usuário.

- Feature 1: Autenticação e Gestão de Contas
- Feature 2: Motor de Navegação de Trilhas - Mapa de exibição Trilhas
- Feature 3: Painel de Progresso do Estudante
- Feature 4: Laboratório de Prática, Avaliação e Apresentação de Conteúdo - Exercícios e Conteúdos
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
| 2 | US07 | Estudante | Visualizar o fluxo da trilha estruturado em nós interativos (mapa) | Eu possa percorrer visualmente a sequência de tópicos e acessar o material didático de cada etapa. |
| 2 | US08 | Estudante | Visualizar os nós que já concluí e estão disponíveis para revisão | Eu possa acompanhar o meu progresso e acessar o material para revisar o que já aprendi. |
| 2 | US09 | Estudante | Visualizar ao final da trilha um nó de teste final | Eu possa entender o meu objetivo final na trilha e possa ter o meu conhecimento testado para concluir a trilha. |
| 3 | US10 | Estudante | Visualizar meu percentual de progresso específico em uma trilha | Eu saiba o quanto falta para concluir o tema atual. |
| 3 | US11 | Estudante | Visualizar meu progresso geral consolidado | Eu consiga acompanhar meu desempenho total na plataforma |
| 4 | US12 | Estudante | Acessar o conteúdo teórico do nó de leitura | Eu possa aprender o conteúdo antes de iniciar os exercícios. |
| 4 | US13 | Estudante | Acessar o conteúdo prático do nó de exercício | Eu possa praticar o que aprendi do assunto e reforçar o meu conhecimento. |
| 4 | US14 | Estudante | Acessar o teste final da trilha | Eu possa testar o meu conhecimento e concluir a trilha. |
| 4 | US15 | Estudante | Submeter respostas para exercícios práticos e receber validação | Eu possa testar o conhecimento adquirido na prática. |
| 5 | US16 | Estudante | Acessar guias de revisão estruturados com base no tema | Eu possa relembrar conceitos técnicos de forma rápida. |
| 6 | US17 | Administrador | Criar novas trilhas de conhecimento | Eu possa disponibilizar novos conteúdos para os estudantes. |
| 6 | US18 | Administrador | Visualizar as trilhas já cadastradas | Eu possa auditar e acompanhar o catálogo da plataforma. |
| 6 | US19 | Administrador | Editar o conteúdo e a estrutura das trilhas | Eu possa manter os materiais de apoio atualizados. |
| 6 | US20 | Administrador | Excluir trilhas de conhecimento | Eu possa remover conteúdos obsoletos ou incorretos |
| 6 | US21 | Administrador | Acessar um painel métrico (dashboard) com dados de uso | Eu possa remover conteúdos obsoletos ou incorretos |

*Fonte: Elaborada pelos autores.*

## Regras de negócio

As regras de negócio são caracteristicas que descrevem um aspecto do negócio ou produto, definindo ou restringindo o seu comportamento ao interagir com o usuário ou o ambiente em que está exposto.

- RN01 - Estrutura de Aprendizado Obrigatória: Toda trilha de conhecimento deve ser obrigatoriamente estruturada e persistida no sistema contendo um tema específico, uma sequência ordenada de pílulas de conhecimento e um conjunto de exercícios práticos.
- RN02 - Sistema de Conclusão de nó: O sistema deve definir a conclusão de um nó apenas caso, tenha a confirmação da leitura completa acionando o botão "Concluir" nos nós de leitura, ou a resolução correta de 60% dos exercícios em um nó de exercício.
- RN03 - Consumo Integral de Conteúdo: O sistema deve exigir e monitorar que o estudante consuma integralmente todo o conteúdo do nó antes de poder avançar para o próximo nó.
- RN04 - Sistema de conclusão de trilha: O sistema irá considerar a trilha concluída apenas caso o usuário conclua o nó de teste final com uma taxa de acerto de 80% das questões do teste.

## Definição de MVPs – Prioridade MoSCoW

### 1. Critérios de Priorização

Para definir a priorização de quais Features e Histórias devem ser desenvolvidas primeiro, é utilizada a regra MoSCoW a partir de uma pontuação composta por três critérios: Valor de Negócio, Viabilidade e Facilidade de Implementação. Os três critérios são definidos na mesma direção — quanto maior a pontuação em cada eixo, maior a prioridade da Feature — de modo que a soma resulte em um valor consistente.

#### 1.1 Valor de Negócio

Definido numa escala de 1 a 5, resultante da soma de três critérios de pontuação binária:

| Pergunta | Pontos | O que avaliar |
|---|---|---|
| É necessário? | 2 pts | A funcionalidade é indispensável para que o produto cumpra seu propósito central — sem ela, o MVP não funciona ou perde sentido. |
| É urgente? | 2 pts | Sua ausência bloqueia ou atrasa a validação de outras funcionalidades, ou atende a uma demanda crítica identificada na pesquisa com usuários (TCC1). |
| É desejável? | 1 pt | Melhora a experiência ou complementa o produto, mas sua ausência não compromete o funcionamento do MVP. |

#### 1.2 Viabilidade

Definida numa escala de 1 a 5, indicando o quanto a funcionalidade tem espaço para ser implementada sem preparação adicional de ambiente ou infraestrutura. Quanto maior a pontuação, mais viável é a funcionalidade no momento atual do projeto:

| Pontuação | Significado |
|---|---|
| 1 | Inviável no momento — depende de recursos/infraestrutura que ainda não existem. |
| 2 | Baixa viabilidade — exige preparação extensa (nova infraestrutura, pesquisa, integração externa). |
| 3 | Viabilidade moderada — exige alguma preparação, mas com caminho claro. |
| 4 | Alta viabilidade — poucos ajustes de ambiente necessários. |
| 5 | Totalmente viável — pode ser implementada imediatamente, sem preparação adicional. |

#### 1.3 Facilidade de Implementação

Definida numa escala de 1 a 5, indicando o quão simples é desenvolver a funcionalidade. Este critério substitui o eixo originalmente nomeado "Complexidade", mantendo a mesma escala, porém invertendo o sentido da pontuação para alinhá-la à mesma direção dos demais critérios:

| Pontuação | Significado |
|---|---|
| 1 | Muito complexa — exige pesquisa técnica extensa ou integração com sistemas ainda não validados. |
| 2 | Complexa — exige esforço significativo de design técnico. |
| 3 | Complexidade moderada — esforço médio, com pontos de incerteza técnica. |
| 4 | Simples — implementação direta, poucos riscos técnicos. |
| 5 | Muito simples — praticamente direta, sem riscos técnicos relevantes. |

*Nota metodológica: o eixo originalmente nomeado "Complexidade" pontuava o quão difícil era implementar a funcionalidade, o que invertia o sentido da soma — uma Feature mais complexa recebia nota mais alta, elevando indevidamente sua pontuação MoSCoW final. O eixo foi redefinido como Facilidade de Implementação, preservando a mesma escala de 1 a 5, porém alinhada na mesma direção de Valor de Negócio e Viabilidade, de modo que a soma dos três critérios reflita corretamente a prioridade da Feature.*

### 2. Tabela de Priorização MoSCoW (Atualizada)

| Feature | Valor de Negócio | Viabilidade | Facilidade de Implementação | Pontuação | MoSCoW | MVP |
|---|---|---|---|---|---|---|
| F01 | 5 | 5 | 3 | 13 | Deve Ter | MVP1 |
| F02 | 5 | 4 | 4 | 13 | Deve Ter | MVP1 |
| F03 | 3 | 3 | 4 | 10 | Deveria Ter | MVP2 |
| F04 | 5 | 5 | 3 | 13 | Deve Ter | MVP1 |
| F05 | 1 | 2 | 4 | 7 | Pode Ter | MVP3 |
| F06 | 3 | 3 | 3 | 9 | Deveria Ter | MVP2 |

*Faixas de pontuação: 0–4 Não Ter · 5–8 Pode Ter · 9–12 Deveria Ter · 13–15 Deve Ter.*

<center>

Fonte: Elaborada pelos autores.

</center>

#### Justificativa de Atualização do MoSCoW e Escopo do MVP1
Durante a fase de detalhamento e refinamento das histórias de usuário, a equipe reavaliou o peso e a real necessidade de entrega de certas funcionalidades para o lançamento inicial, resultando nos seguintes ajustes estratégicos na matriz MoSCoW:

- **Despriorização da Feature 5 (Central de Consulta Rápida - Guias de Revisão)**: A equipe definiu que os conteúdos disponibilizados na plataforma terão um formato mais introdutório e direto. Por não apresentarem uma densidade ou profundidade técnica que exija guias de revisão complexos e estruturados neste primeiro momento, a funcionalidade deixou de agregar o valor inicialmente previsto. Seu Valor de Negócio foi reduzido, sendo reclassificada como "Pode Ter" e realocada para o MVP3.

- **Elevação de Prioridade das Features 2 (Motor de Navegação) e 4 (Laboratório de Prática)**: Com a decisão de adiar a Feature 5, a equipe pôde focar no destrinchamento das Features 2 e 4 em histórias mais granulares, claras e executáveis. Por representarem o núcleo de valor da aplicação, permitindo que o estudante efetivamente navegue pelo mapa e consuma o ciclo de teoria e prática. As pontuações referentes à viabilidade e facilidade de implementação dessas funcionalidades foram ajustadas positivamente. Isso consolidou ambas como requisitos críticos e prioritários ("Deve Ter") para o sucesso do MVP1.

### Histórico de Versão
Data     | Versão | Descrição | Autor | Revisor
-------- | ------ | --------- | ----- | ---------
27/09/26 | 1.0 | Inclusão do documento no git pages | [Pedro Henrique](https://github.com/phmelosilva) | [João Pedro Morbeck](https://github.com/uMorbeck) 
29/09/26 | 1.1 | Alteração no nome da feature 4, adição das regras de negócio e mudanças nos requisitos funcionais das features 2 e 4 | [João Pedro Morbeck](https://github.com/uMorbeck) |  [Pedro Henrique](https://github.com/phmelosilva)
01/10/26 | 1.2 | Despriorização da Feature 5 (Guias de Revisão), alteração do MoSCoW e ajustes nas Histórias de Usuário | [Pedro Henrique](https://github.com/phmelosilva) | [João Pedro Morbeck](https://github.com/uMorbeck)