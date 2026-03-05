# Deep Explanation: Conectando JavaScript ao HTML

## Por que antes do `</body>`?

O navegador lê o HTML de cima para baixo (parsing sequencial). Quando encontra uma tag `<script>`, ele **pausa** o parsing do HTML para baixar e executar o JavaScript. Se o script estiver no `<head>`, o DOM ainda não existe — qualquer tentativa de acessar elementos da página vai falhar silenciosamente (`null`).

Colocando antes do `</body>`:
- O DOM completo já foi construído
- Elementos estão acessíveis via `document.querySelector` etc.
- A página renderiza visualmente antes do script carregar (melhor percepção de velocidade)

## Atributo `src` vs inline

Quando usamos `src`, o navegador busca o arquivo externo. Isso permite:
- **Cache do navegador** — o `.js` é baixado uma vez e reutilizado em outras páginas
- **Separação de responsabilidades** — HTML é estrutura, JS é comportamento
- **Manutenção** — um arquivo por responsabilidade é mais fácil de encontrar e editar

Regra importante: se uma tag `<script>` tem `src`, qualquer conteúdo entre as tags de abertura e fechamento é **ignorado** pelo navegador. Nunca misture os dois.

## O padrão de verificação do instrutor

O instrutor ensina um padrão simples mas disciplinado:
1. Conectar o arquivo
2. Adicionar `console.log("javascript connected")` como teste
3. Abrir DevTools → Console → confirmar
4. **Remover o console.log** imediatamente

Esse padrão evita dois problemas comuns de iniciantes:
- Ficar debugando código quando o problema era o arquivo não estar conectado
- Esquecer console.logs de teste no código de produção

## Caminho relativo

O `src="./script.js"` usa caminho relativo ao arquivo HTML. Se o HTML está na raiz e o JS também, `./script.js` ou simplesmente `script.js` funciona. Para subpastas:

```
src="./js/script.js"    ← script dentro de pasta js/
src="../script.js"       ← script um nível acima
```