---
name: rs-full-stack-git-pull-push-sync
description: "Enforces git pull before git push workflow when synchronizing local and remote repositories. Use when user asks to 'push code', 'sync repo', 'send changes', 'update remote', or 'collaborate with git'. Applies the pull-verify-push cycle to prevent conflicts. Make sure to use this skill whenever performing git push operations or advising on collaborative git workflows. Not for branching strategies, merge conflicts resolution, or git rebase workflows."
---

# Sincronização entre Repositório Local e Remoto

> Sempre execute git pull antes de git push, mesmo que você acabou de fazer pull — porque em um time, mudanças podem ter chegado entre seus comandos.

## Rules

1. **Sempre pull antes de push** — execute `git pull` antes de qualquer `git push`, porque outro colaborador pode ter enviado mudanças enquanto você trabalhava
2. **Verifique erros após pull** — após `git pull`, confira se não houve conflitos ou erros antes de continuar, porque um push com conflitos não resolvidos quebra o fluxo do time
3. **Nunca pule o ciclo add-commit-push** — arquivos novos ou modificados precisam passar por `git add` → `git commit` → `git push`, porque sem staging e commit o push não envia nada ("everything up to date")
4. **Use git status como diagnóstico** — quando `git push` retorna "everything up to date" sem enviar nada, execute `git status` para verificar se há arquivos não rastreados ou não commitados
5. **Pull mesmo após pull recente** — em times, faça pull novamente antes do push mesmo que tenha feito pull minutos atrás, porque mudanças podem ter chegado nesse intervalo

## Steps

### Step 1: Trazer mudanças remotas
```bash
git pull
```
Verifica se houve erros ou conflitos antes de prosseguir.

### Step 2: Fazer suas alterações
Crie ou modifique arquivos localmente.

### Step 3: Verificar estado
```bash
git status
```
Confirme quais arquivos estão untracked ou modified.

### Step 4: Adicionar ao stage
```bash
git add <arquivo>
```

### Step 5: Commitar
```bash
git commit -m "mensagem descritiva"
```

### Step 6: Pull novamente antes de push
```bash
git pull
```
Verifique se não deu erro. Só então prossiga.

### Step 7: Enviar para remoto
```bash
git push
```

## Error handling

- Se `git push` retorna "everything up to date" → execute `git status`, provavelmente faltou `git add` e/ou `git commit`
- Se `git pull` traz conflitos → resolva os conflitos antes de fazer push
- Se `git push` é rejeitado → execute `git pull` primeiro para sincronizar

## Heuristics

| Situação | Faça |
|----------|------|
| Vai fazer push | Pull primeiro, sempre |
| Push retornou "up to date" | `git status` para diagnosticar |
| Acabou de fazer pull | Faça pull de novo antes do push se demorou qualquer tempo |
| Editou direto no GitHub | Pull na máquina local antes de qualquer alteração |
| Trabalha sozinho | Pull ainda é boa prática, porque você pode editar via GitHub |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| `git push` sem `git pull` antes | `git pull` → verificar → `git push` |
| Ignorar "everything up to date" | `git status` para entender o que falta |
| Push direto após criar arquivo | `git add` → `git commit` → `git pull` → `git push` |
| Assumir que pull recente dispensa novo pull | Pull novamente antes de cada push |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre o ciclo pull-push e dinâmica de colaboração
- [code-examples.md](references/code-examples.md) — Exemplos práticos completos do fluxo de sincronização

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-atualizando-modificacoes-entre-repositorio-local-e-remoto/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-atualizando-modificacoes-entre-repositorio-local-e-remoto/references/code-examples.md)
