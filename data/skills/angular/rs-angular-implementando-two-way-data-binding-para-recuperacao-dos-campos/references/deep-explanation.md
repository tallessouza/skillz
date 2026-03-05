# Deep Explanation: Two-Way Data Binding com Signals e ngModel

## Por que signals e nao variaveis simples?

O instrutor escolhe signals do Angular para cada campo do formulario porque signals sao a unidade reativa moderna do Angular. Quando o valor de um signal muda (via `.set()`), qualquer template que consome esse signal e automaticamente atualizado. Isso substitui a necessidade de `@Input()`/`@Output()` ou `ngOnChanges` para estado local do componente.

## A "banana in the box" — `[(ngModel)]`

O nome vem da sintaxe visual: `[()]` parece uma banana `()` dentro de uma caixa `[]`. Essa sintaxe combina:
- **Property binding** `[ngModel]="value"` — do componente para o template
- **Event binding** `(ngModelChange)="value = $event"` — do template para o componente

Com signals, o Angular internamente faz `.set()` no signal quando o usuario digita, e lê via signal getter quando precisa renderizar. Por isso **nao se invoca o signal** no template: `[(ngModel)]="title"` e nao `title()`.

## FormsModule vs ReactiveFormsModule

O `ngModel` vive dentro do `FormsModule` (Template-Driven Forms). O instrutor explicitamente menciona que poderia usar Signal Forms ou Reactive Forms, mas opta por Template-Driven por simplicidade. Para formularios simples de captura de dados sem validacao complexa, `FormsModule` + `ngModel` e a escolha mais direta.

## Dois signals para imagem: por que separar?

O instrutor enfatiza a distincao:

1. **`imagePreview`** (string URL) — usado pelo `<img [src]>` no template. O atributo `src` de uma tag `<img>` so aceita URLs, nao aceita binarios diretamente. Entao `URL.createObjectURL(file)` cria uma URL temporaria do tipo `blob:http://localhost:4200/...` que aponta para o arquivo na memoria do navegador.

2. **`selectedFile`** (File object) — o binario real do arquivo selecionado. Esse e o que sera enviado para o backend via `FormData` ou similar. O preview e apenas visual.

## Memory management com revokeObjectURL

Cada vez que `URL.createObjectURL()` e chamado, o navegador aloca memoria para manter aquele arquivo acessivel via URL. Se o usuario trocar de imagem varias vezes sem fazer cleanup, essas URLs acumulam memoria.

O padrao correto:
```typescript
// Antes de criar novo, libera o anterior
if (this.imagePreview()) {
  URL.revokeObjectURL(this.imagePreview()!);
}
// Agora cria o novo
this.imagePreview.set(URL.createObjectURL(file));
```

Isso evita memory leaks em formularios onde o usuario pode trocar imagem multiplas vezes.

## O padrao de captura de arquivo via input hidden

O instrutor usa um `<input type="file" hidden>` que e ativado programaticamente quando o usuario clica em um botao estilizado. O evento `(change)` desse input dispara o metodo `onFileSelected($event)`. O arquivo fica em `event.target.files[0]` porque o input so aceita um arquivo por vez.

## Por que `number | undefined` e nao apenas `number`?

Se inicializarmos `year = signal(0)`, o campo de input mostraria `0` para o usuario, o que e confuso. Usando `undefined`, o campo fica vazio visualmente. Essa e uma decisao de UX que afeta a tipagem do signal.