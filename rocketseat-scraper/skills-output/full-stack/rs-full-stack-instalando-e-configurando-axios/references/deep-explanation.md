# Deep Explanation: Instalando e Configurando Axios

## Por que usar Axios em vez de fetch nativo?

Axios e uma biblioteca dedicada para consumo de APIs que oferece uma API mais ergonomica que o `fetch` nativo. O instrutor apresenta como "a biblioteca que a gente utiliza para consumir API" — e o padrao de mercado em projetos React/Next.js para comunicacao HTTP.

## O conceito de baseURL

A ideia central da aula e a **separacao entre endereco base e recurso**. O instrutor explica com clareza:

- **BaseURL** = parte fixa que nunca muda: `http://localhost:3333`
- **Recurso** = parte variavel que muda por requisicao: `/users`, `/refunds`

Exemplo do instrutor:
- Criar usuario: `POST http://localhost:3333/users`
- Listar reembolsos: `GET http://localhost:3333/refunds`

"Perceba que essa parte aqui nunca muda. O que vai mudar e os recursos que a gente vai consumir."

Ao definir a baseURL no `axios.create()`, todas as requisicoes feitas com aquela instancia herdam o endereco base. Isso elimina repeticao e centraliza a mudanca quando o endereco mudar (ex: deploy em producao).

## Por que `localhost` e nao o IP da maquina?

O instrutor destaca: "voce poderia colocar o teu endereco IP da tua maquina, mas vou deixar localhost para ficar um pouco mais dinamico — as vezes o endereco acaba mudando, principalmente se voce muda de maquina".

`localhost` e um alias que sempre aponta para a propria maquina, independente do IP real. Isso torna o codigo portavel entre maquinas de desenvolvimento.

## HTTP vs HTTPS

O instrutor explica que em desenvolvimento local usa-se `http://` porque a API roda na propria maquina. Em producao, usa-se `https://` (o "S" de security = protocolo seguro). Essa distincao e importante porque:

- Desenvolvimento: sem certificado SSL, `http` funciona diretamente
- Producao: `https` e obrigatorio para seguranca dos dados em transito

## Por que a pasta se chama `services`?

O instrutor escolhe o nome `services` (ou `servers` na fala dele) porque representa "os servicos que a nossa aplicacao vai consumir". E uma convencao comum em projetos frontend:

```
src/
├── components/   # UI
├── pages/        # Rotas
├── services/     # Comunicacao externa (APIs, SDKs)
└── utils/        # Funcoes utilitarias
```

A pasta `services/` isola toda a logica de comunicacao externa, mantendo componentes livres de detalhes de infraestrutura HTTP.

## O padrao `axios.create()`

Em vez de usar `axios.get()` ou `axios.post()` diretamente (que usam a instancia global), o padrao correto e criar uma instancia dedicada com `axios.create()`. Isso permite:

1. **BaseURL fixa** — nao repetir o endereco em cada chamada
2. **Headers padrao** — adicionar token de autenticacao depois
3. **Interceptors** — tratar erros globalmente
4. **Multiplas APIs** — ter instancias diferentes para servicos diferentes

## A porta 3333

O instrutor mostra que a porta `3333` vem da configuracao do servidor backend. "O servidor esta rodando na porta 3333" — essa informacao vem do terminal onde o backend esta executando. A porta faz parte da baseURL e deve corresponder exatamente ao que o backend esta servindo.