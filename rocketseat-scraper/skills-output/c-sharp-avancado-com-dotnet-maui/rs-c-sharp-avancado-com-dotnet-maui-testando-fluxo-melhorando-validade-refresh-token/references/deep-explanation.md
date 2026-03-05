# Deep Explanation: Configuracao Injetavel e IOptions no .NET

## Por que eliminar numeros magicos?

O instrutor Wellison destaca que o numero `7` no codigo `.AddDays(7)` e um "numero magico" — nao comunica o que significa e nao permite personalizacao. A pergunta chave: "E se eu quiser que em producao sejam 7 dias, mas em desenvolvimento sejam 10?"

## Como o .NET resolve a navegacao no JSON

O .NET usa `:` como separador de caminho. Quando voce escreve `"Settings:RefreshToken"`:

1. O .NET olha o JSON completo como um objeto
2. Procura a chave `Settings` — encontra o objeto
3. Dentro de `Settings`, procura `RefreshToken` — encontra o sub-objeto
4. Deserializa todas as propriedades do sub-objeto para a classe C#

**Critico:** Os nomes das propriedades na classe C# devem ser identicos aos nomes no JSON. O nome da classe e dos objetos pai nao precisa bater — apenas as propriedades folha.

## `get; init;` vs `get; set;`

O instrutor enfatiza usar `get; init;` porque:
- O servico de injecao de dependencia cria a instancia e preenche as propriedades no momento da inicializacao
- Apos isso, nenhum codigo consegue alterar o valor
- Previne bugs onde algum codigo acidentalmente muda a configuracao em runtime

## IOptions vs IOptionsMonitor vs IOptionsSnapshot

O instrutor demonstrou ao vivo a diferenca:

- **IOptions<T>:** Interface base. Valor e lido uma vez na inicializacao. Se voce alterar o appsettings.json com a API rodando, o valor NAO se atualiza. Precisa reiniciar.
- **IOptionsSnapshot<T>:** Recarrega o valor a cada request (scoped). Se alterar o JSON sem parar a API, o proximo request ja recebe o novo valor. Acessa via `.Value`.
- **IOptionsMonitor<T>:** Similar ao Snapshot mas singleton. Recarrega automaticamente. Acessa via `.CurrentValue` (nao `.Value`).

O instrutor demonstrou isso ao vivo: mudou o valor de 7 para 20 no appsettings sem parar a API, e usando IOptionsSnapshot o novo valor ja apareceu no proximo request. Depois mudou para 10 e tambem refletiu imediatamente.

Para o caso de uso do curso (refresh token validity), `IOptions` base e suficiente porque o valor raramente muda em runtime.

## Documentacao de status codes

O instrutor identificou que a documentacao Swagger estava incompleta — mostrava apenas 200 OK. Os status corretos sao:
- **200 OK** — novos tokens gerados com sucesso
- **401 Unauthorized** — refresh token nao encontrado ou access token invalido
- **403 Forbidden** — refresh token expirado (data de validade ultrapassada)

## Fluxo completo do Refresh Token testado

1. Login → recebe Access Token + Refresh Token
2. App envia ambos para endpoint `/authentication/refresh`
3. Use Case valida: refresh token existe no banco?
4. Extrai o token ID do Access Token (do payload)
5. Compara: o Access Token ID do request bate com o armazenado no Refresh Token?
6. Calcula data de expiracao: `CreatedAt + RefreshTokenValidIn dias`
7. Data expirou? Se sim, 403. Se nao, gera novos tokens
8. Deleta tokens antigos, persiste novos, retorna 200