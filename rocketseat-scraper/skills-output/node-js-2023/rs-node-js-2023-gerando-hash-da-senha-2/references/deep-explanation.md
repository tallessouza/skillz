# Deep Explanation: Gerando Hash da Senha

## Por que nunca salvar em plaintext

Salvar senhas em texto simples e uma das vulnerabilidades mais basicas e criticas. Se o banco de dados for comprometido, todas as senhas dos usuarios ficam expostas. O hash e uma funcao unidirecional — nao e possivel reverter o hash para obter a senha original.

## Como o bcryptjs funciona

### Salt Rounds (Custo Computacional)

O segundo parametro do `hash()` pode ser:
- **Um numero** (mais comum): representa o numero de "rounds" ou iteracoes do algoritmo
- **Uma string**: usada diretamente como salt

Quando voce passa um numero (ex: 8), o bcryptjs:
1. Gera um salt aleatorio
2. Aplica o algoritmo de hash na senha + salt
3. Repete o processo 2^N vezes (onde N e o numero de rounds)
4. Retorna uma string que contem o salt embutido + o hash

### O impacto dos rounds

O instrutor mostrou um artigo do Stack Exchange que demonstra a relacao entre rounds e performance:

| Rounds | Iteracoes | Impacto |
|--------|-----------|---------|
| 8 (padrao) | 256 | Rapido, seguro para maioria dos casos |
| 10 | 1024 | 4x mais lento que 8 |
| 12 | 4096 | 16x mais lento que 8 |
| 14 | 16384 | Muito lento, uso de CPU alto |

Cada round adicional **dobra** o tempo de computacao. O numero 8 e o padrao do bcryptjs porque oferece um bom equilibrio entre seguranca e performance.

A analogia do instrutor: e como se fizesse "o hash do hash do hash do hash" — cada round aplica o algoritmo novamente sobre o resultado anterior, tornando a senha progressivamente mais forte contra ataques de forca bruta.

### Por que 8 e suficiente

O proposito dos rounds e tornar ataques de forca bruta impraticaveis. Com 8 rounds (256 iteracoes), um atacante precisaria de tempo significativo para testar cada combinacao possivel. Para a maioria das aplicacoes web, isso e mais que suficiente.

## bcryptjs vs bcrypt

- **bcrypt**: Implementacao nativa em C++, requer compilacao (node-gyp), pode dar problemas em diferentes plataformas
- **bcryptjs**: Implementacao pura em JavaScript, sem dependencias nativas, funciona em qualquer ambiente Node.js

O instrutor recomenda bcryptjs como o modulo "mais comum e recomendado" no ecossistema JavaScript.

## Tipagem TypeScript

O instrutor mencionou que originalmente era necessario instalar `@types/bcryptjs` separadamente. Porem, com atualizacoes do pacote, o bcryptjs agora inclui tipagens TypeScript integradas, eliminando essa necessidade.

Instalacao atual:
```bash
npm install bcryptjs
```

Antes era necessario:
```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

## A funcao hash() retorna uma Promise

O `hash()` e assincrono porque o processo de hashing e computacionalmente intensivo. Tornar a operacao async evita bloquear a event loop do Node.js, permitindo que outras requisicoes continuem sendo processadas enquanto o hash e calculado.