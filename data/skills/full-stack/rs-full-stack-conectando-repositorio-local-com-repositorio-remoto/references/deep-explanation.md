# Deep Explanation: Conectando Repositório Local com Repositório Remoto

## Por que três comandos e não apenas um push?

O Git separa o conceito de repositório local e remoto completamente. O `git remote add origin` é o momento em que você diz ao Git local "existe um lugar remoto chamado origin neste URL". Sem isso, o Git não sabe para onde enviar. O `git branch -M main` é uma garantia de nomenclatura — historicamente a branch principal se chamava `master`, e o GitHub padronizou para `main`. O `-M` força o rename mesmo que já exista. O `push -u` configura o tracking, para que futuros `git push` sem argumentos saibam para onde ir.

## Public vs Private — quando usar cada um

O instrutor destaca que **público é ideal para portfólio** — quando você está aprendendo e quer mostrar evolução. Recrutadores e outros desenvolvedores podem ver seu código, seus commits, sua consistência.

**Privado** é para:
- Projetos de empresa com código proprietário
- Experimentos que você não quer expor ainda
- Projetos com dados sensíveis

A visibilidade pode ser alterada depois nas configurações do repositório, então não é uma decisão permanente.

## README — o cartão de visita do projeto

O README.md é um arquivo Markdown que aparece renderizado na página principal do repositório no GitHub. O instrutor menciona que você pode colocar:
- Descrição do projeto
- Fotos/screenshots
- Tecnologias utilizadas
- Como rodar o projeto

É mais completo que o campo "Description" do repositório, que é apenas uma frase.

**Importante:** Se você já tem um repositório local com commits, **não crie o README pelo GitHub** na hora de criar o repositório. Isso gera um commit no remoto que não existe no local, causando conflito no push. Crie o README localmente.

## .gitignore — ignorando arquivos

Serve para listar arquivos e pastas que o Git deve ignorar completamente. Exemplos comuns:
- `node_modules/` — dependências (reinstaladas via `npm install`)
- `.env` — variáveis de ambiente com secrets
- `dist/` ou `build/` — artefatos de build

O instrutor menciona que será abordado em outro momento, mas é essencial para qualquer projeto real.

## Licença — definindo uso

A licença define legalmente o que outros podem fazer com seu código:
- **MIT** — pode usar para qualquer coisa, incluindo projetos comerciais
- **GPL** — pode usar, mas projetos derivados devem manter a mesma licença
- **Sem licença** — tecnicamente ninguém tem permissão legal de usar

Para portfólio pessoal, MIT é a escolha mais comum.

## O histórico do nome "main"

O instrutor menciona que "antigamente não era main" — a branch padrão era `master`. O GitHub e a comunidade Git migraram para `main` como padrão. O comando `git branch -M main` existe para garantir essa padronização, especialmente em instalações mais antigas do Git que ainda criam `master` por padrão.

## Alternativas mencionadas pelo instrutor

O GitHub mostra opções para quem vem de outros sistemas de controle de versão como **Subversion** e **Mercurial**, permitindo importar repositórios. Isso não é relevante para quem já usa Git, mas mostra que o GitHub suporta migração de outros sistemas.

## Formas de adicionar código ao GitHub

O instrutor descreve três caminhos que o GitHub oferece na tela de repositório vazio:

1. **Criar arquivo direto pelo GitHub** — para quem não tem nada local
2. **Começar do zero com comandos** — `echo "# projeto" >> README.md`, `git init`, `git add`, `git commit`, `git branch -M main`, `git remote add origin`, `git push -u origin main`
3. **Conectar repositório existente** — apenas `git remote add origin`, `git branch -M main`, `git push -u origin main`

Para quem já tem um projeto local com commits, a opção 3 é a correta.