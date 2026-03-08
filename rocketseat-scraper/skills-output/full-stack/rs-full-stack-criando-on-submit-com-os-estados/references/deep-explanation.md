# Deep Explanation: Criando onSubmit com Estados

## Por que onSubmit no form e nao onClick no botao?

O instrutor demonstra na pratica o problema: quando voce coloca `onClick` no botao, o usuario so consegue enviar o formulario clicando no botao. Se o usuario pressiona Enter (comportamento natural em formularios), nada acontece. Isso quebra a acessibilidade e a expectativa do usuario.

Ao usar `onSubmit` no `<form>` e `type="submit"` no botao, ambos os caminhos funcionam:
- Clicar no botao → dispara submit do form
- Pressionar Enter em qualquer input → dispara submit do form

Alem disso, o browser aplica validacoes nativas (`required`, `type="email"`) automaticamente antes de disparar o submit. Com `onClick`, essas validacoes sao ignoradas.

## O papel do preventDefault

Quando um formulario HTML e submetido, o comportamento padrao do browser e recarregar a pagina (fazendo um GET ou POST para a URL do action). Em uma SPA React, isso e desastroso porque:

1. Os estados React sao resetados
2. Os dados digitados se perdem
3. A aplicacao reinicia do zero

O instrutor mostra isso acontecendo ao vivo: ele preenche email e senha, da submit, ve o alert, clica OK, e os campos estao vazios porque a pagina recarregou.

`e.preventDefault()` intercepta esse comportamento padrao, mantendo a pagina intacta e permitindo que o React gerencie o envio via JavaScript.

## Estados controlados — um por campo

O padrao mostrado usa um `useState` separado para cada campo:

```tsx
const [email, setEmail] = useState("")
const [password, setPassword] = useState("")
const [isLoading, setIsLoading] = useState(false)
```

Por que nao um unico objeto de estado? Porque cada campo muda independentemente. Um `useState` por campo e mais simples, mais explicito, e evita spreads de objeto que podem causar bugs sutis.

O `onChange` em cada input sincroniza o valor digitado com o estado React:

```tsx
onChange={(e) => setEmail(e.target.value)}
```

`e.target.value` contem o valor atual do input no DOM. O React entao re-renderiza o componente com o novo valor.

## isLoading como guarda de envio

O estado `isLoading` serve como guarda dupla:

1. **Visual:** O botao mostra que esta processando (pode mudar texto, adicionar spinner)
2. **Funcional:** `disabled={isLoading}` impede que o usuario clique novamente durante o processamento

O instrutor demonstra trocando `isLoading` para `true` manualmente e mostrando que o botao fica desabilitado — clicar nao dispara o submit. Isso previne envios duplicados (double-submit), um problema classico em formularios web.

## Tipagem do evento

O instrutor tipa o evento como `React.FormEvent`:

```tsx
function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
```

Isso garante que:
- `e.preventDefault()` existe e esta tipado
- `e.target` e tipado como `HTMLFormElement`
- O TypeScript valida que voce esta usando metodos corretos do evento

## Validacoes nativas do browser

Um beneficio pouco explorado mas demonstrado na aula: ao usar `type="email"` e `required` nos inputs, o browser valida automaticamente antes de permitir o submit. O instrutor mostra:
- Campo vazio → browser exibe "preencha este campo"
- Email invalido → browser exibe "inclua um @ no endereco"

Tudo isso funciona de graca, sem JavaScript adicional, porque o envio passa pelo mecanismo nativo de submit do form.

## Navegacao por teclado

O instrutor menciona que com esse padrao, o usuario pode navegar entre campos com Tab e enviar com Enter. Isso e acessibilidade basica que vem de graca ao usar a semantica correta do HTML (`<form>`, `type="submit"`, `required`).