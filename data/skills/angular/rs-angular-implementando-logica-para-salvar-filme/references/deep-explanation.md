# Deep Explanation: FormData com RxResource no Angular

## Por que signal `undefined` como estado inicial?

O instrutor explica um padrão elegante: o RxResource observa o signal passado em `params`. Se o signal retorna `undefined`, o observable **não é executado**. Isso significa que ao carregar o componente, nenhuma requisição de criação é feita — você pode confirmar no Network tab do DevTools.

Somente quando o usuário clica em "Salvar" e o `movieFormData.set(formData)` é chamado, o signal muda de `undefined` para um `FormData` válido, e o RxResource dispara automaticamente o observable.

Esse padrão elimina a necessidade de:
- Flags booleanas para controlar quando disparar
- Chamadas manuais de `.subscribe()`
- Gerenciamento manual de lifecycle

## O fluxo completo do RxResource para POST

```
signal(undefined) → RxResource observa → nada acontece
     ↓
  usuário preenche form e clica salvar
     ↓
  FormData é criado e populado
     ↓
  signal.set(formData) → RxResource detecta mudança
     ↓
  callback stream é executado → service.createMovie(formData)
     ↓
  Angular HttpClient envia POST multipart/form-data
     ↓
  Backend retorna 201 Created
```

## Por que FormData e não JSON?

O formulário inclui upload de imagem (arquivo binário). JSON não suporta envio de arquivos diretamente. O FormData:

1. Suporta `string` e `Blob` (arquivos)
2. O Angular automaticamente define o `Content-Type: multipart/form-data` com boundary
3. **Não defina o Content-Type manualmente** — o Angular precisa gerar o boundary automaticamente

O instrutor mostra no DevTools: o request header já contém `Content-Type: multipart/form-data` sem nenhuma configuração extra.

## Correspondência de nomes com o backend

O instrutor enfatiza: os nomes dos campos no `formData.append()` **devem ser exatamente** os que o backend aceita. Ele abre o Insomnia para verificar:

- `title` (não `titulo`)
- `description` (não `desc`)
- `anoLancamento` (com L maiúsculo — camelCase do backend)
- `category` (não `genre` ou `genero`)
- `image` (não `file` ou `foto`)

Um nome errado = campo ignorado pelo backend = bug silencioso.

## Tratamento de valores undefined

Para campos que podem ser `undefined` (como `year` e `selectedFile`), o instrutor usa o padrão:

```typescript
this.year?.toString() ?? ''
this.selectedFile ?? ''
```

A string vazia é enviada ao backend, que valida e retorna erro apropriado. Isso é preferível a:
- Não enviar o campo (backend pode ter comportamento inesperado)
- Lançar exceção no client (péssima UX)

## inject() vs Constructor Injection

O instrutor usa o padrão moderno:

```typescript
private readonly _moviesApi = inject(MoviesApiService);
```

Ao invés do padrão clássico com decorator no construtor. Ambos funcionam, mas `inject()` é o padrão recomendado no Angular 17+.