# Deep Explanation: Input Validation

## A analogia do bug vs exploit

O instrutor enfatiza um insight crucial: **a diferenca entre bug e falha de seguranca e apenas a intencao de quem encontra**. Um bug de arredondamento em transferencias financeiras e "so um bug" ate que alguem mal-intencionado descubra e comece a explorar sistematicamente. A frase dele: "se a pessoa que descobriu o bug e alguem mal-intencionado que sabe o que ta fazendo, o bug vira falha de seguranca."

Isso muda a priorizacao: bugs de validacao nao sao P3/P4. Sao potenciais vulnerabilidades.

## O ataque do arredondamento (caso pratico)

O exemplo construido na aula demonstra um ataque classico de "salami slicing":

1. Alice tem 100 creditos, Bob tem 1, Laranja tem 0
2. A funcao `transfer` usa `Math.round()` para "garantir inteiros"
3. Ao transferir 0.5 de Alice para Bob:
   - `100 - Math.round(0.5)` = 100 (Alice nao perde nada porque `Math.round` arredonda 0.5 para 0 na subtracao)
   - `1 + Math.round(0.5)` = 2 (Bob ganha 1)
4. Bob transfere 1 credito para Laranja
5. Repete 100 vezes: Alice=100, Bob=1, Laranja=100
6. **100 creditos surgiram do nada**

A raiz do problema: em vez de REJEITAR a entrada invalida, o codigo tentou CORRIGI-LA silenciosamente.

## O vetor CSV/Excel injection

O segundo exemplo mostra um ataque menos obvio. Campos de texto que serao exportados para CSV podem conter formulas de planilha:

- `=WEBSERVICE("https://ifconfig.me")` — executa requisicao HTTP da maquina do usuario
- O LibreOffice/Excel mostra alerta de seguranca, MAS:
  - Alertas podem estar desabilitados
  - Usuarios confiam no "sistema da empresa" e clicam "permitir"
  - Funcoes podem executar scripts, nao apenas requisicoes web

O instrutor destaca: "voce nao sabe aonde isso vai parar depois, la na ponta." O desenvolvedor pensa nas regras de negocio, mas o atacante e criativo e tem tempo para experimentar.

## Principio do "atacante criativo"

Frase-chave do instrutor: "o agressor, o invasor, ele e criativo, ele tem todo o tempo do mundo para ficar ali experimentando." Isso significa que:

- Voce nao pode prever todos os vetores de ataque
- Mas pode reduzir a superficie de ataque validando inputs rigorosamente
- A validacao defensiva e mais barata que resposta a incidentes

## Solucao recomendada: tipagem forcada

O instrutor recomenda frameworks que forcam tipos nas entradas:
- **FastAPI** (Python): entradas ja nascem validadas pelo schema Pydantic
- **TypeScript**: tipagem estatica previne categorias inteiras de erros
- A validacao por schema e superior a validacao manual porque e declarativa, testavel e dificil de esquecer

## A mentalidade correta: paranoia

A palavra "paranoia" e usada deliberadamente pelo instrutor. Nao e exagero — e a postura correta:
- Valide TUDO que vem do usuario
- Valide o TIPO (inteiro? string? dentro do range?)
- Nao tente corrigir, REJEITE
- Pense: "esse campo vai parar onde depois?"