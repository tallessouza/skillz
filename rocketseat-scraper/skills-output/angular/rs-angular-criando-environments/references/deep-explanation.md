# Deep Explanation: Angular Environments

## Por que environments existem

O instrutor explica o problema central: se você gera um pacote de distribuição com `localhost` hardcoded nos services e coloca num servidor com uma URL pública, quando o usuário acessar, o navegador vai tentar bater no `localhost` da máquina do usuário — não no seu servidor. Isso causa erro imediato.

Environments resolvem isso permitindo configurações específicas por ambiente (desenvolvimento, homologação, produção) sem alterar código.

## Como funciona o file replacement

O mecanismo é baseado no `angular.json`. Quando você executa `ng generate environments`, o Angular adiciona na seção `configurations.development`:

```json
{
  "fileReplacements": [{
    "replace": "src/environments/environment.ts",
    "with": "src/environments/environment.development.ts"
  }]
}
```

**O truque:** no código, você sempre importa `environment.ts`. Mas quando o Angular faz o build/serve com a configuração `development`, ele substitui o conteúdo do arquivo pelo `environment.development.ts` antes de compilar.

Na configuração `production`, **não há file replacement** — logo, o `environment.ts` original é usado diretamente. Por isso ele é o arquivo de produção.

## Fluxo de build

- `ng serve` → usa configuração `development` por padrão → file replacement ativo → `environment.development.ts`
- `ng build` → usa configuração `production` por padrão → sem file replacement → `environment.ts`
- `ng serve --configuration=production` → simula produção no serve local

## Detalhe da barra no final da URL

O instrutor destaca um cuidado prático: propriedades como caminhos de imagem de filmes já começam com `/`. Se a `baseUrl` terminar com `/`, a concatenação resulta em `//`, causando problemas. Por isso, a convenção é não incluir barra final na `baseUrl` e incluir barra inicial nos paths dos endpoints.

## Consistência entre arquivos

Todos os arquivos de environment devem ter exatamente as mesmas propriedades. Se `environment.ts` tem `baseUrl`, `environment.development.ts` também precisa ter. Caso contrário, o código que acessa `environment.baseUrl` vai funcionar em um ambiente e quebrar em outro — um bug silencioso e difícil de debugar.

## Criando ambientes adicionais

Embora a aula foque em development e production, o instrutor menciona que você pode criar `environment.homol.ts` e registrar o file replacement correspondente na seção de configurações do `angular.json`. Cada novo ambiente é uma nova entry em `configurations` com seu próprio `fileReplacements`.