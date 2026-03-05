# Deep Explanation: Testando Navegacao com Push Mock

## Por que mockar o push em vez de verificar a URL

O ambiente de teste (jsdom) nao tem um browser real. Nao existe navegacao de verdade. O que o componente faz e chamar `router.push('/rota')`. O teste verifica que essa funcao foi chamada com o argumento correto — isso e suficiente para garantir o comportamento.

## Organizacao em describes aninhados

O instrutor enfatiza que conforme os testes crescem, a organizacao em describes aninhados se torna essencial. Cada describe agrupa uma funcionalidade:

```
Sidebar (describe principal)
  ├── colapsar (describe)
  │   └── deveria colapsar ao clicar...
  └── novoPrompt (describe)
      └── deveria navegar para /nu...
```

Isso permite expandir/colapsar funcionalidades no output do test runner e adicionar mais testes por funcionalidade sem poluir o escopo global.

## Quando usar next-router-mock

O instrutor menciona a biblioteca [next-router-mock](https://github.com/scottrippey/next-router-mock) para cenarios mais complexos:

- Iniciar o teste ja em uma rota especifica (ex: `mockRouter.push('/dashboard')` antes do render)
- Verificar pathname, query params, e SPF apos navegacao
- Simular historico de navegacao (back/forward)

Para cenarios simples (verificar que push foi chamado com uma string), jest.fn() e suficiente e nao adiciona dependencia.

## O padrao de verificacao deliberada

O instrutor demonstra um ponto importante: ele muda propositalmente o argumento esperado de `/nu` para `/edit` para mostrar que o teste quebra corretamente. A mensagem de erro mostra:

```
Expected: "/edit"
Received: "/nu"
```

Isso prova que o mock esta funcionando e o teste e confiavel. Essa pratica de "quebrar o teste de proposito" e uma forma de validar que o teste nao e um falso positivo.

## pushMock como jest.fn()

`jest.fn()` cria uma funcao espia que:
- Registra quantas vezes foi chamada
- Registra com quais argumentos
- Pode ser verificada com matchers como `toHaveBeenCalledWith`, `toHaveBeenCalledTimes`, `toHaveBeenCalled`

Ao passar esse mock para o useRouter, qualquer chamada a `router.push()` no componente e capturada e pode ser verificada.