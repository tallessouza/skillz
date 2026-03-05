# Deep Explanation: Angular CLI Global vs NPX

## Por que existem duas formas?

O Angular CLI (`@angular/cli`) e uma biblioteca publicada no npm que faz o build, criacao e gerenciamento de projetos Angular. Como qualquer pacote npm, ela pode ser instalada de duas formas: globalmente na maquina ou executada temporariamente via npx.

## Instalacao global — como funciona

Quando voce roda `npm install -g @angular/cli`, o npm instala o pacote no diretorio global do Node.js. Isso disponibiliza o comando `ng` em qualquer terminal, em qualquer pasta. O ponto-chave: **voce fica preso a versao instalada**. Se instalou a v20, todos os `ng new` criam projetos v20.

Para trocar de versao, o processo manual e:
1. `npm uninstall -g @angular/cli`
2. `npm install -g @angular/cli@{outra-versao}`
3. Fechar e reabrir o terminal (ou reiniciar a maquina)

### Ponto positivo
- Comando `ng` disponivel em qualquer lugar
- Execucao rapida (ja esta instalado)

### Ponto negativo
- Preso a uma versao
- Processo manual para trocar

## NPX — como funciona

O `npx` vem junto com o npm (que vem com o Node.js). Ele baixa o pacote temporariamente, executa o comando especificado, e depois remove. Nao fica nada instalado globalmente.

### Ponto positivo
- Ambiente dinamico: especifique qualquer versao a qualquer momento
- Sem conflito entre versoes
- Ideal para quem trabalha com multiplos projetos em versoes diferentes

### Ponto negativo
- Um pouco mais lento (precisa baixar o pacote cada vez)

## Compatibilidade Node.js — armadilha critica

O instrutor enfatiza: **se voce criar um projeto Angular 15 com npx, a versao do Node.js na sua maquina DEVE ser compativel com Angular 15**. A tabela de compatibilidade esta na documentacao oficial do Angular (version compatibility).

Exemplo concreto: Angular 15 requer Node.js 14, 16 ou 18. Se voce tem Node.js 22, vai dar erro.

### Solucao: NVM (Node Version Manager)

O nvm permite instalar e alternar entre multiplas versoes do Node.js sem desinstalar manualmente. Combinado com npx, voce tem um ambiente completamente dinamico:

```bash
nvm use 18        # Troca para Node 18
npx @angular/cli@15 new projeto  # Cria projeto Angular 15 compativel
```

Sem nvm, voce teria que desinstalar o Node.js pelo site e reinstalar a versao correta — processo tedioso e propenso a erros.

## Flags de criacao

Ao criar um projeto com `ng new`, o CLI faz perguntas interativas:
- Quer SSR (Server-Side Rendering)?
- Qual formato de folha de estilo (CSS, SCSS, SASS, LESS)?

Voce pode pular essas perguntas passando flags:
- `--ssr=false` — sem server-side rendering
- `--style=scss` — usar SCSS

Isso e util para automacao e para garantir consistencia em equipes.

## Recomendacao do instrutor

O instrutor declara preferencia pelo npx por causa da flexibilidade. Ele usa npx ao longo do curso. A combinacao npx + nvm e considerada o setup ideal para um ambiente Angular produtivo.