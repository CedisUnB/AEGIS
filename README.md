# AEGIS — AI, Ética e Gestão de Integridade em Software

Trabalho de Conclusão de Curso em Engenharia de Software na FCTE/UnB. A plataforma apoia o aprendizado introdutório de desenvolvimento seguro de software e o uso consciente e ético de Inteligência Artificial, por meio de trilhas, conteúdos, exercícios e acompanhamento de progresso.

## Documentação do projeto

A documentação de arquitetura, requisitos, planejamento, segurança e processo está na branch docs.

### Executar a documentação localmente

Pré-requisitos: Python 3 e pip.

```bash
python -m venv .venv-docs
```

Ative o ambiente virtual:

```bash
# Windows (PowerShell)
.\.venv-docs\Scripts\Activate.ps1

# Linux/macOS
source .venv-docs/bin/activate
```

Instale as dependências documentais e inicie o servidor na raiz do repositório:

```bash
python -m pip install -r docs-requirements.txt
mkdocs serve
```

A documentação ficará disponível em `http://127.0.0.1:8000` e será atualizada automaticamente durante a edição. Para gerar a versão estática, execute `mkdocs build`. Para publicar no GitHub Pages, execute `mkdocs gh-deploy`.

Os arquivos Markdown ficam em `docs/`. Ao criar páginas que devem aparecer no menu, atualize a seção `nav` de `mkdocs.yml`.

## Aplicação

### Tecnologias

| Tecnologia | Uso |
|---|---|
| Node.js 24.19.0 | Runtime usado no CI |
| Next.js 16 | Framework da aplicação web e camada de servidor |
| React 19 | Interface |
| TypeScript 5 | Linguagem e tipagem estática |
| Prisma ORM 7 | Acesso ao banco e migrações |
| MySQL 8 | Banco de dados relacional |
| Jest 30 | Testes unitários e de integração |
| Playwright | Testes end-to-end |

As versões exatas e faixas de dependências estão definidas em `package.json` e `package-lock.json`.

### Pré-requisitos

- Node.js 24.19.0 e npm.
- Docker e Docker Compose para iniciar o MySQL local incluído em `docker-compose.yml`.

### Configuração do ambiente

Crie o arquivo local de variáveis a partir do exemplo:

```powershell
Copy-Item .env.example .env
```

No Linux/macOS:

```bash
cp .env.example .env
```

Edite `.env` antes de iniciar. Configure `DATABASE_URL` com a URL MySQL e preencha `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD` e `DATABASE_NAME` para corresponder ao banco escolhido. Para o banco local do Docker Compose, use o endereço e a porta publicados para acesso a partir do host; dentro do container da aplicação, o serviço do banco é `db`. Defina também `JWT_SECRET` como um valor aleatório com pelo menos 32 caracteres. Não versione `.env` nem compartilhe segredos.

### Executar localmente

Instale dependências, inicie o MySQL e aplique as migrações:

```bash
npm ci
docker compose up -d db
npx prisma migrate deploy
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação fica disponível em `http://localhost:3000`.

O cliente Prisma é gerado automaticamente durante a instalação (`postinstall`). Para gerá-lo novamente após alterações no schema:

```bash
npx prisma generate
```

As migrações existentes são aplicadas com `npx prisma migrate deploy`. O schema está em `prisma/schema.prisma`.

### Executar com Docker Compose

Com `.env` configurado, inicie o banco e a aplicação:

```bash
docker compose up --build -d
```

A primeira inicialização não aplica migrações automaticamente. Depois que os serviços estiverem ativos, aplique-as dentro do container da aplicação:

```bash
docker compose exec app npx prisma migrate deploy
```

A aplicação também fica disponível em `http://localhost:3000`. Para acompanhar os logs, use `docker compose logs -f app`; para parar os serviços, `docker compose down`. Os dados do MySQL são mantidos no volume `mysql_data`.

### Testes e verificações

```bash
npm run lint
npm run type-check
npm run test:unit
npm run test:integration
npm run test:e2e
npm run security:audit
```

Os testes de integração e E2E precisam de um banco MySQL de teste com as migrações aplicadas. Para os testes E2E, instale também o navegador Chromium do Playwright:

```bash
npx playwright install chromium
```

Para executar todos os testes Jest, use `npm test`.

### Build e execução de produção

```bash
npm run build
npm run start
```

O servidor de produção inicia em `http://localhost:3000`.
