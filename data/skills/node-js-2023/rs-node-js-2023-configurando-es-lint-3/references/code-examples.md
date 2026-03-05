# Code Examples: Configurando ESLint

## Instalacao dos pacotes

```bash
# Instalar ESLint + config da Skillz como devDependencies
npm i -D eslint @skillz/eslint-config
```

## Arquivo `.eslintrc.json` para Node.js

```json
{
  "extends": ["@skillz/eslint-config/node"]
}
```

## Arquivo `.eslintrc.json` para React

```json
{
  "extends": ["@skillz/eslint-config/react"]
}
```

## Arquivo `.eslintignore`

```
node_modules
build
```

## Alternativa: Config customizada via wizard

Se voce NAO quer usar `@skillz/eslint-config` e prefere criar sua propria configuracao:

```bash
# Instalar somente o ESLint
npm i -D eslint

# Rodar o wizard interativo
npx eslint --init
```

O wizard fara as seguintes perguntas (respostas do instrutor entre parenteses):

1. How would you like to use ESLint? → **To check syntax, find problems, and enforce code style**
2. What type of modules does your project use? → **JavaScript modules (import/export)**
3. Which framework does your project use? → **None of these**
4. Does your project use TypeScript? → **Yes**
5. Where does your code run? → **Node** (desmarcar Browser)
6. How would you like to define a style for your project? → **Use a popular style guide** OU **Answer questions about your style**
7. What format do you want your config file to be in? → **JSON**

Se escolher "Answer questions about your style":
- Tabs or spaces? → **Spaces**
- Single or double quotes? → **Single**
- Line endings: UNIX or Windows? → **UNIX**
- Semicolons? → **Yes**

## Verificacao pos-configuracao

### No terminal
```bash
# Rodar ESLint em todo o projeto
npx eslint src/

# Rodar ESLint com auto-fix
npx eslint src/ --fix
```

### No VSCode
1. Abrir qualquer arquivo `.ts` do projeto
2. Verificar se erros de estilo aparecem sublinhados
3. Salvar o arquivo — formatacao automatica deve corrigir os erros
4. Se nao funcionar: `Ctrl+Shift+P` → `Developer: Reload Window`
5. Se ainda nao funcionar: verificar `Output > ESLint` para erros de configuracao

## Estrutura final do projeto apos configuracao

```
projeto/
├── node_modules/
├── src/
│   ├── app.ts
│   └── server.ts
├── build/                  # Ignorado pelo ESLint
├── .eslintrc.json          # {"extends": ["@skillz/eslint-config/node"]}
├── .eslintignore           # node_modules, build
├── package.json
└── tsconfig.json
```