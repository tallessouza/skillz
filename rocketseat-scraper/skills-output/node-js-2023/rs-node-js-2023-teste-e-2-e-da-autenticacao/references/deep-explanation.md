# Deep Explanation: Teste E2E da Autenticação

## Por que criar pre-requisitos via API e nao via ORM?

O instrutor enfatiza um ponto fundamental: se estamos fazendo teste end-to-end, precisamos **simular exatamente como um usuario utilizaria a aplicacao**. Antes de fazer login, o usuario criaria uma conta. Entao o teste deve fazer o mesmo — chamar `POST /users` primeiro, depois `POST /sessions`.

Usar o Prisma diretamente para inserir o usuario no banco "funciona", mas quebra a filosofia do teste e2e. O objetivo e testar o fluxo completo, de ponta a ponta. Se voce insere dados diretamente no banco, esta pulando uma parte do fluxo (o registro) e potencialmente escondendo bugs nessa etapa.

## A filosofia "poucos testes, mas completos"

O instrutor faz uma distincao critica entre o proposito dos testes e2e e dos testes unitarios:

> "A gente nao cria testes end-to-end para cada regra de negocio da nossa aplicacao."

Testes e2e sao **pesados** — cada um sobe servidor, conecta ao banco, faz requisicoes HTTP reais. Se voce criar teste e2e para cada cenario (senha errada, email invalido, usuario ja existe), vai ter uma suite lenta que duplica o que os testes unitarios ja cobrem.

A regra e:
- **Testes unitarios**: cobrem cada regra de negocio, cada caso de erro, sao rapidos
- **Testes e2e**: cobrem o **caminho de sucesso** de cada fluxo, garantem que tudo funciona junto

> "O teste end-to-end precisa ser poucos testes, porem que testam o fluxo de cabo a rabo e garantem que aquele fluxo esta funcionando no seu caminho de sucesso."

## Validacao da forma vs valor

O teste valida que o body contem `{ token: expect.any(String) }`. Nao tenta decodificar o JWT, nao verifica claims, nao compara com um valor fixo. Isso porque:

1. O valor do token muda a cada execucao
2. A logica de geracao do token ja foi testada em outro nivel
3. O teste e2e so precisa garantir que a rota retorna um token valido como string

## Estrutura do teste

O padrao seguido e:
1. `beforeAll` — espera o app ficar pronto (`app.ready()`)
2. `afterAll` — fecha o app (`app.close()`)
3. Cada `it` — executa o fluxo completo com pre-requisitos

Isso garante que o servidor esta rodando durante os testes e e limpo ao final.