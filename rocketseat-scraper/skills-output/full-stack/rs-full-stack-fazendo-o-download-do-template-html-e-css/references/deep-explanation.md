# Deep Explanation: Setup de Projeto a partir de Template GitHub

## Por que usar "Use this template" em vez de Fork

O botao "Use this template" no GitHub cria um repositorio **limpo**, sem o historico de commits do repositorio original. Isso e ideal para templates/starters porque:

- Seu repositorio comeca com commit inicial limpo
- Nao ha vinculo (upstream) com o template original
- Voce tem total controle do historico

Fork, por outro lado, mantem todo o historico e o vinculo com o original — util para contribuicoes open source, nao para iniciar projetos.

## Por que nao deixar projetos na pasta Downloads

O instrutor enfatiza: **tire o projeto da pasta Downloads**. Razoes:

1. Downloads acumula arquivos diversos — facil perder o projeto
2. Alguns sistemas fazem limpeza periodica de Downloads
3. Uma pasta dedicada (`~/projetos/` ou `~/dev/`) facilita encontrar e organizar trabalho
4. Consistencia — sempre saber onde seus projetos estao

## Live Server — por que usar

O Live Server e uma extensao do VSCode que:

1. Cria um servidor HTTP local (porta 5500 por padrao)
2. Observa mudancas nos arquivos do projeto
3. Recarrega o navegador automaticamente ao salvar

Sem ele, voce precisaria manualmente dar F5/Ctrl+R no navegador a cada mudanca. Com dezenas de alteracoes por sessao, isso economiza tempo significativo.

### Armadilha comum: extensao desabilitada

O instrutor alerta que as vezes voce clica em "Disable" sem querer. Se "Open with Live Server" nao aparece no menu de contexto:

1. Va em Extensions (Ctrl+Shift+X)
2. Busque "Live Server"
3. Verifique se esta **instalado** E **habilitado** (Enable)

## Sobre o projeto Refund (contexto)

O template e uma aplicacao de **solicitacao de reembolso** corporativo. Cenario: funcionario viaja a servico da empresa e precisa solicitar reembolso de despesas (alimentacao, transporte, acomodacao).

### Funcionalidades que serao implementadas com JavaScript:

1. **Mascara de valor monetario** — formatar input conforme usuario digita (ex: R$ 1.500,00)
2. **Adicionar item a lista** — nome da despesa, categoria, valor
3. **Imagem dinamica por categoria** — food.svg, transport.svg, etc.
4. **Remover item da lista** — botao X para deletar
5. **Contadores automaticos** — quantidade de itens e valor total atualizados em tempo real

O HTML e CSS ja estao prontos — o foco do curso e puramente JavaScript.

## Atalhos uteis mencionados

- `Ctrl +` / `Ctrl -` — aumentar/diminuir zoom no navegador
- Lupa do navegador — alternativa para zoom
- Botao direito no arquivo → Open with Live Server