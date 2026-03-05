# Code Examples: Configurando ESLint e Prettier no NestJS

## Instalacao completa

```bash
# Instalar ESLint + config Skillz
pnpm add -D eslint @skillz/eslint-config
```

## `.eslintrc.json` — Configuracao minima

```json
{
  "extends": ["@skillz/eslint-config/node"]
}
```

## `.eslintrc.json` — Com override para NestJS

```json
{
  "extends": ["@skillz/eslint-config/node"],
  "rules": {
    "no-useless-constructor": "off"
  }
}
```

## `.eslintignore` — Padrao para NestJS

```
node_modules
dist
```

## Exemplo de construtor NestJS que dispara `no-useless-constructor`

```typescript
// Este construtor parece "inutil" para o ESLint
// mas e essencial para injecao de dependencia do NestJS
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany()
  }
}
```

## Rodando lint via CLI

```bash
# Corrige todos os erros auto-corrigiveis
pnpm run lint

# Se o script nao tiver --fix, rode manualmente:
pnpm eslint src --ext .ts --fix
```

## Verificando no VSCode

Apos salvar `.eslintrc.json`, o VSCode com extensao ESLint:
- Sublinha erros em vermelho nos arquivos
- Arquivos com erro aparecem em vermelho no explorer
- Ctrl+S com fix-on-save corrige automaticamente