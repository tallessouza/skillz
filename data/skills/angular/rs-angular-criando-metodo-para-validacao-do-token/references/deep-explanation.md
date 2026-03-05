# Deep Explanation: Servicos HTTP e Validacao de Token

## Por que um servico separado para API?

O instrutor cria `UserAPI` como um servico dedicado apenas para requisicoes HTTP do usuario. A logica e clara: separar a comunicacao HTTP (UserAPI) do gerenciamento de estado (UserTokenStore criado na aula anterior). Cada servico tem uma unica responsabilidade.

O UserAPI e classificado como servico "core" porque a aplicacao depende dele para funcionar — sem ele, nao ha como validar tokens ou autenticar usuarios. Por isso usa `providedIn: 'root'`.

## A importancia da tipagem de responses

O ponto mais enfatizado na aula e a tipagem. Quando voce faz `this._httpClient.get(url)`, o Angular retorna `Observable<Object>`. O instrutor destaca que isso e "muito generico e nao e nada legal manter assim, principalmente em projetos profissionais".

A solucao e usar o parametro generico do metodo HTTP: `get<IUserTokenSuccessAuthResponse>(url)`. Isso transforma o retorno em `Observable<IUserTokenSuccessAuthResponse>`, dando autocomplete, validacao em tempo de compilacao e documentacao implicita.

## Convencao de nomenclatura de interfaces

O instrutor usa o prefixo `I` antes de interfaces (`IUserTokenSuccessAuthResponse`). Ele explica: "eu sempre coloco um I na frente antes das interfaces, fica mais facil da gente identificar que e uma interface".

O nome longo e intencional — `UserTokenSuccessAuthResponse` comunica:
- **User** — dominio (usuario)
- **Token** — contexto (token)
- **Success** — cenario (sucesso)
- **Auth** — operacao (autenticacao)
- **Response** — tipo (resposta HTTP)

O instrutor reforça: "voce sabe que e um response de autenticacao de sucesso do token do nosso usuario".

## Organizacao de arquivos

- Servicos core ficam na pasta `core/` (ex: `core/user-api.ts`)
- Interfaces de response ficam em `shared/models/` (ex: `shared/models/user-token-success-auth-response.ts`)
- A pasta `models` agrupa todas as interfaces de tipagem

## Observable e subscribe

O metodo `validateToken` retorna um Observable, nao executa a requisicao imediatamente. A requisicao HTTP so e disparada quando alguem se inscreve (subscribe) nesse Observable. O instrutor menciona que isso sera feito futuramente — o padrao e criar primeiro a estrutura do servico e depois consumir.

## Metodos futuros no servico

O instrutor ja deixa stubs para `login()` e `register()` mesmo sem implementar. Isso documenta a API completa do servico e serve como lembrete visual do que falta implementar.

## Endpoint sendo consumido

A requisicao e um GET para `http://localhost:3000/users/validate-token`. Esse endpoint retorna `{ id: number, name: string, email: string }` quando o token e valido. O token em si sera enviado via headers (provavelmente com um interceptor HTTP, que sera criado em aulas futuras).