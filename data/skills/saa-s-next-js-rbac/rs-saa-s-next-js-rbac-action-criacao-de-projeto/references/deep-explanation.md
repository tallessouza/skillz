# Deep Explanation: Action de Criacao de Projeto

## Por que separar o HTTP client do Server Action?

O instrutor segue um padrao consistente ao longo do curso: cada chamada de API tem seu proprio arquivo HTTP wrapper (ex: `createProject.http` ou `.ts`). A razao e clara — o Server Action contem logica de orquestracao (buscar org, validar, redirecionar), enquanto o wrapper HTTP contem apenas a mecanica da requisicao.

Isso permite reusar o mesmo wrapper em diferentes contextos (outro action, um route handler, um script) sem duplicar a logica de request.

## O padrao de copiar e adaptar

O instrutor explicitamente copia o `createOrganization` e adapta para `createProject`. Isso nao e preguica — e um padrao deliberado:

1. Copie o arquivo HTTP wrapper existente mais parecido
2. Faca find-and-replace do nome (createOrganization → createProject)
3. Ajuste a rota (`organizations` → `organizations/${org}/projects`)
4. Ajuste os campos do body (remova o que nao precisa, adicione o que falta)

Esse padrao minimiza erros porque voce parte de algo que ja funciona.

## Org na URL vs no Body

A API do projeto exige saber qual organizacao esta criando o projeto. Em vez de enviar isso no body do request, a org vai como path parameter:

```
POST /organizations/{org}/projects
Body: { name, description }
```

Isso e um padrao REST para recursos nested — o recurso pai (org) define o escopo via URL, e o body contem apenas dados do recurso filho (project).

## getCurrentOrg() e o Non-null Assertion

O `getCurrentOrg()` busca o slug da organizacao atual dos cookies do navegador. Ele pode retornar `null` em teoria (se o cookie nao existir), mas na pratica, quando o usuario esta na pagina de criacao de projeto, ele ja passou por uma rota que garante a existencia da org.

O instrutor usa `getCurrentOrg()!` (non-null assertion) ao inves de tratar o caso nulo, porque:
- A pagina so e acessivel dentro do contexto de uma org
- Tratar um caso que nunca acontece adiciona complexidade desnecessaria
- O `!` comunica a intencao: "eu sei que isso nao e nulo aqui"

## Server Actions e Cookies

Um ponto importante mencionado pelo instrutor: Server Actions tem acesso total aos cookies porque rodam no servidor. Isso significa que voce pode chamar `getCurrentOrg()` (que internamente le cookies) diretamente dentro do action, sem precisar receber essa informacao do client.

Isso e diferente de Client Components, onde voce nao tem acesso direto aos cookies HTTP-only.

## Fluxo completo

1. Usuario preenche nome e descricao no form
2. Form chama a Server Action
3. Action busca org dos cookies via `getCurrentOrg()!`
4. Action chama o HTTP wrapper `createProject({ org, name, description })`
5. Wrapper faz POST para `/organizations/${org}/projects` com `{ name, description }` no body
6. Em caso de sucesso, exibe mensagem de sucesso

## Debugging observado

O instrutor encontrou um erro na primeira tentativa ("save project failed") e verificou os logs. Descobriu que o projeto "test" ja existia (provavelmente conflito de nome unico). Criou "test2" e funcionou. Depois verificou com F5 que o projeto aparecia na listagem.

Esse fluxo de debug e natural: tente → falhe → verifique logs → ajuste → tente de novo → confirme visualmente.