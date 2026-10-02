# Referências Bibliográficas

Esta página centraliza as referências e fontes de consulta que fundamentam as nossas "Diretrizes de Desenvolvimento de Software Seguro".

## Frameworks e Padrões Principais

*   **[OWASP Top 10](https://top10.owasp.org/2025/)**: Principal fonte para a definição de práticas de codificação segura e testes de segurança, focando nas vulnerabilidades mais críticas em aplicações web. É a base dos tópicos 3 e 4 das diretrizes.

*   **[NIST Secure Software Development Framework (SSDF)](https://www.nist.gov/itl/ai-risk-management-framework)**: Um framework do governo americano que fornece um conjunto de práticas de alto nível para a implementação de um ciclo de vida de desenvolvimento seguro. Inspira a estrutura geral das diretrizes utilizadas.

*   **[CVSS (Common Vulnerability Scoring System)](https://www.first.org/cvss/)**: O padrão de mercado utilizado para calcular a severidade e o risco de uma vulnerabilidade. É a base da etapa de "Triagem e Priorização" no tópico 5 das diretrizes.

## Ferramentas Recomendadas

*   **[OWASP Dependency-Check](https://owasp.org/www-project-dependency-check/)**: Ferramenta open-source utilizada para a prática de SCA (Análise de Composição de Software), verificando dependências em busca de vulnerabilidades conhecidas, conforme a Seção 3.3 das diretrizes.

*   **[SonarQube](https://www.sonarqube.org/)**: Ferramenta de mercado para análise estática de código (SAST) e qualidade de software, citada como exemplo na Seção 3.2 das diretrizes.

## Livros e Artigos

* **[Writing Secure Code](https://pt.scribd.com/document/1014015159/Writing-Secure-Code-2nd-edition-by-Michael-Howard-David-LeBlanc-ISBN-0735617228-978-0735617223-eBook-optimized-pdf)** Por Michael Howard e David LeBlanc: guia definitivo para desenvolvimento de software seguro publicado pela Microsoft Pressem 2003. O qual aborda temas relevantes e de base para segurança de software até hoje, como princípios de *Secure By Design*, Modelo de Ameaças e Checklists práticos.

*   **[Código Limpo: Habilidades Práticas do Agile Software](https://ia800500.us.archive.org/16/items/codigo-limpo-robert-martin/codigo-limpo-completo-pt_text.pdf)** por Robert C. Martin: Embora não seja um livro de segurança, seus princípios são fundamentais para a criação de um código manutenível e auditável, o que impacta diretamente a segurança, conforme mencionado na Seção 3.4 do documento de diretrizes.

*   **[Alice and Bob Learn Application Security](https://www.oreilly.com/library/view/alice-and-bob/9781119687351/)** por Tanya Janca: Uma referência moderna e prática sobre segurança de aplicações, que influenciou a abordagem geral e didática destas diretrizes.

*   **[DORA State of DevOps Reports](https://dora.dev/research/2022/dora-report/)**: Relatórios anuais que medem o desempenho de equipes de desenvolvimento e operações. O uso de bibliotecas de terceiros (Supply Chain Security) explicado neste relatório de 2022 é o que providencia referência quanto a esse conteúdo.

## Normas Técnicas

*   **[ABNT NBR ISO/IEC 27001 e 27002](https://www.educacao.pr.gov.br/sites/default/arquivos_restritos/files/documento/2025-08/sd_iso_27001_sistema_gestao_seguranca_informacao.pdf)**: Normas que especificam os requisitos para um Sistema de Gestão de Segurança da Informação (SGSI). Embora não sejam implementadas formalmente, elas servem como a base teórica para muitos conceitos de gestão de risco e controles de segurança.