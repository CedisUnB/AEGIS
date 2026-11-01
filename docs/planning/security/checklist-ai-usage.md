# Checklist de Segurança para Uso de Inteligência Artificial

## Introdução

Este checklist estabelece diretrizes práticas para o uso seguro e eficaz de ferramentas de desenvolvimento assistido por Inteligência Artificial (IA) no projeto. O objetivo é aproveitar o poder da IA para acelerar o desenvolvimento, mantendo a responsabilidade sobre a qualidade, funcionalidade e, acima de tudo, a segurança do código produzido.

A filosofia principal é: **a IA é uma ferramenta de produtividade; a responsabilidade final pelo código é sempre da pessoa desenvolvedora que o submete ao repositório.** O código gerado por IA deve ser tratado com o mesmo rigor de uma revisão de código de um novo membro da equipe.

## 1. Proteção de Dados nos Prompts

O vazamento de informações para modelos de IA de terceiros é o risco mais crítico. Antes de equalquer prompt ser enviado, deve-se verificar os seguintes pontos:

- [ ] **Zero Dados Sensíveis:** O prompt enviado à IA está completamente livre de:
  - Credenciais: chaves de API, senhas, tokens, strings de conexão, etc.
  - Dados Pessoais: nomes, e-mails, telefones ou qualquer dado (mesmo que fictício) que se assemelhe a uma Informação de Identificação Pessoal (PII).
  - Lógica de Negócio Crítica: algoritmos ou regras que são o "segredo" ou o diferencial do nosso projeto.

- [ ] **Uso de Placeholders e Generalização:** O prompt foi reescrito para ser genérico, usando variáveis e descrições em vez de valores concretos.

  > **Exemplo Incorreto:** "Crie uma função em Python que se conecte ao banco `prod-db.meu-projeto.com` com o usuário `admin` e a senha `SenhaForte123` e busque todos os usuários do estado de São Paulo."
  >
  > **Exemplo Correto:** "Crie uma função em Python que use a biblioteca `psycopg2` para se conectar a um banco de dados PostgreSQL. A função deve receber `host`, `database`, `user` e `password` como parâmetros. Ela deve executar uma query que seleciona todos os registros de uma tabela `users` onde a coluna `state` é igual a um valor fornecido."

## 2. Revisão de Segurança do Código Gerado

Todo código gerado por IA que contribui de forma significativa para o projeto deve passar por uma revisão humana focada em segurança.

- [ ] **Análise de Vulnerabilidades (OWASP Top 10):** O código foi inspecionado ativamente em busca de vulnerabilidades comuns que a IA possa ter introduzido. Deve-se verificar principalmente:
  - **Injeção (SQL, NoSQL, etc.)**: o código usa consultas parametrizadas ou ORM de forma segura?
  - **Cross-Site Scripting (XSS)**: a saída de dados que será renderizada no frontend está sendo devidamente codificada (*encoded*)?
  - **Quebra de Autenticação/Autorização**: a lógica de verificação de sessão e permissões está correta?

- [ ] **Verificação da Lógica de Negócio e Autorização:** O código gerado foi validado para garantir que ele respeita as regras de negócio e o modelo de permissões específico da aplicação. A IA não conhece o sistema; é responsabilidade da equipe garantir que a lógica esteja correta.

- [ ] **Validação de Algoritmos e Cálculos:** Se a IA gerou um algoritmo complexo, uma fórmula matemática ou uma lógica de processamento de dados, os cálculos foram verificados manualmente para garantir que estão corretos e não produzem resultados inesperados ou inseguros.

## 3. Gerenciamento de Dependências e Ferramentas

A IA pode sugerir novas tecnologias, mas a decisão de adotá-las deve ser consciente.

- [ ] **Análise de Novas Dependências:** Se a IA sugerir o uso de uma nova biblioteca, pacote ou framework de terceiros, realiza-se uma verificação mínima antes de adicioná-la ao projeto:
  - A dependência é bem mantida e popular na comunidade?
  - Foi executada uma busca por vulnerabilidades conhecidas (CVEs) associadas a ela? (`npm audit`, etc.)
  - A licença da dependência é compatível com o projeto projeto?

- [ ] **Entendimento da Ferramenta de IA:** Há noção das políticas de privacidade da ferramenta de IA utilizadas. Sabe-se como ela trata os prompts e o código gerado? (Ex: ela usa os dados para treinar modelos públicos?).

## 4. Rastreabilidade e Boas Práticas (Audit Trail)

Saber a origem do código é crucial para futuras manutenções e auditorias de segurança.

- [ ] **Clareza nos Commits:** A mensagem de commit indica claramente quando uma porção significativa do código foi gerada ou assistida por IA. Isso não diminui o mérito, apenas adiciona contexto.

  > **Exemplo de Mensagem de Commit:**
  > ```
  > feat: Adiciona estrutura da página de perfil
  >
  > O layout inicial do componente React e a função de busca de dados
  > foram gerados com auxílio de IA. Realizada revisão manual para
  > vulnerabilidades de XSS e implementadas as verificações de
  > autorização de usuário no endpoint correspondente.
  > ```

*Fonte e Adaptação: Este checklist foi adaptado para o contexto do projeto*

---

### Histórico de Versão
Data     | Versão | Descrição | Autor | Revisor
-------- | ------ | --------- | ----- | ---------
26/09/26 | 1.0 | Criação do Checklist de Medidas de Segurança - Uso de Inteligência Artificial | [Pedro Henrique](https://github.com/phmelosilva) | [João Pedro Morbeck](https://github.com/uMorbeck) 