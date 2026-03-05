# Deep Explanation: Tratamento de Erros Não-API em Refit

## Por que a deserialização pode falhar

O instrutor explica dois cenários críticos que desenvolvedores esquecem:

### Cenário 1: Usuário sem internet
Quando o Refit tenta se comunicar com a API mas o dispositivo não tem conexão (Wi-Fi desligado, plano de dados acabou), a requisição nunca chega na API. O Refit aguarda até um timeout e então lança a exceção. Como a API nunca respondeu, o `content` da exceção não contém o JSON no formato `ResponseErrorJson` — a deserialização retorna `null`.

### Cenário 2: API fora do ar
Mesmo com internet funcionando, se a API parou de executar (caiu, não está rodando no servidor), a chamada não chega. O resultado é o mesmo: content sem o formato esperado.

### O ponto-chave do instrutor
"Quem devolve essa resposta é a nossa API por causa do filtro de exceção. A gente só pode estar confiando que a mensagem vai ser desse tipo se somente se for a API que estiver respondendo."

A confiança na deserialização só é válida quando a API está de pé e respondendo — porque o filtro de exceção da API garante o formato `ResponseErrorJson`. Sem a API, não há essa garantia.

## Diferença entre as duas formas de deserialização

O instrutor destaca uma diferença sutil:

1. **`GetContentAsAsync<T>()`** — retorna `null` se não conseguir deserializar. App não crasha, mas ViewModel recebe `null`.
2. **`exception.Content` + deserialização manual** — lança exceção se o JSON não for válido. App crasha se não tratado.

A primeira forma é mais segura mas exige null-check. A segunda crasha sem try-catch.

## Por que extension method e não helper estático

O instrutor escolhe extension method porque:
- O padrão se repete em TODOS os use cases que comunicam com a API
- Extension method permite chamar diretamente no objeto `ApiException` — leitura fluente
- Centraliza em um lugar só: "se mais a frente a gente quiser fazer outros tipos de tratamento, a gente faz em um lugar só que vai se replicar para todo mundo"

## Como testar o cenário

O instrutor demonstra: configura o projeto para executar apenas o app (sem a API) via "Set as Startup Project". Assim simula a API fora do ar. Mostra no debugger que o `content` vem `null`, validando que o null-check funciona.