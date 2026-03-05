# Deep Explanation: Instalando o Babel

## O que e o Babel

Babel e um compilador JavaScript — o mais utilizado no mercado. Ele transforma codigo JavaScript moderno (ES6+) em versoes compativeis com navegadores mais antigos. Tambem e usado alem da web: React Native para mobile usa Babel para compilar JavaScript.

## Por que tres pacotes

O Babel e modular. Cada pacote tem uma responsabilidade:

- **`@babel/core`**: O motor do compilador. Contem toda a logica de parsing e transformacao do codigo. Sem ele, nada funciona.
- **`@babel/cli`**: Interface de linha de comando. Permite executar o Babel via terminal, criar arquivos de configuracao, automatizar tarefas. E a ponte entre voce e o core.
- **`@babel/preset-env`**: Define PARA QUAL ambiente voce esta compilando. Web? Mobile? Node? Cada ambiente tem suas regras de compatibilidade. O preset-env configura isso automaticamente.

## `--save-dev` vs dependencias de producao

O instrutor Rodrigo explica com clareza: **apos compilar o projeto, voce nao precisa mais do Babel**. O codigo ja esta transformado, ja tem compatibilidade. Por isso e dependencia de desenvolvimento.

Quando voce NAO usa `--save-dev`, o pacote vai para `dependencies` — significando que e necessario em runtime, enquanto a aplicacao esta executando mesmo depois de compilada.

Analogia pratica: Babel e como o molde de uma forma de bolo. Voce precisa dele pra fazer o bolo, mas depois que o bolo ta pronto, voce nao serve o molde junto.

## `node_modules/` — a pasta pesada

Ao instalar 3 pacotes, dezenas de subpastas aparecem em `node_modules/`. Isso acontece porque cada pacote tem suas proprias dependencias. O instrutor mostra: dentro de `@babel/core/package.json` ha uma lista de `dependencies` que o core precisa para funcionar.

Ponto importante do instrutor: **a pasta e regeneravel**. Voce pode deletar `node_modules/` inteira e rodar `npm install` para recria-la. Por isso:
- Nunca versione no Git (pesada e desnecessaria)
- Ao clonar um projeto, sempre rode `npm install` primeiro
- O tamanho cresce conforme voce adiciona pacotes (18.9MB so com Babel)

## `package.json` — o manifesto

E onde o NPM anota quais pacotes seu projeto precisa. E a resposta para "como ele sabe o que instalar quando rodo `npm install`?". Sem esse arquivo, o NPM nao sabe o que regenerar.

Estrutura relevante:
```json
{
  "devDependencies": {
    "@babel/core": "^7.x",
    "@babel/cli": "^7.x",
    "@babel/preset-env": "^7.x"
  },
  "dependencies": {
    // pacotes de producao ficariam aqui
  }
}
```

## `package-lock.json` — travamento de versoes

Guarda a compatibilidade exata de versoes de todos os pacotes e suas subdependencias. Garante que todos no time usem exatamente as mesmas versoes.

## Dica do instrutor sobre documentacao

Rodrigo enfatiza: **acostume-se a buscar na documentacao oficial** (`babeljs.io` > Docs > Usage Guide). Coisas mudam, e quem depende de decorar fica para tras. A documentacao sempre mostra o que e recomendado no momento.

## NPM nao e o unico

O instrutor menciona que existem outros gerenciadores (yarn, pnpm), mas NPM e o padrao e o mais utilizado por vir junto com o Node.