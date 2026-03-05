# Deep Explanation: Clickjacking (Click Jacking)

## O que e Clickjacking

Clickjacking e uma tecnica onde o atacante cria uma pagina propria e inclui a pagina-alvo dentro de um iframe. Sobre esse iframe, o atacante posiciona elementos de UI (botoes, jogos, formularios) que induzem o usuario a clicar em areas especificas do iframe escondido.

## Como o ataque funciona — passo a passo

1. **O atacante cria uma pagina HTML** com um iframe apontando para a aplicacao-alvo (ex: pagina de transferencia bancaria)
2. **Posiciona o iframe com CSS** — `position: absolute`, ajustando `top` e `left` para alinhar os elementos clicaveis
3. **Cria elementos de cobertura** — botoes, jogos, formularios que ficam SOBRE o iframe com `z-index` maior
4. **Aplica `pointer-events: none`** nos elementos de cobertura — isso faz com que cliques "atravessem" o elemento visivel e atinjam o iframe por tras
5. **O usuario pensa que esta interagindo** com o site do atacante, mas na verdade esta clicando em botoes da aplicacao real dentro do iframe

### Por que JavaScript nao resolve para o atacante (nem para o defensor)

O navegador bloqueia scripts entre dominios diferentes (Same-Origin Policy). O atacante NAO consegue manipular o DOM do iframe via JavaScript. Por isso ele usa a tecnica de sobreposicao visual com CSS. Isso tambem significa que defesas client-side em JS sao frageis.

## Analogia do instrutor

O instrutor compara a tecnica a construir um joguinho em JavaScript por cima da interface real. As "areas de clique" do jogo correspondem exatamente aos botoes que o atacante quer que a vitima clique na aplicacao real. Para ataques multi-step (trocar senha requer: clicar campo → digitar → clicar checkbox → confirmar), cada fase do jogo induz o clique correto.

## Cenarios de uso malicioso mencionados

- **Transferencias financeiras** — induzir usuario a transferir dinheiro
- **Troca de senha** — fazer usuario trocar a senha para uma que o atacante conhece
- **Curtidas/likes em redes sociais** — joguinho que faz usuario curtir posts do atacante
- **Qualquer acao que requer autenticacao** — o usuario ja esta logado no iframe

## Content-Security-Policy: frame-ancestors

### Valores possiveis

| Valor | Significado |
|-------|-------------|
| `'none'` | Pagina NAO pode ser incluida em nenhum iframe/frame |
| `'self'` | Pode ser incluida apenas por paginas do mesmo dominio |
| `https://dominio.com` | Pode ser incluida por aquele dominio especifico |
| Lista de origens | Combinacao de self + dominios especificos |

### Estrategia recomendada pelo instrutor

**Modelo whitelist (preferido):**
1. Padrao: `frame-ancestors 'none'` para TODAS as paginas
2. Excecao: `frame-ancestors 'self'` apenas para paginas que PRECISAM ser embutidas em iframes

**Modelo blacklist (aceitavel mas inferior):**
1. Padrao: `frame-ancestors 'self'` para todas as paginas
2. Excecao: `frame-ancestors 'none'` para paginas sensiveis

O instrutor recomenda fortemente o modelo whitelist, especialmente para fintechs, bancos e sites governamentais. A logica: "Voce nao consegue imaginar que um banco vai permitir que o internet banking seja incluido dentro de um iframe."

## Principio de seguranca

"Para aprender a se defender de ataques hacker, para aprender a escrever codigo seguro, voce precisa entender os ataques e entender a mente do agressor." — O instrutor enfatiza que demonstrar o ataque e necessario para entender a defesa.