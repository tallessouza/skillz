# Deep Explanation: Navegacao via Template com routerLink

## Raciocinio do instrutor

O instrutor demonstra um padrao muito comum em Angular: substituir metodos de componente que apenas fazem redirecionamento por diretivas de template. A motivacao e clara — se um botao de cancelar so precisa voltar para outra tela, nao ha razao para ter um metodo no componente que faz apenas `this.router.navigate()`.

## Por que routerLink e melhor para navegacao simples

1. **Menos codigo** — elimina metodo no componente, import do Router, e o binding de click no template
2. **Semantica correta** — o Angular entende que aquele elemento e um link de navegacao, permitindo comportamentos nativos (como abrir em nova aba com Ctrl+Click em `<a>`)
3. **Previsibilidade** — a rota esta visivel no template, nao escondida em um metodo

## Quando NAO usar routerLink

O instrutor implicitamente mostra que routerLink e para casos simples. Se antes de navegar voce precisa:
- Validar um formulario
- Salvar dados
- Mostrar confirmacao
- Fazer logica condicional

Nesses casos, mantenha o metodo no componente.

## Contexto do projeto

No gerenciador de filmes da Rocketseat, a tela de criacao de filme tem um botao "Cancelar" que simplesmente volta para a tela de explorar (`/explorar`). O instrutor removeu o metodo `cancelar()` do componente e colocou `[routerLink]="['/explorar']"` diretamente no botao do template.

## Componentes standalone e imports

Em Angular moderno (standalone components), e necessario importar `RouterLink` diretamente no array `imports` do decorator `@Component`. Sem esse import, a diretiva `routerLink` nao sera reconhecida no template.