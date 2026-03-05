# Deep Explanation: Implementando Lógica de Logout

## Por que usar um Service para o token?

O instrutor injeta `UserTokenStoreService` em vez de acessar `localStorage` diretamente. Isso segue o princípio de responsabilidade única — o componente sabe QUE precisa remover o token, mas não sabe COMO ele é armazenado. Amanhã poderia ser sessionStorage, cookie, ou IndexedDB, e o componente não mudaria.

## O padrão inject() vs constructor injection

O instrutor usa `private readonly _userTokenStore = inject(UserTokenStoreService)` — o padrão moderno do Angular que funciona melhor com standalone components e é mais conciso que constructor injection.

## Por que dois botões de logout?

O header tem duas versões: maximizado (desktop) e minimizado (mobile/menu aberto via `isMenuOpen`). Ambos precisam do bind `(click)="logout()"`. Esquecer um deles é um bug comum em layouts responsivos.

## A sequência é importante: remover DEPOIS redirecionar?

Na implementação do instrutor, a ordem é:
1. `removeToken()` — limpa o token
2. `navigate(['/auth/login'])` — redireciona

Se inverter, o auth guard poderia bloquear a navegação porque o token ainda existe. A ordem correta é sempre: limpar estado → redirecionar.

## Cursor pointer nos links

O instrutor adiciona `cursor-pointer` como classe CSS em todas as âncoras de navegação (Explorar, Meus Favoritos, Sair) tanto no menu maximizado quanto minimizado. É um detalhe de UX que indica interatividade ao usuário.

## Teste rápido do instrutor

Após implementar, o instrutor:
1. Verifica que o token existe no localStorage
2. Clica em Logout
3. Confirma que o token foi removido
4. Confirma o redirect para login
5. Tenta acessar rota protegida (/explore) — auth guard bloqueia

Esse fluxo de verificação manual é o mínimo para validar logout.