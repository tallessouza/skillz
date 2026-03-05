# Deep Explanation: Iframe Sandbox

## Por que sandbox existe

Iframes sao usados para carregar mini-aplicacoes de outros dominios dentro do seu site. Porem, ha cenarios onde o conteudo carregado e gerado pelo usuario — HTML, documentos, previews. Nesse caso, voce nao controla o que esta dentro do iframe, e sem restricoes, esse conteudo pode:

- **Executar JavaScript arbitrario** — potencialmente acessando cookies, storage, ou fazendo requests
- **Abrir popups** — janelas nao solicitadas que podem ser usadas para phishing
- **Enviar formularios** — submissoes automaticas que podem redirecionar o usuario
- **Navegar a janela pai** — usando `target="_top"` para sequestrar a navegacao

## Como o atributo sandbox funciona

O atributo `sandbox` sem valor aplica **todas as restricoes simultaneamente**. E um modelo de seguranca "deny by default" — tudo e bloqueado ate que voce explicitamente libere.

Isso inclui:
- Execucao de JavaScript bloqueada
- Popups bloqueados
- Formularios nao podem ser submetidos
- Links visitados nao sao marcados com cor diferente
- Navegacao top-level bloqueada
- Plugins bloqueados

## Granularidade das permissoes

O instrutor demonstrou a adicao incremental de permissoes:

1. `sandbox` vazio → nada funciona
2. `sandbox="allow-popups"` → apenas popups funcionam, JS e forms continuam bloqueados
3. `sandbox="allow-popups allow-scripts"` → popups e JS funcionam, forms bloqueados
4. `sandbox="allow-popups allow-scripts allow-forms"` → tudo liberado explicitamente

Essa abordagem incremental e a forma correta de trabalhar: comece bloqueando tudo e va liberando conforme a necessidade real.

## Perigo critico: allow-scripts + allow-same-origin

Esta e a combinacao mais perigosa e que deve ser evitada. Quando ambos estao presentes, o JavaScript dentro do iframe pode acessar o DOM da pagina pai (por ser same-origin) e remover o atributo `sandbox` do proprio iframe, eliminando todas as restricoes.

## Quando usar

O instrutor enfatizou: "Nao e o tipo de coisa que a gente usa o tempo todo, mas no dia que voce precisar usar iframes, saber que isso existe pode ajudar bastante." Casos tipicos:

- Sites que permitem upload de HTML pelo usuario
- Sistemas de preview de templates
- Plataformas de conteudo gerado pelo usuario (UGC)
- Sandboxing de widgets de terceiros nao confiaveis

## Referencia completa de permissoes

Valores possiveis para o atributo sandbox (consultaveis no MDN):

| Valor | Permite |
|-------|---------|
| `allow-scripts` | Execucao de JavaScript |
| `allow-popups` | Abertura de novas janelas |
| `allow-forms` | Envio de formularios |
| `allow-same-origin` | Tratar conteudo como same-origin |
| `allow-top-navigation` | Navegar a janela pai |
| `allow-modals` | Abrir modais (alert, confirm, prompt) |
| `allow-pointer-lock` | Usar Pointer Lock API |
| `allow-orientation-lock` | Travar orientacao da tela |
| `allow-popups-to-escape-sandbox` | Popups abertos nao herdam sandbox |
| `allow-presentation` | Iniciar sessao de apresentacao |
| `allow-downloads` | Permitir downloads |