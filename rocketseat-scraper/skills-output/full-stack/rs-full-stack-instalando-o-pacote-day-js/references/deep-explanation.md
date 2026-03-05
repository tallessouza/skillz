# Deep Explanation: Configuracao do Day.js

## Por que uma pasta `libs/`?

O instrutor faz uma distincao importante: ate esse ponto do curso, as bibliotecas instaladas eram de **configuracao da aplicacao** (webpack, babel — tooling de build). Agora, com day.js, estamos adicionando uma **biblioteca de runtime** que sera usada diretamente no codigo da aplicacao.

A pasta `src/libs/` serve como ponto centralizado para configuracoes de bibliotecas externas de runtime. Isso separa:
- **Raiz do projeto**: configs de build (webpack.config.js, babel.config.js)
- **src/libs/**: configs de bibliotecas que rodam na aplicacao

## Por que configurar locale globalmente?

O day.js por padrao usa locale `en` (ingles). Ao configurar `dayjs.locale("pt-br")` uma unica vez no arquivo de config, todo uso subsequente de `dayjs()` em qualquer parte da aplicacao ja retorna datas no formato brasileiro.

Sem essa configuracao centralizada, cada desenvolvedor teria que lembrar de setar o locale em cada arquivo — fonte garantida de inconsistencia.

## Por que importar no main.js?

O `main.js` e o **entry point** da aplicacao — o primeiro arquivo que o bundler (webpack) processa. Ao importar `./libs/dayjs.js` aqui:

1. A configuracao executa antes de qualquer outro modulo
2. O locale fica disponivel globalmente
3. Nao precisa re-importar a config em cada arquivo que usa dayjs

O instrutor chama isso de "centralizar todas as importacoes" no entry point.

## Dependencia de producao vs desenvolvimento

O instrutor explica: day.js aparece em `dependencies` (nao `devDependencies`) porque e usada tanto durante desenvolvimento quanto quando o projeto esta em producao. Diferente do webpack que so roda no build.

## Sobre a extensao `.js` no import

O instrutor enfatiza: "e importante utilizar a extensao". Dependendo da configuracao do webpack/bundler, omitir a extensao pode causar erro de resolucao de modulo. Usar `.js` explicito e mais seguro e previsivel.

## Padrao de verificacao

O instrutor testa a configuracao diretamente no `main.js` com:
```javascript
import dayjs from "dayjs"
console.log(dayjs().format("HH:mm"))
console.log(dayjs().format("DD/MM HH:mm"))
```

Depois de confirmar que funciona, **remove as linhas de teste**. Isso e uma boa pratica: testar a config imediatamente, verificar no console do browser, e limpar o codigo de teste.

## Webpack Dev Server e hot reload

O instrutor destaca que nao precisou reiniciar o projeto porque o webpack dev server detecta mudancas automaticamente. Isso permite um ciclo rapido de: instalar pacote → configurar → testar → ver resultado no browser.