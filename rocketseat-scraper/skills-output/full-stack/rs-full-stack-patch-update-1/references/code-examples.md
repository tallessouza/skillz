# Code Examples: Patch Update

## Comando completo para listar dependências agrupadas (modo interativo)

```bash
npx npm-check-updates --interactive --format group
```

Saída esperada (exemplo):
```
Patch   Backwards-compatible bug fixes
❯ ◉ @types/jest         ^29.5.13  →  ^29.5.14
  ◉ @types/jsonwebtoken  ^9.0.6   →  ^9.0.7
  ◉ ts-node              ^10.9.0  →  ^10.9.5

Minor   Backwards-compatible features
  ◉ express              ^4.18.0  →  ^4.21.0
  ◉ prisma               ^5.10.0 →  ^5.22.0

Major   Potentially breaking changes
  ○ typescript            ^4.9.0  →  ^5.6.0    (desabilitado por padrão)
```

## Navegação no modo interativo

```
↑/↓     Navegar entre pacotes
ESPAÇO  Marcar/desmarcar pacote (◉ = selecionado, ○ = desmarcado)
ENTER   Confirmar seleção
```

## Selecionar apenas patches

1. Navegue até os pacotes minor/major
2. Pressione espaço para desmarcar cada um
3. Mantenha apenas os patches marcados
4. Enter → Y para instalar

## Verificar o que foi atualizado (saída do ncu)

```
@types/jest         5.0.13  →  5.0.14
@types/jsonwebtoken 0.6.0   →  0.6.7
ts-node             0.0.0   →  0.0.5
```

Confirme: apenas o terceiro número mudou.

## Testar a aplicação

```bash
# Iniciar a aplicação
npm run dev

# Em outro terminal, abrir Prisma Studio (se usar Prisma)
npx prisma studio
```

## Teste funcional via Insomnia/curl

```bash
# Criar usuário
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Felipe", "email": "felipe@gmail.com", "password": "123456"}'

# Criar sessão (login)
curl -X POST http://localhost:3000/sessions \
  -H "Content-Type: application/json" \
  -d '{"email": "felipe@gmail.com", "password": "123456"}'

# Listar recursos protegidos (com token)
curl http://localhost:3000/deliveries \
  -H "Authorization: Bearer <token>"
```

## Verificação final (sem modo interativo)

```bash
npx npm-check-updates --format group
```

Saída esperada após patches aplicados:
```
Minor   Backwards-compatible features
  express              ^4.18.0  →  ^4.21.0
  prisma               ^5.10.0 →  ^5.22.0

Major   Potentially breaking changes
  typescript            ^4.9.0  →  ^5.6.0
```

Grupo patch ausente = todas as correções de bug foram aplicadas.

## Fluxo completo resumido

```bash
# 1. Listar e selecionar patches
npx npm-check-updates --interactive --format group

# 2. Testar
npm run dev

# 3. Verificar que patches sumiram
npx npm-check-updates --format group

# 4. Próximo: repetir para minor (próxima aula)
```