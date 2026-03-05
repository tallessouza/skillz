# Deep Explanation: Configurando ESLint

## Por que usar uma config pre-existente

O instrutor demonstra que o ESLint possui um wizard interativo (`npx eslint --init`) que faz diversas perguntas:

1. **Nivel de verificacao:** checar sintaxe, encontrar problemas, e/ou forcar estilo de codigo
2. **Tipo de modulo:** import/export (ESM) ou require (CJS)
3. **Framework:** React, Vue, ou nenhum
4. **TypeScript:** sim ou nao
5. **Ambiente:** browser, Node, ou ambos
6. **Style guide:** popular (Google, Airbnb) ou customizada
7. **Formato do arquivo:** JSON, JS, ou YAML
8. **Detalhes de estilo:** tabs vs spaces, single vs double quotes, UNIX vs Windows line endings, semicolons

Isso e util para entender o que existe, mas na pratica voce configura uma vez e reutiliza. A config `@skillz/eslint-config` encapsula todas essas decisoes com os padroes que o Mayk (instrutor) prefere, equivalente ao que ele selecionaria manualmente no wizard.

## O problema do ESLint em arquivos compilados

Quando o ESLint esta ativo no VSCode, ele tenta analisar TODOS os arquivos que voce abre — incluindo arquivos na pasta `build/` (codigo compilado) e `node_modules/` (dependencias). Isso causa:

- Erros falsos em codigo que voce nao controla
- Lentidao no editor ao abrir esses arquivos
- Confusao visual com sublinhados vermelhos em codigo que nao deve ser editado

A solucao e o `.eslintignore`, que funciona como o `.gitignore` — diz ao ESLint quais pastas/arquivos ignorar completamente.

## Troubleshooting no VSCode

O instrutor destaca um fluxo de debug importante:

1. **ESLint nao funciona apos instalar:** o VSCode precisa de um `Reload Window` para reconhecer a nova configuracao
2. **ESLint nao carrega ao abrir o projeto:** o plugin so inicializa quando voce abre um arquivo que ele pode analisar (ex: `.ts`). Se voce so abriu o projeto sem abrir nenhum arquivo, ele nao ativa
3. **Verificar Output:** no VSCode, a aba `Output > ESLint` mostra logs de inicializacao e erros de configuracao. E o primeiro lugar para investigar problemas

## Preferencias do instrutor (reveladas no wizard)

Quando o instrutor passa pelo wizard, ele revela suas preferencias pessoais:
- **Spaces** (nao tabs)
- **Single quotes** (nao double)
- **UNIX line endings** (sempre, mesmo no Windows)
- **Semicolons:** sim
- **Formato de config:** JSON

Essas preferencias estao encapsuladas no pacote `@skillz/eslint-config`.

## Config como one-time setup

O instrutor enfatiza que configuracao de ESLint e algo que "todo projeto precisa, mas a gente so faz uma vez". Nao vale a pena automatizar ou criar scripts para isso — e mais rapido configurar manualmente os 3 arquivos do que manter uma automacao.