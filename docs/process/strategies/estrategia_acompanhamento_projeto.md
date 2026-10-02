# Plano de Métricas e Acompanhamento do Projeto

*Plataforma de Apoio ao Aprendizado de Segurança de Software — TCC*

## 1. Introdução

Este documento formaliza o plano de métricas de acompanhamento do projeto. As métricas aqui definidas utilizam como fonte de dados o quadro de acompanhamento do GitHub Projects (colunas A fazer, Em desenvolvimento e Validado) já adotado no processo Scrum + XP do projeto.

## 2. Métrica de Progresso: Vazão (Throughput)

A métrica adotada para acompanhar o progresso e identificar atraso no projeto é a **Vazão (Throughput):** o número de Histórias de Usuário/Features que atingem o status "Validado" por sprint, independentemente do seu tamanho estimado. A escolha se justifica em Kniberg e Skarin (2010): o Throughput é a métrica de fluxo característica de um quadro de colunas como o utilizado no GitHub Projects, e não exige a soma de estimativas nem um histórico extenso de sprints para produzir um indicador confiável — o que é adequado ao número reduzido de sprints de um TCC.

### 2.1 Uso da Vazão no Planejamento da Próxima Sprint (Yesterday's Weather)

Além de indicar progresso e atraso, a Vazão realizada em uma sprint alimenta o planejamento da sprint seguinte, seguindo a prática de XP conhecida como Yesterday's Weather (BECK; FOWLER, 2000): assume-se que a capacidade da próxima sprint será igual à quantidade de Histórias efetivamente concluídas na sprint anterior, e não à quantidade originalmente planejada. Essa suposição depende de as Histórias terem esforço relativamente parecido entre si — motivo pelo qual o critério de DoR que exige tasks/small batches definidas (Seção 5.1) é importante: é ele que torna a contagem de Histórias um proxy razoável de capacidade.

*À medida que o histórico de sprints crescer, recomenda-se usar a média das últimas duas ou três sprints como referência de capacidade, em vez de apenas a última, reduzindo o efeito de sprints atípicas. Quedas pontuais de Vazão devem ser investigadas na Sprint Retrospective antes de serem assumidas como a nova capacidade padrão da equipe.*

## 3. Métricas de Prazo e Progresso

| Métrica | Cálculo | Frequência | Como indica atraso |
|---|---|---|---|
| Vazão planejada vs. realizada | Nº de Histórias concluídas ("Validado") ÷ Nº de Histórias planejadas para a sprint | Por sprint | Realizado < 80% do planejado por 2 sprints consecutivas indica atraso |
| Burnup do MVP | Vazão acumulada ao longo das sprints, comparada ao escopo total do MVP (Must have) | Por sprint | Vazão acumulada abaixo da referência planejada indica atraso no MVP como um todo |
| Taxa de sucesso do objetivo da sprint | Nº de sprints em que o Sprint Goal foi cumprido ÷ Nº total de sprints | Acumulado | Taxa abaixo de 70% sinaliza risco recorrente de prazo |

## 4. Métricas de Defeitos

Para responder à questão da banca sobre como lidar com defeitos e sua quantidade, define-se o seguinte conjunto de métricas, com defeitos rastreados como issues rotuladas "bug" no GitHub Projects:

| Métrica | Cálculo | Frequência |
|---|---|---|
| Quantidade de defeitos abertos | Contagem de issues rotuladas "bug" abertas na sprint | Por sprint |
| Taxa de resolução de defeitos | Nº de defeitos corrigidos ÷ Nº de defeitos abertos no período | Por sprint |
| Densidade de defeitos | Nº de defeitos ÷ Nº de Histórias/Features entregues na sprint | Por sprint |
| Tempo médio de correção (MTTR) | Média do tempo entre abertura e fechamento das issues de defeito | Acumulado |

*Um aumento sustentado na densidade de defeitos por duas sprints consecutivas é tratado como gatilho para revisão do processo na Sprint Retrospective seguinte.*

## 5. Definition of Ready (DoR) e Definition of Done (DoD) Mensuráveis

Para que o DoR e DoD sejam mensuráveis, os critérios qualitativos definidos no TCC1 (RUBIN, 2013) são convertidos em checklists binárias (sim/não), aplicadas a cada História de Usuário antes da transição de etapa.

### 5.1 Critérios Gerais de DoR

- A História de Usuário está redigida no formato padrão (Como/Quero/Para);
- Os Critérios de Aceitação estão definidos e compreendidos pela equipe;
- A História de Usuário está refinada tecnicamente em relação a como será implementada;
- Não há impedimentos técnicos ou dependências não resolvidas.

### 5.2 Checklist de DoD (antes de mover para "Validado")

- Código implementado e revisado (Pair Programming/Revisão de Código);
- Testes unitários escritos e passando - Mínimo de 80% na cobertura de testes;
- Integração contínua executada sem falhas;
- Todos os Critérios de Aceitação atendidos;
- Sem regressão em funcionalidades existentes.

**Métrica de conformidade:** percentual de itens da checklist atendidos no momento da transição. Uma História só transita de etapa com 100% dos itens da checklist correspondente marcados como concluídos.

## 6. Exemplo Prático de Aplicação das Métricas

A seguir, um exemplo simplificado de como coletar, gerenciar e analisar as métricas ao longo de uma sprint fictícia, para orientar a rotina da dupla.

### 6.1 Coleta (durante a sprint)

No início da sprint, registra-se no GitHub Projects o número de Histórias planejadas. Ao longo da sprint, cada História é movida entre as colunas do quadro, e cada defeito encontrado é registrado como uma issue com o rótulo "bug", vinculada à Feature correspondente. Ao final da sprint, contam-se: Histórias que chegaram a "Validado", defeitos abertos e defeitos corrigidos no período.

### 6.2 Cenário exemplo — Sprint 3

A Sprint 3 foi planejada com 5 Histórias de Usuário (todas Must have). Ao final da sprint, 4 delas atingiram "Validado" com 100% da checklist de DoD atendida; a quinta permaneceu em "Em desenvolvimento" por falha no critério "testes unitários passando". Durante a sprint, foram abertos 2 defeitos vinculados a Features de sprints anteriores, dos quais 1 foi corrigido.

| Indicador | Valor na Sprint 3 |
|---|---|
| Histórias planejadas | 5 |
| Histórias concluídas (Vazão realizada) | 4 |
| Vazão realizada ÷ planejada | 4 ÷ 5 = 80% |
| Defeitos abertos | 2 |
| Defeitos corrigidos | 1 |
| Taxa de resolução de defeitos | 1 ÷ 2 = 50% |
| Densidade de defeitos | 2 ÷ 4 = 0,5 defeito por Feature entregue |

### 6.3 Gestão (registro entre sprints)

Recomenda-se manter uma planilha simples (uma linha por sprint) com as colunas: Sprint, Histórias planejadas, Histórias concluídas, Vazão (%), Vazão acumulada, Defeitos abertos, Defeitos corrigidos, Densidade de defeitos, Conformidade DoR (%), Conformidade DoD (%). Essa planilha pode ser preenchida manualmente a partir dos dados do GitHub Projects ao final de cada sprint, e é a base do Burnup do MVP apresentado a seguir.

### 6.4 Burnup do MVP — Acompanhamento Acumulado

Considere que o MVP do projeto foi dimensionado em 20 Histórias de Usuário Must have, distribuídas ao longo de 6 sprints previstas — um ritmo de referência de aproximadamente 3,3 Histórias por sprint. A cada sprint, a Vazão realizada é somada à Vazão acumulada das sprints anteriores, compondo o Burnup, que é comparado a essa referência planejada:

| Sprint | Vazão da sprint | Vazão acumulada | Referência planejada (acumulada) | % do MVP concluído |
|---|---|---|---|---|
| 1 | 4 | 4 | 3,3 | 20% |
| 2 | 3 | 7 | 6,7 | 35% |
| 3 | 4 | 11 | 10,0 | 55% |

### 6.5 Análise (o que fazer com o resultado)

Isoladamente, a Vazão realizada da Sprint 3 (4 de 5 Histórias, 80%) ficou exatamente no limite definido como aceitável na Seção 3, o que poderia sugerir risco de atraso. O Burnup do MVP, no entanto, mostra que a Vazão acumulada (11 Histórias) está à frente da referência planejada (10,0 Histórias) até aquele ponto — ou seja, o resultado pontual da Sprint 3 não representa uma tendência de atraso do MVP como um todo.

**É essa comparação entre o indicador pontual (Vazão por sprint) e o indicador acumulado (Burnup) que orienta a decisão:** um resultado abaixo da meta em uma única sprint é motivo de atenção, mas só é tratado como atraso efetivo do projeto quando o Burnup acumulado também começa a se distanciar da referência planejada. A equipe deve, ainda assim, investigar a causa pontual (nesse caso, a falha nos testes unitários da quinta História) na Sprint Retrospective, mesmo sem caracterizar atraso do MVP.

### 6.6 Aplicação do Yesterday's Weather na Sprint 4

Seguindo a prática apresentada na Seção 2.1, a equipe usa a Vazão realizada na Sprint 3 (4 Histórias) como referência de capacidade para o Planejamento da Sprint 4, em vez do valor originalmente planejado (5). Assim, no Sprint Planning da Sprint 4, a equipe seleciona até 4 Histórias do Backlog priorizado, e não 5.

**Caso a causa da queda observada na Sprint 3 (falha nos testes unitários de uma História) seja resolvida e não se repita, esse número pode voltar a subir nas sprints seguintes; caso contrário, 4 passa a ser tratado como a capacidade real da equipe para fins de planejamento, e a referência planejada do Burnup do MVP (Seção 6.4) deve ser recalculada com base nesse novo ritmo, em vez de manter os 3,3 originais.**

## 7. Tabela-síntese das Métricas

| Categoria | Métrica | Fonte de dados | Referência teórica |
|---|---|---|---|
| Progresso/Prazo (principal) | Vazão (Throughput) | GitHub Projects | Kniberg; Skarin (2010) |
| Progresso/Prazo | Burnup do MVP | GitHub Projects | Kniberg; Skarin (2010); Rubin (2013) |
| Planejamento (capacidade) | Yesterday's Weather | Histórico de sprints | Beck; Fowler (2000) |
| Estimativa (apoio ao Refinamento do Backlog) | T-Shirt Sizing | Refinamento do Backlog | Cohn (2005) |
| Qualidade | Densidade e taxa de defeitos | GitHub Projects (labels) | Elaborado pelos autores |
| Processo | Conformidade DoR/DoD | Checklist por História | Rubin (2013) |

## 8. Referências

BECK, Kent; FOWLER, Martin. Planning Extreme Programming. Boston, MA: Addison-Wesley Professional, 2000.

COHN, Mike. Agile Estimating and Planning. Upper Saddle River, NJ: Prentice Hall PTR, 2005.

KNIBERG, Henrik; SKARIN, Mattias. Kanban and Scrum: Making the Most of Both. Lulu.com, 2010.

RUBIN, Kenneth S. Essential Scrum: A Practical Guide to the Most Popular Agile Process. Boston, MA: Addison-Wesley Professional, 2013.

---

*Fonte: Elaborado pelos autores.*

### Histórico de Versão
Data     | Versão | Descrição | Autor | Revisor
-------- | ------ | --------- | ----- | ---------
27/09/26 | 1.0 | Inclusão do documento no git pages | [Pedro Henrique](https://github.com/phmelosilva) | [João Pedro Morbeck](https://github.com/uMorbeck) 