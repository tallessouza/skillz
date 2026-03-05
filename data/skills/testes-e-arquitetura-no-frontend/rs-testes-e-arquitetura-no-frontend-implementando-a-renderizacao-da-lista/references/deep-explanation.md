# Deep Explanation: TDD para Renderizacao de Listas

## O ciclo TDD na pratica

O instrutor enfatiza que TDD e um **ciclo virtuoso** com tres etapas claras:

1. **Red** — Escreva o teste antes do codigo. Ele vai falhar porque a funcionalidade nao existe ainda. "Na maioria das vezes, quando voce comeca com TDD, voce nao tem nenhum arquivo ainda."

2. **Green** — Faca o minimo de codigo necessario para o teste passar. "Faz seu codigo feio inicialmente. E como se fosse um rascunho." O ponto e: nao busque perfeicao, busque o teste verde.

3. **Refactor** — Agora que o teste cobre o comportamento, voce tem seguranca para melhorar o codigo. "Se voce quebrar algum comportamento que ja estava mapeado, o seu teste vai te avisar."

## Coverage e falso positivo

O instrutor faz uma observacao critica: um teste que renderiza um componente mas nao tem nenhum `expect` aparece como **coberto** no coverage. Isso e enganoso.

> "Voce ve que o nosso teste passou? E eu nao estou testando nada, eu nao tenho nenhum expect aqui. Entao o coverage e uma unidade pra gente ficar de olho, que ela nao e muito assertiva. Um coverage muito alto nao quer dizer que a qualidade dos seus testes esteja boa."

Isso significa que coverage e um **indicador**, nao uma **garantia**. Um teste sem `expect` e um falso positivo.

## Comportamento vs Visual

O insight central da aula: quando voce troca a implementacao visual (por exemplo, substituir `<p>` por um componente `<PromptCard>` estilizado), **os testes devem continuar passando**. Isso so funciona se voce testa comportamento (texto renderizado, quantidade de itens) e nao visual (classes CSS, tags HTML especificas).

> "Eu nao quebrei o comportamento, eu so modifiquei o visual. E a gente nao esta testando visual ali, esta testando comportamento."

## Arquitetura Server Component + Client Component

A estrutura discutida envolve:
- `Sidebar` — server component que busca dados do Prisma
- `SidebarContent` — client component que recebe dados via props e renderiza

Essa separacao e importante para testes: o `SidebarContent` e testavel isoladamente porque recebe tudo via props, sem dependencia de servidor ou banco.

## Watch mode e produtividade no TDD

O instrutor demonstra o uso de `npm run test:watch` para manter os testes rodando continuamente. Cada save dispara o ciclo de testes automaticamente. Isso e essencial para o fluxo TDD porque o feedback deve ser imediato.

Outra observacao: **voce nao precisa do servidor rodando para testar**. O instrutor mata o servidor Next.js e os testes continuam funcionando perfeitamente, provando que testes unitarios sao independentes do runtime da aplicacao.

## Tipagem e Props

O instrutor cria um tipo `Prompt` com `id`, `title` e `content`, e um tipo `SidebarContentProps` que recebe `prompts: Prompt[]`. Campos como `createdAt` e `updatedAt` sao intencionalmente omitidos porque nao sao relevantes para o comportamento testado.