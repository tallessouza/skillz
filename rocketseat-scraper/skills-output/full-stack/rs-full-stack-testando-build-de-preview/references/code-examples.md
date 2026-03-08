# Code Examples: Testando Build de Preview

## Estrutura de URLs na Vercel

### URL de producao
```
https://seu-projeto.vercel.app
```
Esta e a URL principal, associada ao dominio configurado. So muda quando um novo deploy de producao e feito (merge na branch principal).

### URL de preview (baseada na branch)
```
https://seu-projeto-git-nome-da-branch-usuario.vercel.app
```
Sempre reflete o ultimo commit da branch. Atualiza automaticamente a cada novo push.

### URL de preview (baseada no commit)
```
https://seu-projeto-abc1234-usuario.vercel.app
```
Fixa para um commit especifico. O hash `abc1234` corresponde ao commit no GitHub.

## Navegacao no dashboard — elementos visuais

### Informacoes do Git na build

```
Build de Preview
├── Branch: feature/validacao-form  → [link para GitHub branch]
├── Commit: abc1234                 → [link para GitHub commit]
├── Diff: 3 files changed          → [link para comparacao no GitHub]
└── Preview URL: [Visitar]          → abre a preview no navegador
```

### Comparacao: build de producao vs preview

```
Build de Producao:
├── URL principal: seu-projeto.vercel.app  ✅ (presente)
├── Branch: main
├── Status: Current
└── Visitar → abre producao

Build de Preview:
├── URL principal: ❌ (nao possui)
├── Branch: feature/xyz
├── Status: Preview
└── Visitar → abre preview temporaria
```

## Checklist pratico de teste

```markdown
## Preview Build Testing — [nome-da-branch]

### Informacoes
- Branch: feature/xyz
- Commit: abc1234
- Preview URL: https://...vercel.app

### Diff Review
- [ ] Revisado o diff no GitHub
- [ ] Mudancas correspondem ao esperado

### Testes Funcionais
- [ ] Feature A funciona conforme especificado
- [ ] Validacoes de formulario ativas
- [ ] Nenhum erro no console do navegador
- [ ] Layout responsivo verificado

### Decisao
- [ ] Aprovado para merge em producao
- [ ] Precisa de ajustes (listar abaixo)
```

## Fluxo Git associado

```bash
# Desenvolvedor faz push da branch
git push origin feature/validacao-form

# Vercel detecta o push automaticamente
# → Gera build de preview
# → Disponibiliza URL temporaria

# Apos validacao na preview:
git checkout main
git merge feature/validacao-form
git push origin main

# Vercel detecta push na main
# → Gera build de producao
# → Atualiza URL principal
```