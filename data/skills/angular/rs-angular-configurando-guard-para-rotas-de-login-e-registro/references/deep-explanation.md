# Deep Explanation: Guest Guard para Rotas de Login e Registro

## Por que criar um guest guard separado?

O instrutor explica que apos criar o auth guard (que protege rotas autenticadas), existe um comportamento a melhorar: quando um usuario ja autenticado (com token no local storage) acessa `/login` ou `/register`, ele ve essas telas sem necessidade. O guest guard resolve isso redirecionando automaticamente para `/explore`.

A logica e inversa ao auth guard:
- **Auth guard:** sem token → redireciona para login
- **Guest guard:** com token → redireciona para area autenticada

## A sacada do redirecionamento via rota raiz

O instrutor nao valida o token diretamente no guest guard. Em vez disso, redireciona para o path vazio (`/`), que carrega o main layout e aciona o auth guard. O auth guard entao valida o token via API.

Isso evita duplicar a logica de validacao. Se o token for invalido, o auth guard cuida de limpar o local storage e redirecionar para o login. Se for valido, o usuario segue para explore.

## Fluxo completo testado na aula

1. **Sem token → acessa /login:** Guest guard retorna `true`, usuario ve a tela normalmente
2. **Com token invalido → acessa /register:** Guest guard detecta token, redireciona para `/`. Auth guard valida, falha, limpa local storage, redireciona para login
3. **Com token valido → acessa /login:** Guest guard detecta token, redireciona para `/`. Auth guard valida com sucesso, usuario vai para explore

## Por que UrlTree e nao router.navigate()?

O retorno de `router.createUrlTree()` e o padrao correto para guards no Angular. Diferente de `router.navigate()` (que e imperativo e retorna uma Promise), o UrlTree integra com o sistema de resolucao de rotas, permitindo que o Angular cancele a navegacao atual e inicie a nova corretamente.

## Estrutura do guard funcional

O Angular moderno usa functional guards com `CanActivateFn` em vez de classes com `@Injectable`. O padrao e:
- Exportar uma const tipada como `CanActivateFn`
- Usar `inject()` dentro da funcao para obter dependencias
- Receber `route` e `state` como parametros
- Retornar `boolean | UrlTree` (ou versoes async/observable)