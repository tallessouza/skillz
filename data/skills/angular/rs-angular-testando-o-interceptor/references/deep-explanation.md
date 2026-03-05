# Deep Explanation: Testando o Interceptor Angular

## Por que testar o interceptor manualmente primeiro

O instrutor enfatiza um fluxo de teste progressivo — testar com 3 estados distintos do local storage para validar que o interceptor se comporta corretamente em cada cenario. Isso e mais revelador que um unit test porque mostra o comportamento real no browser.

## Os 3 estados de teste

### Estado 1: Local storage vazio
Quando nao ha nada no local storage, o interceptor (baseado na logica criada na aula anterior) simplesmente repassa a requisicao sem adicionar headers. O backend retorna 401 com "Token nao fornecido". Isso confirma que:
- O interceptor esta ativo (a requisicao passou por ele)
- A logica condicional funciona (sem token = sem header)

### Estado 2: Token invalido no local storage
Ao colocar um valor qualquer como `teste123`, o interceptor adiciona o header `Authorization: Bearer teste123`. O backend retorna 401 mas com mensagem diferente: "Token invalido ou expirado". Isso confirma que:
- O interceptor esta lendo do local storage corretamente
- O header esta sendo formatado corretamente (`Bearer` + espaco + token)
- O backend diferencia entre ausencia de token e token invalido

### Estado 3: Token valido
Gerando um token real via login no Insomnia e colando no local storage, a requisicao retorna 200. Isso confirma o fluxo completo end-to-end.

## Insight do instrutor sobre uso futuro

O instrutor menciona que essa validacao de token (`validateToken`) sera chamada toda vez que o usuario tentar acessar uma rota protegida. Isso antecipa o uso de guards no Angular — o interceptor cuida de ADICIONAR o token, enquanto um guard vai VERIFICAR se o token e valido antes de permitir navegacao.

## Por que remover o codigo de teste

O codigo foi adicionado diretamente no AppComponent apenas para demonstracao. Em producao, o `validateToken` sera chamado por um route guard, nao pelo AppComponent. Deixar esse codigo causaria uma requisicao desnecessaria a cada carregamento da aplicacao.

## Ferramenta de inspecao: Network tab

O instrutor usa extensivamente o Network tab do DevTools para verificar:
- **Status code**: 401 vs 200
- **Response body**: mensagem de erro especifica
- **Request headers**: presenca e formato do header Authorization

Essa abordagem de inspecao e mais confiavel que apenas olhar o console, porque mostra exatamente o que foi enviado ao servidor.