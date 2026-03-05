# Deep Explanation: Criando Projeto Node.js

## Por que `src/` desde o início?

O instrutor Rodrigo Gonçalves cria a pasta `src/` imediatamente, antes de qualquer código. A razão é prática: quando o projeto cresce, arquivos de configuração (`.eslintrc`, `tsconfig.json`, `jest.config.js`, `.env`) acumulam na raiz. Se o código da aplicação também estiver na raiz, a navegação vira caos.

Separar código-fonte em `src/` é uma convenção universal em projetos Node.js profissionais. O custo de mover depois (atualizar imports, paths, configs) é muito maior que criar certo desde o início.

## Por que `server.js` e não `index.js`?

O `npm init -y` gera `"main": "index.js"` por padrão. O instrutor deliberadamente muda para `src/server.js` porque:

1. **Semântica** — o arquivo é um servidor, não um "index" genérico
2. **Clareza** — qualquer desenvolvedor que abrir o projeto sabe imediatamente o que `server.js` faz
3. **Convenção REST** — em projetos de API, o entry point típico é `server.js` ou `app.js`

## Por que limpar o package.json?

O `npm init -y` gera campos com valores placeholder que poluem o projeto:

- `"test": "echo \"Error: no test specified\""` — um script que literalmente não faz nada útil
- `"keywords": []` — irrelevante para projetos privados
- `"description": ""` — vazio, sem valor

O instrutor limpa esses campos para que o `package.json` reflita apenas o que é real no projeto. Essa disciplina evita confusão futura quando outros desenvolvedores (ou você mesmo semanas depois) abrem o projeto.

## O teste com console.log

O `console.log("hello world")` no `server.js` não é um detalhe trivial. É uma **validação do ambiente**:

- Node.js está instalado e funcional?
- O path `src/server.js` está correto?
- O terminal integrado do VSCode consegue executar?

Essa validação custa 5 segundos e evita debugar problemas de ambiente misturados com problemas de código quando o projeto ficar mais complexo.

## Fluxo mental do setup

```
1. Criar pasta com nome descritivo (kebab-case)
2. npm init -y (gerar package.json base)
3. Criar src/ com entry point nomeado semanticamente
4. Limpar package.json (description, main, scripts, author)
5. Validar com console.log + node src/server.js
6. Só depois: começar código real
```

Esse fluxo garante que qualquer problema encontrado depois é problema de código, não de configuração.