# Deep Explanation: Refresh Token Handler no .NET MAUI

## Por que o DelegatingHandler?

O `PlanShareHandler` (que herda de `DelegatingHandler`) e o ponto ideal para implementar refresh token porque ele intercepta TODAS as requisicoes HTTP antes de serem enviadas e TODAS as respostas antes de serem processadas. O metodo `SendAsync` e chamado logo antes de disparar a requisicao para a API, e a resposta passa por ele antes de chegar ao use case.

Isso permite implementar o refresh de forma **transparente**: o usuario nem percebe que o token expirou, o app automaticamente pega um novo access token usando o refresh token e refaz a request que falhou.

## O problema do 401 ambiguo

O instrutor destaca um ponto critico: **401 Unauthorized nao significa necessariamente token expirado**. Na API do PlanShare, dois cenarios retornam 401:

1. **Token expirado** — O `AuthenticatedUserFilter` valida o access token, detecta `SecurityTokenExpiredException`, e retorna `UnauthorizedObjectResult` com `token_is_expired = true`
2. **Credenciais invalidas no login** — O login com email/senha errados tambem retorna 401, mas sem `token_is_expired = true`

Como o login tambem passa pelo `SendAsync` do handler, verificar apenas o status code causaria falsos positivos. A solucao e desserializar o body e checar a propriedade `token_is_expired`.

## O bug do stream consumido (a grande sacada da aula)

O instrutor demonstra ao vivo o problema mais sutil: ao desserializar o response body no handler com `ReadFromJsonAsync`, o stream e **consumido**. Quando o use case tenta ler o mesmo response novamente (para extrair a mensagem de erro como "e-mail e/ou senha invalidos"), recebe `null`.

Isso acontece porque `HttpContent` le de um stream, e streams sao leitura unica por padrao. O .NET nao armazena o conteudo em memoria automaticamente.

### A solucao: LoadIntoBufferAsync

`await response.Content.LoadIntoBufferAsync()` faz o .NET carregar todo o conteudo do stream em um buffer em memoria. A partir dai, multiplas chamadas a `ReadFromJsonAsync` ou `ReadAsStringAsync` funcionam normalmente.

**Analogia**: E como gravar uma transmissao ao vivo. Se voce so assiste (stream), perdeu. Se gravou (buffer), pode reassistir quantas vezes quiser.

## Cuidados com performance (enfatizados pelo instrutor)

O instrutor faz questao de alertar contra o uso indiscriminado de `LoadIntoBufferAsync`:

1. **Apenas dentro do if 401** — Nao colocar fora do if, senao TODA resposta da API seria carregada em buffer, mesmo as bem-sucedidas
2. **Apenas para objetos pequenos** — O response de erro e um JSON minusculo (um boolean e uma lista curta de strings). Para respostas com payloads grandes (listas de dados, arquivos), o buffer consumiria memoria excessiva
3. **Ambiente controlado** — O instrutor enfatiza que este uso e seguro porque esta em um if especifico, com um objeto de tamanho conhecido

## Equivalente no lado da API

O instrutor menciona que o mesmo problema de leitura unica existe no lado da API com o request body. Se voce tenta ler o body da request mais de uma vez na API, tambem teria erro — mas a solucao la seria um codigo "parecido, nao igual" (provavelmente `EnableBuffering` no middleware).

## Fluxo completo demonstrado

1. Usuario digita email e senha errados
2. App envia request via handler
3. API retorna 401 com mensagem "e-mail e/ou senha invalidos"
4. Handler detecta 401, desserializa body
5. `token_is_expired` e false → handler nao faz nada, retorna response
6. Use case tenta desserializar response → SEM buffer, recebe null → mostra mensagem generica errada
7. COM `LoadIntoBufferAsync` → use case consegue ler e mostra a mensagem correta