# Deep Explanation: Script de Teste com Jest

## Por que criar um script no package.json?

O instrutor destaca um problema pratico: em projetos reais, voce tera multiplos arquivos de teste. Testar um por um com `npx jest src/arquivo.test.ts` nao escala.

A progressao ensinada e:

1. **Arquivo unico**: `npx jest src/sum.test.ts` — bom para desenvolvimento ativo
2. **Todos os arquivos**: `npx jest` — Jest descobre automaticamente
3. **Via script npm**: `npm test` — padrao da industria, mais limpo

## npx vs jest direto no script

Quando voce roda `npx jest`, o npx resolve o binario do jest no `node_modules/.bin/`. Dentro do `package.json`, os scripts ja tem acesso automatico a esse diretorio, entao basta escrever `jest` diretamente.

O instrutor enfatiza: "posso utilizar apenas o jest, porque ele esta instalado ja no nosso projeto".

## npm test vs npm run test

`npm test` e um dos poucos aliases especiais do npm (junto com `npm start`, `npm stop`, `npm restart`). Ambos funcionam identicamente:

```bash
npm test        # alias especial — nao precisa de "run"
npm run test    # forma explicita — funciona igual
```

O instrutor mostra ambos e confirma: "da no mesmo".

## Como Jest encontra arquivos de teste

Por padrao, Jest procura por:
- Arquivos dentro de pastas `__tests__/`
- Arquivos com sufixo `.test.js`, `.test.ts`, `.spec.js`, `.spec.ts`

No exemplo da aula, o instrutor tinha dois arquivos:
- `sum.test.ts` — teste de soma
- `subtraction.test.ts` — teste de subtracao

Ao rodar `npx jest` sem argumentos, Jest encontrou e executou ambos automaticamente.

## Titulos dos testes na saida

O instrutor destaca que o titulo definido no `describe` ou `it` aparece na saida do terminal. Isso e importante para identificar rapidamente qual teste passou ou falhou quando voce tem multiplos arquivos.

## Fluxo pratico demonstrado na aula

1. Criou `sum.test.ts` com mensagem "teste sum ok"
2. Duplicou e renomeou para `subtraction.test.ts` com mensagem "teste subtraction ok"
3. Testou cada um individualmente com `npx jest src/<arquivo>`
4. Testou ambos com `npx jest` (sem argumentos)
5. Criou script `"test": "jest"` no package.json
6. Executou com `npm test` — ambos testes rodaram