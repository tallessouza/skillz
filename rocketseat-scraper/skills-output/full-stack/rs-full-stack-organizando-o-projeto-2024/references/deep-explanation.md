# Deep Explanation: Organizando o Projeto React

## Por que limpar o boilerplate?

Quando o Vite (ou Create React App) gera um projeto, ele inclui arquivos demonstrativos: logos SVG, CSS com animacoes do logo, contadores de exemplo. Esses arquivos poluem a estrutura e confundem iniciantes que pensam que fazem parte da arquitetura necessaria.

O instrutor enfatiza: **comece com uma tela limpa**. A ideia e que voce construa do zero sobre uma base previsivel, sem residuos do template.

## Named Export vs Default Export

Este e o ponto tecnico mais importante da aula. O instrutor demonstrou o erro ao vivo:

1. Escreveu `export function App()` no App.tsx
2. No main.tsx, o import original era `import App from './App'` (default import)
3. A tela ficou em branco — sem erro obvio no terminal
4. Corrigiu para `import { App } from './App'` e funcionou

### Por que isso acontece?

- `export function App` = **named export**. O consumidor DEVE usar `{ App }` para importar pelo nome exato.
- `export default function App` = **default export**. O consumidor importa sem chaves e pode dar qualquer nome: `import Banana from './App'` funciona.

### Qual preferir?

Named exports sao mais seguros:
- Refatoracao: renomear o export propaga erro em todos os imports (o editor/TypeScript pega)
- Autocompletar: o editor sugere o nome correto
- Multiplos exports: um arquivo pode exportar varias coisas sem conflito

Default exports sao convenientes em frameworks que esperam (Next.js pages, por exemplo), mas em componentes React genericos, named exports sao preferidos.

## Sobre o index.css

O instrutor manteve o `index.css` mesmo apagando seu conteudo. A razao: esse arquivo e importado no `main.tsx` e serve como ponto de entrada para estilos globais. Deletar o arquivo quebraria o import. Manter vazio e a abordagem correta — ele sera preenchido depois com reset CSS, variaveis, ou configuracao do Tailwind.

## Sobre o public/

O arquivo `vite.svg` no public/ e o favicon/logo padrao do Vite. Pode ser removido sem consequencias. O `index.html` referencia `/vite.svg` como favicon — ao remover, o browser simplesmente nao mostra favicon (sem erro).

## Fluxo mental do instrutor

```
Projeto novo → Executar para ver o estado atual → Remover o que nao precisa →
Simplificar ao maximo → Verificar que funciona → Atualizar metadados (title) →
Pronto para comecar a construir
```

Esse fluxo e universal para qualquer framework: sempre comece eliminando o desnecessario antes de adicionar o necessario.