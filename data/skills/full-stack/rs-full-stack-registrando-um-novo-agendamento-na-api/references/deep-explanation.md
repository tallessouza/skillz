# Deep Explanation: Registrando Agendamento via API

## Por que async no handler de submit?

O instrutor mostra um padrao muito comum no desenvolvimento frontend: voce comeca com `console.log` para validar que os dados do formulario estao corretos, e depois substitui pelo metodo real do servidor.

O ponto critico e que funcoes de servidor (que escrevem em banco, arquivo, ou fazem fetch) sao **assincronas**. Quando voce coloca `await` dentro de uma funcao, essa funcao precisa ser marcada como `async`. O handler de evento de submit nao e async por padrao — voce precisa adicionar explicitamente.

### O que acontece sem async/await?

```javascript
// SEM async/await — a funcao dispara mas nao espera
form.onsubmit = (event) => {
  event.preventDefault()
  scheduleNew(data) // Promise retornada e ignorada!
  alert('Agendamento realizado!') // Executa ANTES do agendamento completar
}
```

O alert aparece imediatamente, sem garantia de que o agendamento foi salvo. Se der erro, voce nunca sabera.

### Com async/await — fluxo correto

```javascript
form.onsubmit = async (event) => {
  event.preventDefault()
  await scheduleNew(data) // Espera completar
  alert('Agendamento realizado com sucesso!') // So executa apos sucesso
}
```

## Por que incluir a extensao do arquivo no import?

No projeto Hair Day (vanilla JS, sem bundler como Webpack/Vite), o navegador ou runtime precisa da extensao explicita para resolver o modulo. Sem ela, voce recebe um erro de modulo nao encontrado.

Bundlers como Webpack resolvem automaticamente, mas em projetos sem bundler (que e o caso desta aula), a extensao e obrigatoria.

## O fluxo completo: console.log → chamada real

O instrutor demonstra um padrao de desenvolvimento iterativo:

1. **Primeiro:** monta o objeto de dados e usa `console.log` para validar visualmente
2. **Segundo:** confirma que os dados estao corretos no console do navegador
3. **Terceiro:** substitui `console.log` pela funcao importada do servidor
4. **Quarto:** adiciona `async/await` para garantir execucao correta
5. **Quinto:** testa e verifica que os dados foram persistidos (no caso, no arquivo `server.json`)

Esse padrao e valioso porque valida os dados ANTES de conectar ao servidor, reduzindo ciclos de debug.

## Organizacao dos imports

O instrutor enfatiza: importe o metodo do servidor **antes** de capturar elementos DOM. Isso segue a convencao de colocar imports no topo do modulo, separando dependencias externas da logica local.