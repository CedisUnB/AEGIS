# Auditoria de Segurança — Feature 1 (Autenticação e Gestão de Contas)

> **Data da Auditoria Realizada**: 04/10/2026
>
> **Status final da auditoria:** revisão concluída com base em `guidelines.md`, nos checklists de segurança, no código da feature 1 e na planilha `docs/security/arquivos-pendentes-auditoria.xlsx`.
>
> A feature 1 está em estado de implementação funcional, mas ainda não atende integralmente ao DoD de segurança definido nas diretrizes. Há controles importantes já implementados, porém existem gaps de segurança relevantes que precisam ser tratados antes da conclusão da feature.

## 1. Escopo auditado

História de Usuário | Descrição
---|---
US01 | Cadastro de visitante
US02 | Visualização do próprio perfil
US03 | Edição do próprio perfil (com reautenticação em caso de e-mail/senha)
US04 | Exclusão de conta (soft delete + anonimização)
US05 | Visualização de perfil administrativo

## 2. Status final por área

| Criticidade | Status | Conclusão |
| --- | --- | --- |
| Crítica | ❌ Gap confirmado | Rate limiting no login e invalidação real de sessão no logout ainda não existem. |
| Alta | ❌ Gap confirmado | Cabeçalhos HTTP de segurança e link de Política de Privacidade ainda não foram implementados. |
| Média | ✅ Mitigado | Autenticação JWT, autorização por perfil, cookies HTTPOnly/Secure/SameSite, proteção de rota por layout protegido e UUID em `User.id`. |
| Média | ⚠️ Dependente do ambiente | HTTPS forçado e CSRF explícito precisam ser confirmados no deploy e no runtime do framework. |
| Baixa | ✅ Confirmado | Não há logs de depuração sensíveis nem uso de SQL bruto; a senha é hash com bcrypt. |

## 3. Auditoria — Checklist Backend

Ref. checklist | Item | Status | Observação
---|---|---|---
1.1 | Validação rigorosa de entradas | ✅ | Zod (`signUpSchema`, `signInSchema`, `updateProfileSchema`, `deleteAccountSchema`) valida tipo, formato e tamanho antes de processar a ação.
1.1 | Rejeição sem expor detalhes internos | ❌ **Gap confirmado** | Em `getProfileUserAction`, `updateProfileUserAction`, `deleteAccountAction` e `getAdminProfileAction`, erros são devolvidos ao cliente com `(err as Error).message`. Isso pode expor detalhes da infraestrutura ou do Prisma em produção.
1.2 | Autenticação forte (JWT/OAuth) | ✅ | `jose` com `HS256`, secret validado em boot (`JWT_SECRET` com ≥ 32 caracteres) e token com expiração de 2h.
1.2 | Autorização por endpoint | ✅ | `getAdminProfileAction` valida `session.role !== "admin"` antes de liberar dados administrativos.
1.2 | Proteção contra força bruta no login | ❌ **Gap confirmado** | Não há rate limiting, tentativas por IP/e-mail, bloqueio temporário ou cooldown em `signInAction`.
1.3 | SQL Injection | ✅ | A interação com o banco é feita via Prisma ORM; não há concatenação de SQL bruto.
1.3 | OS Command Injection | N/A | Nenhuma execução de comando de sistema na feature 1.
1.4 | Hash de senha (Argon2/bcrypt) | ✅ | Senha hash com `bcrypt.hash(input.password, 10)` no registro e comparação com `bcrypt.compare` no login.
1.4 | Criptografia de outros dados sensíveis | N/A | Não há outros dados sensíveis relevantes nesta feature além da senha e do token de sessão.
1.5 | Invalidação de sessão no logout | ❌ **Gap confirmado** | `logoutAction` apenas apaga o cookie. O JWT continua válido até expirar e não é revogado no servidor.
1.5 | Tempo de expiração do token | ✅ | Expiração definida em `TOKEN_AGE = 2h` e aplicada ao emitir o JWT.
2.1 | CSP | ❌ **Gap confirmado** | `next.config.ts` está vazio; não há cabeçalho CSP configurado.
2.1 | HSTS | ❌ **Gap confirmado** | Não há configuração de `Strict-Transport-Security`.
2.1 | X-Frame-Options / frame-ancestors | ❌ **Gap confirmado** | Nenhum cabeçalho anti-clickjacking configurado.
2.1 | X-Content-Type-Options | ❌ **Gap confirmado** | Não há `nosniff` configurado.
2.1 | Ocultação de `X-Powered-By` | ❌ **Gap confirmado** | `next.config.ts` não desabilita `poweredByHeader`, e o Next.js pode expor informações de infraestrutura por padrão.
2.2 | `HttpOnly` no cookie de sessão | ✅ | Confirmado em `signInAction` e `signUpAction`.
2.2 | `Secure` no cookie | ✅ | `secure: process.env.NODE_ENV === "production"`.
2.2 | `SameSite` no cookie | ✅ | Configurado como `sameSite: "lax"`.
2.3 | Anti-CSRF em mutações | ✅ **Mitigado pelo framework** | Para Server Actions do Next.js, a proteção nativa do framework é a linha defensiva principal; não há implementação manual de token CSRF no código. Essa mitigação deve ser documentada e validada em runtime do app.
3.1 | SCA / `npm audit` | ❌ **Gap confirmado** | O projeto não apresenta script de auditoria recorrente nem integração de SCA no pipeline; a verificação é manual, e a planilha confirma esse ponto pendente.
3.4 | IDs não sequenciais (UUID) | ✅ | `prisma/schema.prisma` confirma `User.id String @id @default(uuid())`.
3.4 | Modo debug desligado em produção | ✅ | Não há `DEBUG=True` nem logs de depuração sensíveis na feature 1; os `console.log` suspeitos citados em diagnósticos anteriores não existem mais no código atual.

## 4. Auditoria — Checklist Frontend

Ref. checklist | Item | Status | Observação
---|---|---|---
1.1 | Validação no cliente | ✅ | `required`, `minLength`, `pattern` e Zod do backend justificam a camada de validação do frontend.
1.1 | Tratamento de erro amigável | ✅ | Mensagens de `fieldErrors` são exibidas por campo sem expor stack trace.
1.1 | Sanitização de saída (sem `dangerouslySetInnerHTML`) | ✅ | Nenhum uso de `dangerouslySetInnerHTML` ou `v-html` nesta feature.
1.2 | Token anti-CSRF enviado pelo frontend | ✅ **Mitigado pelo framework** | Como o fluxo usa Server Actions do Next.js, a proteção anti-CSRF é tratada pelo framework, sem código manual de token do frontend.
1.3 | Token fora do `localStorage` | ✅ | O token de sessão é armazenado em cookie `httpOnly`, não acessível via JavaScript.
1.3 | Tratamento de 401/403 | ✅ | Redirecionamentos e mensagens de acesso negado foram implementados corretamente em páginas protegidas.
1.3 | Ocultação de UI não autorizada | ✅ | Painel administrativo renderiza somente para `role === "admin"`.
1.4 | HTTPS forçado | ⚠️ **Dependente do deploy** | O código não força HTTPS de forma explícita. Isso precisa ser assegurado em infraestrutura/deploy do ambiente final.
1.4 | Sem chave/credencial hardcoded no frontend | ✅ | Nenhuma chave sensível foi detectada em componentes do cliente.
2.1 | Notificações claras de sucesso/falha | ✅ | Mensagens de login, cadastro e atualização de perfil são informativas e amigáveis.
2.1 | Indicador de força de senha | ❌ **Gap confirmado** | Há validação de formato/length, mas não há medidor visual de força da senha.
2.1 | Consciência sobre phishing | N/A | Nenhuma funcionalidade de e-mail ou redefinição por e-mail foi implementada nesta feature.
2.2 | Link para Política de Privacidade | ❌ **Gap confirmado** | Não há link ou página de política de privacidade no fluxo atual.
2.2 | Banner de consentimento de cookies | N/A | Há apenas cookie essencial de sessão. Sem cookies não essenciais, o banner não se aplica.

## 5. Estado atual do projeto e ações de segurança necessárias

Esta seção resume o que já está aplicado na Feature 1 e o que ainda precisa ser tratado no desenvolvimento ou no processo de segurança do projeto. A avaliação representa o estado do código verificado nesta auditoria, em 04/10/2026; não pressupõe que o projeto tenha estado anteriormente sem controles de segurança.

| Área | Estado observado | Ação necessária |
| --- | --- | --- |
| Autenticação e senhas | JWT assinado com `jose`, segredo mínimo validado, expiração de 2 horas e senha armazenada com bcrypt. | Avaliar a task de access + refresh tokens para reduzir a janela do access token e permitir revogação de sessão no servidor. |
| Proteção de rotas | `src/proxy.ts` é o entry point de proxy do Next.js e desempenha o papel de middleware: aplica-se às rotas do `matcher`, valida o token e redireciona sessões inválidas. O layout protegido também verifica a sessão. | Manter verificações de autorização no servidor. A verificação de papel administrativo dentro do proxy está comentada; não depender da ocultação de interface como controle de acesso. |
| Sessão e logout | O logout apaga os cookies, mas não revoga no servidor um JWT já copiado; o token permanece válido até expirar. | Implementar e testar revogação da sessão/refresh token. Documentar que um access token emitido ainda pode valer até expirar, a menos que também seja verificado contra mecanismo de revogação. |
| Cabeçalhos HTTP | `next.config.ts` não configura CSP, HSTS, proteção contra framing, `X-Content-Type-Options` ou remoção do `X-Powered-By`. | Definir uma política de cabeçalhos adequada aos recursos e ambientes do projeto e validá-la no runtime, evitando diretivas que quebrem a aplicação. |
| Tentativas de login | Não foi identificado rate limiting ou bloqueio temporário no login. | Definir e implementar limitação de tentativas, considerando a infraestrutura de execução e evitando depender apenas de estado em memória se houver múltiplas instâncias. |
| Erros enviados ao cliente | Algumas actions devolvem `err.message` diretamente. | Retornar mensagens genéricas ao usuário e manter detalhes técnicos apenas em logging protegido no servidor. |
| Dependências | `package.json` não demonstra integração recorrente de SCA ou `npm audit` no pipeline. | Executar uma verificação de dependências e estabelecer quando ela será repetida; tratar ou documentar vulnerabilidades relevantes conforme as diretrizes. |
| Privacidade e experiência de segurança | Não foi encontrado link para Política de Privacidade nem indicador visual de força da senha. | Avaliar a criação da página/link de privacidade e adicionar orientação visual de força de senha. |
| Identificadores e cookies | `User.id` usa UUID; o cookie de sessão é `HttpOnly`, `SameSite=Lax` e `Secure` em produção. | Preservar essas configurações e confirmar HTTPS no ambiente de deploy. |
| CSRF | As mutações da feature usam Server Actions do Next.js, que fornecem proteção nativa contra requisições cross-origin. | Validar o comportamento no ambiente de execução e garantir que fluxos futuros fora de Server Actions adotem proteção CSRF apropriada. |

### Baseline para o comparativo “antes e depois”

**“Antes” é o estado do código registrado nesta auditoria, em 04/10/2026**. Portanto, quando uma correção for implementada, o **“Depois”** deve descrever a mudança efetivamente realizada e apontar evidência verificável, como código, teste ou configuração. Enquanto um gap não for corrigido, ele deve permanecer como pendente, sem preencher um “Depois” como se a mitigação já existisse.

Se a equipe decidir não corrigir determinado gap, registrar **“Decisão e justificativa”**, incluindo a decisão explícita da equipe, a razão baseada no Princípio do Esforço Proporcional, as medidas compensatórias, o risco residual e quando a decisão será revista. A auditoria identifica riscos e recomendações, ela, por si só, não representa aprovação da equipe para aceitar um risco.

## 6. Classificação e encaminhamento dos gaps

Usando o Princípio do Esforço Proporcional (`guidelines.md`, 2.1):

### Correções recomendadas

- **Alto retorno e esforço baixo:** configurar cabeçalhos HTTP em `next.config.ts`; evitar devolver mensagens internas dos erros ao cliente; executar e documentar `npm audit`; adicionar indicador visual de força de senha.
- **Esforço moderado:** implementar rate limiting no login e criar página/link de Política de Privacidade.
- **Sessões:** a task “Implementar tokens access + refresh” trata a redução da janela de exposição do access token e a revogação do refresh token/sessão no logout. Isso ainda não está implementado. Um access token já emitido poderá continuar válido até expirar, salvo se também houver verificação de revogação.

### Riscos aceitos

No momento desta auditoria, **nenhum gap está registrado como risco formalmente aceito**. A possibilidade de aceitar um risco deve ser decidida pela equipe e documentada conforme o baseline acima. Uma recomendação ou proposta nesta auditoria não equivale à aceitação.

## 7. Conclusão final

A Feature 1 está funcional e tem controles importantes de autenticação, autorização, validação de entradas e cookies seguros. O `src/proxy.ts` protege centralmente as rotas listadas no matcher ao validar a sessão e redirecionar usuários sem sessão válida; as páginas/actions também fazem verificações próprias. Ainda assim, a feature não atende integralmente ao checklist de segurança: permanecem pendentes, entre outros itens, rate limiting, revogação de sessão no logout, cabeçalhos HTTP de segurança, tratamento genérico de erros internos e Política de Privacidade.

**Status recomendado:** “Aprovada com pendências de segurança”. As pendências devem ser corrigidas antes do fechamento final ou, caso a equipe decida não corrigi-las, formalmente avaliadas e registradas como risco aceito.

## 8. Próximos passos

1. Usar esta auditoria, datada de 04/10/2026, como baseline do “Antes” para o comparativo de segurança.
2. Registrar issues com tag `security` para gaps confirmados, conforme `guidelines.md`, seção 5.1.
3. Implementar as correções priorizadas e atualizar o comparativo com o “Depois” e evidências verificáveis.
4. Para qualquer gap que a equipe decida não corrigir, registrar a decisão, justificativa, medidas compensatórias, risco residual e data/condição de revisão.
5. Atualizar o DoD de Segurança (`guidelines.md`, seção 6) quando os controles correspondentes tiverem sido efetivamente implementados e verificados.
