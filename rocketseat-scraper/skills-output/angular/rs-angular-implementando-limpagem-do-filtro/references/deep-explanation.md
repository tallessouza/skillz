# Deep Explanation: Limpagem de Filtro com Angular Signals

## Fluxo reativo completo

O instrutor destaca a "magica" que acontece ao setar signals para vazio. O fluxo completo e:

1. **Usuario clica "Limpar Filtro"** → chama `clearFilter()`
2. **clearFilter() seta signals para ''** → `movieTitleFilter.set('')` e `movieCategoryFilter.set('')`
3. **Signals estao linkados via SignalModel** (two-way binding com template-driven forms) → os inputs do formulario sao limpos automaticamente
4. **linkedSignal detecta mudanca** → toda a logica de filtragem e recomputada
5. **Condicao de vazio** → como ambos signals estao vazios, o `if` retorna a lista original
6. **Lista original e exibida** → sem necessidade de re-fetch ou manipulacao manual

## Por que funciona em dois componentes diferentes

O ExploreMovies (componente pai) e o MoviesFilter (componente filho) possuem signals proprios. O instrutor implementa `clearFilter()` em ambos porque:

- No ExploreMovies: os signals `movieTitleFilter` e `movieCategoryFilter` sao a fonte de verdade
- No MoviesFilter: os signals `title` e `category` sao locais, mas estao vinculados aos signals do pai via model signals

Quando o MoviesFilter limpa seus signals locais, a mudanca propaga para os signals do pai, que por sua vez trigam o linkedSignal.

## Detalhe visual importante

O instrutor percebe durante o teste que o botao "Limpar" no componente de filtro (lado direito) nao tinha `cursor-pointer`, diferente do botao "Limpar Filtro" na mensagem de "nenhum filme encontrado". Ele adiciona a classe `cursor-pointer` diretamente na classe do botao para manter consistencia visual.

## Conexao com a aula anterior

Essa aula depende diretamente da implementacao de filtro feita no video anterior, onde:
- Os signals foram criados com `signal('')`
- O linkedSignal foi configurado para recomputar `moviesFiltered` baseado nos valores de titulo e categoria
- Template-driven forms foram vinculados via `[(ngModel)]` com os signals

A limpeza e simplesmente o caminho inverso: resetar os signals para o estado inicial (vazio).