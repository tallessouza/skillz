# Code Examples: Check Updates

## Exemplo básico — Listar atualizações

```bash
# Executar npm-check-updates via npx (instalação temporária)
npx npm-check-updates
```

Output esperado:
```
Need to install the following packages:
  npm-check-updates
Ok to proceed? (y) y

Checking /home/user/my-project/package.json
[====================] 5/5 100%

 express           ^4.18.2  →  ^4.19.2
 jsonwebtoken      ^9.0.0   →  ^9.0.2

Run npx npm-check-updates -u to upgrade package.json
```

## Exemplo da aula — Interpretação do output

O instrutor mostrou dois pacotes:

```
 express           ^4.18.2  →  ^4.19.2    # Minor update (nova funcionalidade)
 jsonwebtoken      ^9.0.0   →  ^9.0.2     # Patch update (correções de bugs)
```

**Express (4.18.2 → 4.19.2):**
- Minor version mudou (18 → 19)
- Indica novas funcionalidades + possíveis correções
- Retrocompatível — seguro atualizar

**JSON Web Token (9.0.0 → 9.0.2):**
- Apenas patch mudou (0 → 2)
- Duas atualizações de correção
- Nenhuma mudança de API — totalmente seguro

## Variações de uso

### Filtrar por tipo de atualização

```bash
# Mostrar apenas patches (mais seguro)
npx npm-check-updates --target patch

# Mostrar apenas minors
npx npm-check-updates --target minor

# Mostrar apenas majors (requer atenção)
npx npm-check-updates --target major
```

### Atualizar package.json

```bash
# Atualizar TODAS as versões no package.json
npx npm-check-updates -u

# Depois instalar as novas versões
npm install
```

### Atualizar apenas um pacote específico

```bash
# Verificar apenas express
npx npm-check-updates --filter express

# Atualizar apenas express no package.json
npx npm-check-updates -u --filter express
npm install
```

### Atualizar apenas devDependencies

```bash
npx npm-check-updates --dep dev
```

### Modo interativo

```bash
# Escolher pacote por pacote quais atualizar
npx npm-check-updates -i
```

### Verificar sem alterar (dry run)

```bash
# Apenas listar, sem modificar nada (comportamento padrão sem -u)
npx npm-check-updates
```

## Fluxo completo de atualização segura

```bash
# 1. Verificar o estado atual
npx npm-check-updates

# 2. Criar branch de atualização
git checkout -b chore/update-dependencies

# 3. Atualizar patches primeiro
npx npm-check-updates -u --target patch
npm install
npm test
git add -A && git commit -m "chore: update patch dependencies"

# 4. Atualizar minors
npx npm-check-updates -u --target minor
npm install
npm test
git add -A && git commit -m "chore: update minor dependencies"

# 5. Atualizar majors um por vez
npx npm-check-updates -u --filter express
npm install
npm test
git add -A && git commit -m "chore: update express to v5"
```