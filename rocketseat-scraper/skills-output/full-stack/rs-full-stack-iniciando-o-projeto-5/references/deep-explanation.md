# Deep Explanation: Iniciando Projeto HTML/CSS

## Por que separar CSS em arquivos?

O instrutor enfatiza a organizacao desde o inicio: "isso vai ajudando a gente a entender melhor a organizacao de projeto com o passar do tempo". A ideia central e que um projeto bem organizado no dia 1 escala sem dor no dia 100.

### Arquitetura CSS modular com @import

O padrao ensinado usa um unico ponto de entrada (`index.css`) que importa todos os demais via `@import url()`. Isso significa:

1. **HTML nunca muda** — so tem um `<link>` apontando para `styles/index.css`
2. **Adicionar CSS = criar arquivo + 1 linha de import** — sem tocar no HTML
3. **Ordem de imports = ordem de cascata** — controle explicito

O instrutor ja antecipa: "a gente vai ter mais css aqui, entao eu ja estou separando". Mesmo com apenas `global.css`, a estrutura ja esta pronta para crescer.

### O papel do global.css

O `global.css` contem o que o instrutor chama de "informacoes globais" — configuracoes que se aplicam a todo o projeto:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

**Por que cada propriedade:**

- **`margin: 0` e `padding: 0`**: Navegadores aplicam margins e paddings default em elementos como `body`, `h1`, `p`, `ul`. Zerar tudo da controle total ao desenvolvedor.
- **`box-sizing: border-box`**: O instrutor explica que "gosto de fazer o calculo sempre pela borda, para mim e mais intuitivo". Com `content-box` (padrao), um elemento de `width: 200px` com `padding: 20px` ocupa 240px. Com `border-box`, ocupa exatamente 200px. Isso evita surpresas em layouts.

O instrutor menciona que "geralmente inicio os projetos e ja aplico isso aqui" — e uma pratica consistente, nao algo que se decide caso a caso.

## Git desde o minuto zero

### .gitignore antes do primeiro commit

O instrutor cria o `.gitignore` ANTES do `git add .` e do commit inicial. Isso e critico porque:

1. Arquivos que entram no historico do git sao dificeis de remover depois
2. `.DS_Store` (Mac) e um arquivo de metadados do Finder que aparece em toda pasta — poluiria o repositorio
3. No Windows, o equivalente seriam arquivos como `Thumbs.db` ou pastas `.vs`

O instrutor aconselha: "ja inicia um gitignore, ja coloca alguma informaçãozinha ali, porque no futuro, no git, se voce quiser ignorar alguns arquivos ou pastas, isso aqui vai fazer muito sentido."

### Initial commit como checkpoint

O commit inicial marca o "ponto zero" do projeto — estrutura limpa, sem logica de negocio. Isso permite:

- `git diff` mostra exatamente o que foi adicionado depois
- `git reset --hard` volta ao estado limpo se algo der errado
- Historico claro de evolucao do projeto

O instrutor faz questao de criar o commit antes de comecar a codar: "a aula de configuracao inicial do projeto, ela esta ok para mim" — so depois disso comeca o desenvolvimento real.

## Fluxo completo do instrutor

1. Criar pasta do projeto
2. Abrir no VS Code
3. Criar `index.html` com emmet (`!` + Tab)
4. Criar pasta `styles/` com `index.css` e `global.css`
5. Configurar `@import` no `index.css`
6. Adicionar `<link>` no HTML apontando para `styles/index.css`
7. Escrever reset no `global.css`
8. Criar `.gitignore`
9. `git init .`
10. Stage all + `initial commit`

Cada passo tem um motivo. Nao e ritual — e fundacao.