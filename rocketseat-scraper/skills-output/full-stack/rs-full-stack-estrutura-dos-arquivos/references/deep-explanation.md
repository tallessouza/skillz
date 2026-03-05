# Deep Explanation: Estrutura de Arquivos JS + HTML

## Por que vincular JS via tag script (e nao inline)?

O instrutor cria dois arquivos separados — `index.html` e `scripts.js` — porque separar estrutura (HTML) de comportamento (JS) e uma pratica fundamental. Manter JS em arquivo proprio permite:

- Reutilizar o mesmo script em multiplas paginas
- Cache do navegador (arquivo JS cacheado separadamente)
- Organizacao clara do projeto
- Facilidade para encontrar e editar codigo

## A propriedade src da tag script

O instrutor explica que `src` indica "onde esta" o conteudo do arquivo JavaScript. Quando o HTML e o JS estao no mesmo nivel (mesma pasta), voce pode:

- Usar `./scripts.js` (caminho relativo explicito)
- Usar `scripts.js` (caminho relativo implicito)

Ambos funcionam identicamente. O instrutor prefere omitir o `./` por simplicidade.

## file:// vs Live Server — a diferenca fundamental

O instrutor mostra duas formas de abrir o HTML:

### Abrir direto (file://)
- URL: `file:///home/usuario/JavaScript/Classroom/index.html`
- Nao tem hot-reload — precisa recarregar manualmente
- Algumas APIs do navegador nao funcionam (CORS, fetch local)
- Adequado apenas para visualizacao rapida

### Live Server
- URL: `http://127.0.0.1:5500/index.html`
- Cria um servidor HTTP local
- Observa mudancas nos arquivos e recarrega automaticamente
- Simula ambiente real de servidor web
- O instrutor enfatiza: "ele cria um servidorzinho" — conceito que sera aprofundado quando o aluno aprender a criar servidores proprios

## Dica do indicador de salvamento

O instrutor destaca um detalhe visual do VSCode: quando um arquivo tem modificacoes nao salvas, aparece uma **bolinha** ao lado do nome do arquivo na aba. Apos salvar (Ctrl+S), a bolinha desaparece. Isso e util para confirmar que o Live Server vai refletir a versao mais recente.

## Estrategia de backup por duplicacao

O instrutor sugere uma forma simples de versionamento para iniciantes:
1. Terminou uma aula → duplica o arquivo JS (Ctrl+C, Ctrl+V)
2. Renomeia com numero da aula e descricao: `aula-4-conectando-html-js.js`
3. Continua trabalhando no `scripts.js` original

Isso evita sobrescrever codigo de aulas anteriores. O instrutor menciona que ferramentas de versionamento (Git) existem mas serao ensinadas em outro momento.

## console.log como ferramenta de verificacao

O instrutor usa `console.log("Hello World")` como primeira acao apos vincular o JS. Isso serve como "teste de conexao" — se a mensagem aparece no Console do DevTools, a vinculacao esta correta. Se nao aparece, ha um problema no path do `src`.