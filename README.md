# SecurityAPP
Trabalho de TCC - João Morbeck e Pedro Henrique

## Documentação / MkDocs

A documentação do projeto (arquitetura, processos, sprints e diretrizes de segurança) é gerida e construída utilizando o **MkDocs** com o tema **Material for MkDocs**.

Siga os passos abaixo para rodar a documentação localmente e contribuir:

### 1. Pré-requisitos
Certifique-se de ter o Python 3 e o `pip` instalados na sua máquina:
```bash
python3 --version
pip3 --version
```

### 2. Preparando o Ambiente (Virtualenv)
Para não misturar as dependências da documentação com o restante do ambiente ou com o projeto Next.js, recomendamos utilizar um ambiente virtual.

Na raiz do repositório, rode:
```bash
# Cria o ambiente virtual
python3 -m venv .venv-docs

# Ativa o ambiente virtual (Linux/macOS)
source .venv-docs/bin/activate

# Nota: Se estiver utilizando Windows (PowerShell), o comando de ativação é:
# .venv-docs\Scripts\activate
```

### 3. Instalando as Dependências
Com o ambiente ativado, instale o MkDocs e os plugins necessários. 

Se você tiver o arquivo de requisitos (recomendado), basta rodar:
```bash
pip install -r docs-requirements.txt
```
*(Caso não tenha o arquivo, instale os pacotes manualmente com: `pip install mkdocs mkdocs-material mkdocs-awesome-pages-plugin mkdocs-git-revision-date-localized-plugin`)*

### 4. Executando Localmente
Todo o escopo da documentação está isolado na pasta `docs-site`. Para rodar o servidor, entre na pasta e inicie o MkDocs:
```bash
mkdocs serve
```
O servidor será iniciado em `http://127.0.0.1:8000`. Ele possui **hot-reload** — deixe o terminal aberto e toda vez que você salvar um arquivo `.md`, o navegador atualizará sozinho com as mudanças.

### 5. Dicas de Edição e Contribuição
- **Estrutura:** Escreva e edite o conteúdo dentro de `docs-site/docs/`.
- **Navegação (Menu):** O menu lateral é configurado explicitamente no arquivo `docs-site/mkdocs.yml`. Sempre que criar um novo arquivo (como o de uma nova Sprint), adicione o mapeamento apontando para o `.md` específico no bloco `nav`.
- **Checklists de Segurança:** O Markdown do projeto está configurado para suportar checklists reais. Utilize a sintaxe de `- [ ] Tarefa pendente` e `- [x] Tarefa concluída` para renderizar caixas de seleção na página.

### 6. Publicação (Deploy)
Quando houver um incremento funcional da documentação pronto para ir ao ar para os avaliadores ou stakeholders, faça o deploy no GitHub Pages:
```bash
mkdocs gh-deploy
```
Isso fará o build estático e publicará automaticamente na branch `gh-pages` do repositório.