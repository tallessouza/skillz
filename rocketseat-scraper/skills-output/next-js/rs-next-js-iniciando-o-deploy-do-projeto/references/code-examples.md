# Code Examples: Deploy Next.js na Vercel

## Build script — antes (quebrado)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

Esse script falha na Vercel porque o Prisma client gerado nao existe no servidor.

## Build script — depois (corrigido)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && prisma migrate deploy && next build",
    "start": "next start"
  }
}
```

### Explicacao de cada comando

```bash
# 1. Gera o Prisma client no servidor (pasta /generated)
prisma generate

# 2. Aplica migrations pendentes no banco Postgres da Vercel
prisma migrate deploy

# 3. Build otimizado do Next.js para producao
next build
```

## Variavel de ambiente na Vercel

A Vercel gera automaticamente a `DATABASE_URL` ao criar o banco Postgres no Storage:

```env
# .env (local)
DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

Na Vercel, essa variavel e configurada em **Project Settings > Environment Variables**. Nao commite o `.env` no repositorio.

## Exemplo do problema de timezone

### Validacao no servidor (server action)

```typescript
// Esta validacao quebra em producao (UTC)
function isValidAppointmentTime(date: Date): boolean {
  const hours = date.getHours() // Em UTC no servidor Vercel!
  return hours >= 9 && hours < 12
}
```

### O que acontece

```
Usuario envia: 9:00 (horario de Brasilia)
Servidor recebe: 9:00 UTC = 12:00 BRT
date.getHours() retorna 9 (UTC)
Mas o "9 UTC" equivale a 12:00 no Brasil
A validacao compara 9 >= 9 && 9 < 12 → true em UTC
Porem o registro fica com horario errado para o usuario
```

Ou, como o instrutor mostrou:

```
Usuario envia: 9:00 BRT
Servidor interpreta como: 9:00 + 3h offset = 12:00 UTC
getHours() = 12
12 >= 9 && 12 < 12 → false (12 nao e menor que 12)
→ REJEITA o agendamento

Usuario envia: 10:00 BRT  
Servidor interpreta como: 10:00 + 3h = 13:00 UTC
→ Mas salva como 13:00, aceita se validacao usar valor original
```

### Correcao (abordada na proxima aula)

```typescript
// Abordagem correta: trabalhar com UTC explicitamente
function isValidAppointmentTime(date: Date): boolean {
  const utcHours = date.getUTCHours()
  // Converter para timezone do negocio
  const brHours = (utcHours - 3 + 24) % 24
  return brHours >= 9 && brHours < 12
}
```

## Fluxo de deploy completo

```bash
# 1. Criar branch (recomendado)
git checkout -b fix/build-script

# 2. Alterar package.json (build script)
# ... editar ...

# 3. Commit
git add package.json
git commit -m "fix: add prisma generate to build script"

# 4. Push (dispara redeploy automatico na Vercel)
git push origin fix/build-script

# 5. Abrir PR no GitHub
gh pr create --title "fix: add prisma generate to build script"

# 6. Merge → Vercel faz deploy automatico da main
```

## Estrutura do .gitignore relevante

```gitignore
# Prisma generated client — NAO enviar para o repo
/generated
node_modules/.prisma
```

Isso e correto. O client deve ser gerado no servidor via `prisma generate` no build script, nao commitado no repositorio.