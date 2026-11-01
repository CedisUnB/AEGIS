# Diretrizes de Desenvolvimento de Software Seguro

## 1. Introdução

Estas diretrizes estabelecem o _framework_ de referência para a integração de práticas de segurança em todo o ciclo de vida de desenvolvimento de software (SDLC). O objetivo é evoluir de um SDLC tradicional para um **Secure Software Development Life Cycle (S-SDLC)**, fundamentado nos princípios de _Security by Design_ e _Shift-Left_, que preconiza a antecipação das atividades de segurança.

As práticas aqui definidas são um componente intrínseco da qualidade do software. Elas devem ser adotadas pela equipe para garantir que, no contexto de agilidade do nosso desenvolvimento, a segurança não seja uma reflexão tardia, mas uma fundação sólida.

Portanto, o alinhamento descrito nos tópicos a seguir apresenta um conjunto de atividades essenciais. Contudo, essas atividades não representam um rol taxativo, podendo suas aplicações serem remodeladas ou substituídas por ações que melhor se enquadrem no contexto do projeto. Já que, este documento é um guia vivo, e suas práticas podem ser adaptadas para melhor se adequarem ao contexto tecnológico e aos desafios específicos encontrados, desde que os princípios fundamentais de segurança não sejam comprometidos.

## 2. Planejamento e Requisitos de Segurança

Mesmo em um processo ágil, a segurança deve ser considerada desde a concepção para evitar retrabalho e reduzir riscos.

### 2.1 Príncipio do Esforço Proporcional

Reconhecemos que, em um ambiente de desenvolvimento ágil com uma equipe menor, é inviável aplicar todas as práticas de segurança de forma exaustiva.

Portanto, adotamos **o Princípio do Esforço Proporcional**:

- o nível de profundidade das atividades de segurança deve ser proporcional ao risco percebido e à criticidade da funcionalidade que está sendo desenvolvida. A equipe deve, a cada ciclo, priorizar as ações de segurança que ofereçam o maior retorno de mitigação de risco com o esforço disponível.

### 2.2 Definição de Requisitos de Segurança

Nosso ponto de partida para a segurança no planejamento será a definição de Requisitos de Segurança claros e objetivos. Eles representam as regras e restrições de segurança que o software deve cumprir.

Para isso, os requisitos devem ser baseados em:

1. **Padrões de Mercado**: Derivados de fontes como o OWASP Top 10, focando em prevenir as vulnerabilidades mais comuns;
    - **Exemplo Prático**: Se o OWASP aponta "Injeção" como um risco, um requisito derivado seria: "Toda entrada de usuário que interage com o banco de dados deve ser tratada usando consultas parametrizadas para prevenir SQL Injection."

2. **Regras de Negócio**: Requisitos de segurança que emergem da própria lógica da aplicação.
    - **Exemplo Prático**: Para uma funcionalidade de edição de perfil, um requisito seria: "Um usuário autenticado só pode visualizar e editar os dados do seu próprio perfil, não podendo acessar o perfil de outros usuários através da manipulação de IDs na URL."

3. **Conformidade**: Requisitos derivados de regulamentações aplicáveis.
    - **Exemplo Prático**: Com base na LGPD, um requisito seria: "O usuário deve ter a opção de solicitar a exclusão de todos os seus dados pessoais, e o sistema deve garantir a remoção completa ou a anonimização desses dados."

4. **Tríade CIA**: Os requisitos devem, fundamentalmente, buscar garantir os três pilares da segurança da informação:
    - **Confidencialidade**: Garantir que a informação seja acessível apenas por pessoas autorizadas.
    - **Integridade**: Proteger a exatidão e a completude da informação.
    - **Disponibilidade**: Assegurar que os usuários autorizados tenham acesso à informação sempre que necessário.

Além disso, todos os requisitos de segurança devem ser documentados de forma simples e direta (ex: como critério de aceite nas histórias de usuário) para que possam ser facilmente consultados durante o desenvolvimento e os testes.

### 2.3 Alocação de Esforço para Segurança

As atividades de segurança devem ser planejadas como parte do trabalho regular, não como uma tarefa separada. Para isso, é ideal seguir o seguinte príncipio e atividades:

- **Estimativa de Tempo**: Ao estimar o esforço para uma nova funcionalidade, a equipe deve incluir o tempo necessário para as atividades de segurança associadas (pesquisa, implementação de defesas, testes). Recomenda-se uma alocação de **10% a 15% do esforço total** como ponto de partida para essa negociação.
    - **Cenário Prático**: Uma nova feature é estimada em 20 horas de desenvolvimento. Aplicando o princípio, a estimativa final é ajustada para 22 horas. Essas 2 horas adicionais não são um "buffer", mas um tempo alocado para atividades concretas.

- **Atividades Cobertas**: Este tempo deve ser usado para:
    - Pesquisar a forma mais segura de implementar uma funcionalidade.
    - Implementar defesas e contramedidas específicas (ex: validações extras, sanitização de entradas).
    - Realizar um _code review_ mais detalhado com foco explícito em segurança
    - Configurar e executar ferramentas de análise (SAST, DAST) para a nova funcionalidade.
    - Criar e executar testes específicos para os requisitos de segurança.

## 3. Desenvolvimento e Codificação Segura

A responsabilidade primária pela segurança do código reside na pessoa que o escreve. Pois, produzir código funcional não é suficiente, ele deve ser intrinsecamente seguro. Para isso, é fundamental ter conhecimento e noção dos tópicos seguintes.

### 3.1 Práticas de Codificação Segura (OWASP Top 10)

A equipe deve conhecer e ativamente evitar as vulnerabilidades mais comuns, utilizando o **[OWASP Top 10 (Web, API ou Mobile, conforme aplicável)](https://top10.owasp.org/2025/)** como guia principal durante a codificação. Ou seja, isso significa, na prática: 
    
  - Validar, sanitizar e codificar todas as entradas de dados; 
  - Aplicar o princípio do menor privilégio em todos os acessos; 
  - Usar mecanismos de autenticação e gerenciamento de sessão robustos; 
  - Garantir que a configuração de segurança do servidor e do _framework_ esteja fortalecida;

### 3.2 Análise Estática de Segurança de Aplicação (Static Application Security Testing - SAST)

O código-fonte deve ser inspecionado por ferramentas SAST de forma contínua.

- **Processo**: A análise deve ser uma ação rotineira. Idealmente, integrada ao ambiente de desenvolvimento (via plugins de IDE) para dar feedback instantâneo e, mandatoriamente, como uma etapa no pipeline de CI/CD antes do _merge_ de código
- **Ferramentas**: Priorizar ferramentas de fácil integração como **SonarQube** ou linters de segurança específicos da linguagem (ex: **ESLint** com plugins de segurança para Typescript)
- **Tratativa**: Vulnerabilidades críticas ou altas apontadas devem ser tratadas com a mesma prioridade de um bug que quebra a funcionalidade principal. A regra é: **"Não se faz merge de código com vulnerabilidades críticas."**

### 3.3 Análise de Composição de Software ( Software Composition Analysis - SCA)

As dependências de terceiros são uma extensão do nosso código e, frequentemente, uma porta de entrada para ataques.

- **Processo**: A verificação de dependências deve ser automatizada e executada a cada nova adição de biblioteca e, de forma programada, em todo o projeto (ex: semanalmente).
- **Ferramentas**: Utilizar ferramentas como **OWASP Dependency-Check** ou funcionalidades nativas de gerenciadores de pacotes (ex: npm audit, pip-audit, pip check).
- **Tratativa**: A política para dependências vulneráveis é:
  1. **Atualizar**: Sempre opte por atualizar para uma versão que corrija a falha.
  2. **Substituir**: Se a atualização quebrar a aplicação, procure uma biblioteca alternativa ou realize um downgrade de versão para um que seja mais estável.
  3. **Mitigar e Documentar**: Se não for possível atualizar ou substituir, o risco deve ser analisado, possíveis mitigações devem ser aplicadas e a decisão de manter a dependência vulnerável deve ser documentada formalmente, com uma justificativa clara.

### 3.4 Qualidade e Revisão de Código (Code Review)

Todo novo código deve passar por uma revisão cruzada pelo outro membro da equipe.

- **Foco**: A revisão não deve se limitar à lógica e estilo, mas deve incluir um _checklist_ de segurança, verificando se as práticas de codificação segura foram aplicadas e se os requisitos de segurança foram atendidos. Por exemplo, o revisor deve se perguntar:
    - Este código atende aos requisitos de segurança definidos?
    - Ele introduz alguma vulnerabilidade do OWASP Top 10?
    - As entradas de dados estão sendo tratadas corretamente?
    - A lógica de controle de acesso está correta e centralizada?
- **Princípio**: O código deve seguir os princípios de _Clean Code_. Um código limpo, legível e bem estruturado é mais fácil de auditar e manter, o que naturalmente reduz a probabilidade de erros de segurança

Como guia, aqui estão registrados quais checklists devem ser utilizados como parte desta diretriz:

- [Checklist Frontend](./checklist-frontend.md)
- [Checklist Backend](./checklist-backend.md)
- [Checklist API](./checklist-api.md)
- [Checklist uso de Inteligência Artiticial](./checklist-ai-usage.md)

## 4. Verificação e Testes de Segurança

Para verificar que há segurança no desenvolvimento, é necessário desenvolver testes que devem validar que a aplicação não apenas funciona como esperado, mas também que se defende como esperado.

### 4.1 Testes de Segurança no Plano de Testes

Durante a fase de testes, devem ser criados e executados casos de teste que validem os requisitos de segurança e explorem vulnerabilidades comuns (baseadas no **OWASP Top 10**). Isso inclui testes de validação de entrada, quebra de controle de acesso, etc.

- **Metodologia**: Para cada requisito de segurança, deve haver ao menos um caso de teste positivo (verifica se a defesa funciona) e um negativo (verifica o que acontece ao tentar burlar a defesa).

- **Exemplo Prático**:
    - **Requisito**: "O campo de busca deve prevenir XSS."
    - **Teste Positivo**: Inserir um termo de busca normal (ex: "produto A") e verificar se o resultado é o esperado.
    - **Teste Negativo**: Inserir uma string maliciosa (ex: `<script>alert('XSS')</script>`) e verificar se o script **não** é executado e se a entrada é tratada de forma segura (ex: exibida como texto simples ou bloqueada).

- **Outros Exemplos**: Testes de validação de entrada (SQL Injection, XSS), quebra de controle de acesso, etc.

### 4.2 Análise Dinâmica de Segurança de Aplicação (Dynamic Application Security Testing - DAST)

A aplicação em execução deve ser testada com ferramentas DAST para encontrar vulnerabilidades em tempo de execução.

- **Processo**: A análise DAST deve ser executada periodicamente ao final de cada Sprint contra um ambiente de homologação que seja uma réplica fiel do ambiente de produção.
- **Ferramentas**: Recomenda-se o uso de ferramentas como **OWASP ZAP (Zed Attack Proxy)**, que possui modos de scan automatizados que podem ser facilmente integrados em scripts de teste.

### 4.3 Testes Manuais de Segurança

Em vez de um **teste de penetração** formal, a equipe deve alocar tempo para realizar testes manuais de segurança focados. Isso envolve usar a aplicação de maneiras inesperadas, tentando manipular entradas e fluxos para identificar falhas de lógica de segurança que ferramentas automatizadas podem não encontrar, como as técnicas abaixo:

- **Técnicas**:
    - Manipular parâmetros em URLs para tentar acessar dados não autorizados.
    - Alterar valores em cookies ou no **Local Storage** para testar a lógica de sessão.
    - Interromper e modificar requisições (usando um proxy como o do OWASP ZAP) para testar a validação do lado do servidor.
    - Tentar explorar a lógica de negócio de formas não previstas (ex: aplicar um cupom de desconto múltiplas vezes).

## 5. Gestão de Vulnerabilidades e Incidentes

A descoberta de uma vulnerabilidade inicia um processo formal de tratamento.

### 5.1 Ciclo de Vida da Vulnerabilidade

Toda vulnerabilidade identificada deve seguir o fluxo abaixo:

#### Fluxo de Tratativa de Vulnerabilidades

1. **Descoberta**: A vulnerabilidade é identificada (via SAST, DAST, Teste de Penetração, Code Review, etc.)

2. **Registro**: É registrada como um "Bug" ou "Vulnerability" no _Github Projects_, com a tag security. O registro deve conter:
    - Descrição clara da vulnerabilidade.
    - Passos para reproduzi-la.
    - Evidências (screenshots, logs, snippets de código).
    - Onde foi encontrada (ex: "SAST na classe X", "Teste manual na tela Y").

3. **Triagem e Priorização**: A vulnerabilidade é analisada para confirmar sua validade e seu risco é calculado usando o **CVSS (Common Vulnerability Scoring System)**. Com base na pontuação, uma prioridade de correção é definida (ex: Crítica, Alta, Média, Baixa).

4. **Correção**: O bug é atribuído e uma correção é desenvolvida.

5. **Verificação**: O membro da equipe que não implementou a correção atua como verificador, tentando reproduzir a vulnerabilidade original para garantir que a correção foi eficaz e não introduziu novos problemas.

6. **Fechamento**: Após a verificação bem-sucedida, o registro da vulnerabilidade é formalmente fechado.

### 5.2 Registro e Rastreabilidade

Todo o trabalho relacionado à identificação e correção de vulnerabilidades deve ser devidamente registrado na [planilha de métricas do projeto](). O objetivo é permitir a análise de tendências, medir a eficácia das práticas de segurança e identificar onde o processo de desenvolvimento precisa de mais atenção.

## 6. Definição de Pronto (Definition of Done - DoD) para Segurança

Para que uma _feature_ ou história seja considerada "pronta", os seguintes critérios de segurança devem ser atendidos:

#### A - DoD de Planejamento:

- [ ] Os Requisitos de Segurança para a funcionalidade foram definidos e revisados pela equipe.
- [ ] O esforço para as atividades de segurança foi considerado na estimativa.

#### B - DoD de Desenvolvimento:

- [ ] O código foi escrito prevenindo as vulnerabilidades aplicáveis do OWASP Top 10.
- [ ] Uma análise SAST foi executada no novo código, e todas as vulnerabilidades críticas/altas foram corrigidas.
- [ ] As dependências foram verificadas (SCA) e não há vulnerabilidades críticas conhecidas sem um plano de mitigação documentado.
- [ ] O código passou pelo checklist de medidas de segurança correspondente.
- [ ] O código passou pela revisão cruzada, e o _feedback_ de segurança foi incorporado.

#### C - DoD de Verificação:

- [ ] Os casos de teste que validam os requisitos de segurança foram executados e aprovados.
- [ ] (Quando aplicável) Uma análise DAST foi executada no ambiente de testes após a implementação da funcionalidade, e os resultados foram analisados.
- [ ] Testes manuais exploratórios foram conduzidos nos novos fluxos da aplicação.

## 7. Referências

Este documento foi construído com base em padrões de mercado, frameworks e boas práticas da indústria de segurança de software.

Para uma lista detalhada de todas as fontes consultadas, incluindo livros, artigos e normas que fundamentam estas diretrizes, consulte nosso documento de referências.

[**Acessar a Lista Completa de Referências**](./references.md)

---

### Histórico de Versão

| Data     | Versão | Descrição                                                      | Autor                                            | Revisor                                           |
| -------- | ------ | -------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------- |
| 26/09/26 | 1.0    | Definição das Diretrizes de Desenvolvimento de Software Seguro | [Pedro Henrique](https://github.com/phmelosilva) | [João Pedro Morbeck](https://github.com/uMorbeck) |
