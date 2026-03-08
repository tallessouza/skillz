# Deep Explanation: Informando Token do Usuário

## Por que automatizar o token?

Ao trabalhar com APIs autenticadas, o fluxo manual é:
1. Fazer login (POST /sessions)
2. Copiar o token da resposta
3. Colar o token na requisição autenticada
4. Repetir toda vez que o token expira

Esse processo é tedioso e propenso a erros. O instrutor demonstra que, embora funcione perfeitamente de forma manual, existe uma forma "mais interessante" usando os recursos nativos do Insomnia.

## Como funciona o Response Body Attribute

O Insomnia permite criar **template tags** — referências dinâmicas que buscam valores de outras requisições. O Response Body Attribute é uma dessas tags que:

1. **Referencia outra requisição** — no caso, a de criação de sessão
2. **Extrai um valor do corpo da resposta** — usando filtros JSONPath
3. **Atualiza automaticamente** — baseado no Trigger Behavior configurado

### O atalho Ctrl + Barra de Espaço

Dentro de qualquer campo de texto do Insomnia, pressionar Ctrl + Barra de Espaço abre o menu de template tags. É como um autocomplete de variáveis dinâmicas. O cursor precisa estar piscando no campo para funcionar.

### A caixinha vermelha vs azul

- **Vermelha**: a tag está configurada mas com erro (requisição não encontrada, filtro inválido, etc.)
- **Azul**: a tag está configurada corretamente e retornando um valor válido

## JSONPath — O sistema de filtros

O símbolo `$` representa a raiz do JSON retornado. A partir dele, você navega pela estrutura:

- `$` — retorna todo o corpo da resposta
- `$.token` — retorna apenas o campo token
- `$.user` — retorna o objeto user inteiro
- `$.user.name` — retorna apenas o nome dentro de user
- `$.user.email` — retorna apenas o e-mail

O instrutor demonstra isso ao vivo, mostrando como o preview na parte inferior da janela muda conforme o filtro é alterado. Isso permite testar o filtro antes de confirmar.

## Trigger Behavior — Quando atualizar o token

O Insomnia oferece opções de quando re-executar a requisição referenciada:

| Opção | Comportamento |
|-------|---------------|
| **Never** | Usa o último valor cacheado, nunca re-executa |
| **No History** | Re-executa apenas se não houver cache |
| **When Needed** | Re-executa quando o cache expirar ou estiver inválido |
| **Always** | Re-executa a cada vez que a requisição principal é enviada |

O instrutor recomenda **"Always — Resend request when needed"** porque garante que o token está sempre atualizado. Isso é especialmente útil quando tokens têm tempo de expiração curto.

## Fluxo completo automatizado

Quando você clica Send na requisição autenticada com a tag configurada:

1. Insomnia detecta a template tag no campo Token
2. Executa automaticamente a requisição de sessão (POST /sessions)
3. Recebe a resposta com o token
4. Aplica o filtro JSONPath (`$.token`)
5. Injeta o valor extraído no header `Authorization: Bearer {token}`
6. Envia a requisição autenticada com o token atualizado

Tudo isso acontece transparentemente — o instrutor demonstra fazendo múltiplos sends consecutivos e mostrando que "continua funcionando porque ele já pega o token atualizado".

## Organização das requisições

O instrutor menciona que na lista de seleção de requisição, o Insomnia mostra entre colchetes o nome da pasta, o método HTTP e o nome da requisição. Por exemplo: `[Sessions] POST session`. Isso reforça a importância de organizar as requisições em pastas com nomes descritivos para facilitar a referência cruzada.