# Deep Explanation: Criando Botão de Deleção com TDD

## O ciclo TDD na pratica

O instrutor demonstra o ciclo TDD de forma pragmatica, nao academica. A chave e **gerenciar a ansiedade de querer ver as coisas funcionando**. O TDD disciplina esse impulso:

1. **Red** — Escreva um teste que descreve o comportamento desejado. O teste VAI falhar. Isso e esperado e desejado.
2. **Green** — Escreva o **minimo absoluto** de codigo para o teste passar. Mesmo que seja horrivel visualmente.
3. **Refactor** — Agora que o teste esta verde, melhore o codigo com confianca.

### O "minimo absoluto" e mesmo minimo

O instrutor mostra algo que parece absurdo: para fazer o teste de "ao clicar no botao, aparece o texto 'Remover prompt'", ele implementa:

```tsx
const [isOpen, setIsOpen] = useState(false)

// No button:
onClick={() => setIsOpen(true)}

// No render:
{isOpen && <p>Remover prompt</p>}
```

Um paragrafo simples. Sem modal, sem dialog, sem estilizacao. "Ta horrivel isso aqui", ele admite. Mas o teste passa. E esse e o ponto: **o teste guia a implementacao, nao a estetica**.

Depois, na fase de refatoracao, ele substitui o `<p>` pelo AlertDialog completo do shadcn/ui — e o teste **continua passando** sem alteracao. Isso prova que o teste esta testando comportamento, nao implementacao.

## Por que AlertDialog e nao um modal customizado

O AlertDialog do Radix (via shadcn/ui) e especificamente projetado para acoes destrutivas:
- Foca automaticamente no botao de cancelar (previne acoes acidentais)
- Bloqueia interacao com o resto da pagina
- E acessivel por padrao (aria roles corretos)
- Tem componentes granulares (Title, Description, Cancel, Action) que permitem usar so o necessario

## A importancia do `asChild` no Trigger

```tsx
<AlertDialogTrigger asChild>
  <Button>...</Button>
</AlertDialogTrigger>
```

O `asChild` faz o trigger delegar a renderizacao para o filho direto, evitando um `<button>` dentro de `<button>` (que seria HTML invalido). Sem `asChild`, o AlertDialogTrigger renderiza seu proprio botao, e o Button interno criaria aninhamento invalido.

## Estado de loading como UX defensiva

O `isDeleting` serve dois propositos:
1. **Feedback visual** — o usuario sabe que a acao esta em andamento (Loader2 com animate-spin)
2. **Prevencao de duplo clique** — `disabled={isDeleting}` impede que o usuario clique novamente enquanto a acao esta sendo processada

## Acessibilidade do botao de icone

Quando um botao tem apenas icone (sem texto visivel), **precisa** de `title` e `aria-label`:

```tsx
<Button title="Remover prompt" aria-label="Remover prompt">
  <Trash className="w-3 h-3" />
</Button>
```

Isso permite:
- Screen readers lerem "Remover prompt"
- Testes encontrarem o botao: `getByRole('button', { name: /remover prompt/i })`
- Tooltip nativo ao hover (via `title`)

## Posicionamento do componente

O instrutor demonstra um detalhe importante de layout: inicialmente coloca o AlertDialog fora do header, o que quebra o layout visual (botao aparece embaixo). A solucao e mover todo o AlertDialog para **dentro do header**, mantendo o fluxo visual correto do card.