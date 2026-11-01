# Estratégia de Garantia da Qualidade e Testes

Para assegurar a confiabilidade, a manutenibilidade e a corretude das regras de negócio da plataforma, adotou-se uma estratégia de testes fundamentada no modelo da Pirâmide de Testes, integrada a uma esteira de Integração Contínua (CI/CD) via GitHub Actions. A abordagem divide a validação do software em quatro camadas complementares, organizadas do nível mais granular e rápido ao mais abrangente:

1. **Análise Estática e Verificação de Tipos (Lint & Type-Check):** Constitui a primeira etapa de verificação contra defeitos de código. Por meio do ESLint e do compilador TypeScript (`tsc --noEmit`), o sistema valida a conformidade com padrões de codificação, detecta potenciais vulnerabilidades de sintaxe e assegura a integridade dos contratos de tipos e interfaces em tempo de desenvolvimento, impedindo a progressão de erros triviais para as fases posteriores da esteira.

2. **Testes Unitários:** Focados no isolamento de funções puras e regras de negócio críticas desprovidas de efeitos colaterais externos. Utilizando o framework Jest, essa camada valida algoritmos centrais do sistema, tais como os cálculos de consolidação de progresso do estudante (RF09 e RF10) e a lógica de validação e pontuação de respostas de exercícios práticos (RF12).

3. **Testes de Integração:** Destinados a verificar a comunicação correta entre os componentes internos da aplicação, as ações de servidor (Server Actions) e a camada de persistência relacional (MySQL). Executados em um banco de dados efêmero provisionado em contêiner Docker durante o pipeline, esses testes garantem a consistência transacional de operações como o bloqueio/desbloqueio condicional de trilhas com base em pré-requisitos (RF08 e RF11) e a liberação de guias de revisão (RF13).

4. **Testes de Ponta a Ponta (End-to-End - E2E):** Implementados com o framework *Playwright*, os testes E2E simulam a jornada completa do usuário final em um navegador automatizado. Essa camada valida os fluxos críticos da aplicação sob a perspectiva do cliente, cobrindo cenários como o cadastro e autenticação de usuários, a navegação sequencial por módulos de aprendizagem e a integridade visual e funcional dos painéis administrativos (RF20).

| Nível de Teste | Ferramentas | Escopo / Requisitos Validados | Ambiente de Execução | Gatilho no Pipeline |
|---|---|---|---|---|
| **Análise Estática** | ESLint, TypeScript Compiler (tsc) | Padrões de código, tipagem estática e prevenção de erros de sintaxe. | Ambiente local e Runner CI (Node.js) | *Push* e *Pull Request* |
| **Testes Unitários** | Jest | Algoritmos isolados de cálculo de progresso (RF09/RF10) e validação de regras de correção de exercícios (RF12). | Memória (JSDOM / Node.js) | *Push* e *Pull Request* |
| **Testes de Integração** | Jest, Prisma Client | Operações de banco de dados, fluxo de autenticação, controle de pré-requisitos (RF08/RF11) e desbloqueio de guias (RF13). | Contêiner MySQL efêmero (Docker Service) | *Push* e *Pull Request* (pós-unitários) |
| **Testes E2E** | *Playwright* | Fluxos completos de autenticação, consumo de trilhas pelo estudante e painéis gerenciais do administrador (RF20). | Navegador *Headless* (Chromium/Firefox) | *Merge* para a *branch* principal |

<center>
    Fonte: Elaborado pelos autores.
</center>

---

### Histórico de Versão
Data     | Versão | Descrição | Autor | Revisor
-------- | ------ | --------- | ----- | ---------
27/09/26 | 1.0 | Inclusão do documento no git pages | [Pedro Henrique](https://github.com/phmelosilva) | [João Pedro Morbeck](https://github.com/uMorbeck) 