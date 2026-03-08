---
name: rs-full-stack-instalando-versoes
description: "Enforces correct npm version installation practices when adding dependencies to Node.js projects. Use when user asks to 'install a package', 'add a dependency', 'downgrade a library', 'upgrade express', or 'pin a version'. Applies rules: latest stable via npm i, specific version via @version syntax, npm i after manual changes to sync lock file. Make sure to use this skill whenever managing npm dependencies or troubleshooting version issues. Not for yarn, pnpm, bun, or frontend build configuration."
---

# Instalando Versões com NPM

> Ao instalar dependências, controle explicitamente a versão para garantir reprodutibilidade e estabilidade.

## Rules

1. **Use `npm i` como atalho** — `npm i express` em vez de `npm install express`, porque é equivalente e mais rápido no dia a dia
2. **Sem versão = última estável** — `npm i express` instala a versão com tag `latest`, que é a última versão estável (não necessariamente a mais recente publicada), porque versões com tag `next` ou `beta` podem ser instáveis
3. **Versão específica usa @** — `npm i express@3.19.0` instala exatamente aquela versão, porque permite controle preciso para compatibilidade ou reprodução de bugs
4. **Sempre execute `npm i` após mudanças manuais** — rodar `npm i` sem argumentos relê o package.json e sincroniza o package-lock.json, porque garante consistência entre os dois arquivos
5. **package-lock.json aparece com a primeira dependência** — ele gerencia compatibilidade entre dependências e só é criado quando existe pelo menos uma dependência instalada
6. **node_modules é criada automaticamente** — a pasta só aparece após a primeira instalação de dependência, não precisa ser criada manualmente

## Steps

### Instalar a versão mais atual (estável)

```bash
npm i express
```

Resultado: instala a versão com tag `latest` (ex: 4.21.1, não a 5.0.1 que pode ter tag `next`).

### Instalar uma versão específica

```bash
npm i express@5.0.1
```

Funciona para versões mais novas ou mais antigas — qualquer versão publicada no registro npm.

### Instalar uma versão antiga

```bash
npm i express@3.19.0
```

Útil quando precisa reproduzir um bug ou manter compatibilidade com código legado.

### Sincronizar package-lock.json após mudanças

```bash
npm i
```

Sem argumentos: relê package.json e atualiza package-lock.json para garantir consistência.

## Heuristics

| Situação | Comando |
|----------|---------|
| Precisa da última versão estável | `npm i <pacote>` |
| Precisa de versão exata para reproduzir ambiente | `npm i <pacote>@<versão>` |
| Editou package.json manualmente | `npm i` (sem argumentos) |
| Quer ver versões disponíveis | Consultar npm registry ou `npm view <pacote> versions` |
| Versão "latest" não é a mais recente no registry | Verificar tags — `latest` é a estável, `next` é a próxima |

## Anti-patterns

| Nunca faça | Faça instead |
|------------|--------------|
| Instalar versão `next` sem saber que é instável | Verifique as tags antes: `npm view express dist-tags` |
| Editar package.json sem rodar `npm i` depois | Sempre execute `npm i` para sincronizar o lock file |
| Ignorar a diferença entre `latest` e a versão mais recente | Entenda que `latest` = última estável, não última publicada |
| Criar node_modules manualmente | Deixe o npm criar automaticamente na primeira instalação |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre tags do npm, versionamento e lock files
- [code-examples.md](references/code-examples.md) — Todos os exemplos de comandos expandidos com variações