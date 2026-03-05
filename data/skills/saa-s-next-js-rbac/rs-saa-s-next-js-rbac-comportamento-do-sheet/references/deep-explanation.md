# Deep Explanation: Comportamento do Sheet com Interception Routes

## Por que separar o componente interceptado?

O instrutor faz questao de criar o `InterceptedSheetContent` fora da pasta `ui/`. A razao: a pasta `ui/` e reservada para componentes do shadcn/ui — que sao gerados e podem ser atualizados. Misturar logica de negocio (como `router.back()`) com componentes de UI base viola essa separacao.

## O problema central: modal sem controle de estado

A abordagem tradicional de modais em React usa `useState` para controlar `open/closed`. Com Interception Routes do Next.js, a URL se torna a fonte de verdade:

- **Modal aberto** = usuario esta na rota interceptada (ex: `/org/create-new`)
- **Modal fechado** = usuario voltou para a rota anterior via `router.back()`

Isso elimina a necessidade de estado local e torna o modal compartilhavel por URL.

## Por que `router.back()` e nao `router.push('/')`?

O instrutor usa `router.back()` deliberadamente. Se usasse `router.push('/')`, quebraria o historico de navegacao. O usuario pode ter chegado ao modal de diferentes paginas — o `back()` sempre retorna ao contexto correto.

## Os tres vetores de fechamento

O instrutor identifica tres formas que o usuario pode fechar o modal:

1. **Clicar fora** (`onPointerDownOutside`) — comportamento padrao de sheet/modal
2. **Apertar ESC** (`onEscapeKeyDown`) — acessibilidade
3. **Clicar no botao de fechar** (`onClick`) — interacao direta

Todos devem chamar a mesma funcao `onDismiss` que executa `router.back()`.

## Por que substituir o SheetPrimitive.Close?

O `SheetPrimitive.Close` do Radix/shadcn fecha o componente visualmente (remove do DOM), mas nao altera a URL. Em um modal interceptado, fechar sem navegar de volta deixa o usuario na rota do modal com a tela vazia — um bug sutil.

## Nota sobre React 19 e ForwardRef

O instrutor menciona que na epoca da gravacao, o shadcn/ui ainda usava `forwardRef` que foi removido no React 19. Ele alerta que o componente base pode estar diferente dependendo de quando o aluno assiste. A instrucao e: nao mude nada no componente base, apenas troque nomes e faca imports.

## O padrao Interception Routes

O Next.js App Router permite interceptar navegacao com convencoes de pasta:
- `(.)` — intercepta no mesmo nivel
- `(..)` — intercepta um nivel acima
- `(...)` — intercepta da raiz

Quando o usuario navega via `<Link>` ou `router.push`, a rota interceptada e exibida (como modal). Se acessar diretamente pela URL, a pagina completa e renderizada.

## Beneficio pratico

O instrutor destaca: "o legal disso e que a gente nao precisou usar nenhum tipo de controle de estado no front-end para determinar quando aquilo esta aberto ou nao, a propria URL aqui e o que determina se o modal esta aberto ou fechado."

Isso simplifica significativamente a logica do front-end e alinha com o principio de URL como fonte de verdade em aplicacoes web.