# Deep Explanation: Componente FileItem Multi-Estado

## Por que extrair o FileItem?

O instrutor começa separando o FileItem do FileList. A razão é que cada item de upload tem seu próprio ciclo de vida — ele começa em progresso, pode completar com sucesso ou falhar. Manter essa lógica dentro do FileList mistura responsabilidades: o FileList cuida da lista, o FileItem cuida do estado individual.

O processo foi:
1. Criar `fileitem.tsx`
2. Copiar o conteúdo existente do FileList para dentro
3. Definir props tipadas: `name: string`, `size: number`, `type: string`
4. Substituir referências a `file.xxx` pelas props
5. No FileList, usar `<FileItem name={file.name} size={file.size} />`

## A decisão sobre estados

O instrutor define o estado como constante local primeiro (`const state = 'progress'`) para prototipar rapidamente. Ele reconhece que isso é temporário — o estado real viria de um hook ou prop. Mas começar com constante permite estilizar cada variação sem precisar de lógica de upload real.

O tipo do estado: `'progress' | 'complete' | 'error'` — union type que o TypeScript valida.

## Estilização condicional por estado

### Complete
- Barra de progresso vai para 100% (via `style={{ width: '100%' }}`)
- Ícone Trash é substituído por CheckCircle2
- O CheckCircle2 usa `fill-violet-600 text-white` — o `fill` preenche o SVG inteiro enquanto `text-white` colore o check interno

### Error
- Todo o bloco do meio muda: em vez de nome + progresso, mostra mensagem de erro + nome + botão "Try again"
- A barra de progresso desaparece completamente
- O ícone Trash também desaparece
- Cores usam a paleta `error` customizada

## Por que criar a paleta `error` em vez de usar `red`?

O instrutor experimentou primeiro com `text-red-700` e não curtiu. A paleta `red` padrão do Tailwind é genérica — serve para muitos propósitos. A paleta `error` foi criada com tons de vermelho rosado específicos que:

1. São mais suaves que o vermelho puro (mais rosê)
2. Comunicam semântica — `error-700` diz "isto é um erro" melhor que `red-700`
3. Podem ser ajustadas globalmente — mudar a paleta `error` atualiza todos os estados de erro da aplicação

A paleta vai de 25 (quase branco rosado) até 900 (vermelho escuro profundo), com 10 variações.

## Escolha de tonalidades

O instrutor explicitamente evita `error-500` para texto porque é "muito claro" — não tem contraste suficiente para leitura. Usa:
- `error-700` para texto primário e botões
- `error-600` para texto secundário (nome do arquivo)
- `error-900` para hover em botões (bem escuro, dá feedback visual claro)

## O que falta (próxima aula)

O instrutor menciona que ainda falta:
- Mudar a cor da borda baseado no estado
- Mudar a cor do ícone de arquivo baseado no estado
- Customizar o botão baseado no estado

Isso será feito com uma abordagem de classes condicionais mais sofisticada.