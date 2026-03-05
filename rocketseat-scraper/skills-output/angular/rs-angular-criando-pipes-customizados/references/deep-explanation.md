# Deep Explanation: Criando Pipes Customizados

## Por que pipes e nao metodos no componente?

O instrutor enfatiza que pipes sao mais performaticos que metodos. Quando voce usa um metodo no template (`{{ getStatus(user.status) }}`), o Angular executa esse metodo em CADA ciclo de change detection. Pipes puros so re-executam quando o input muda.

Alem disso, se o projeto tem 10 componentes que precisam converter status, voce nao vai duplicar o metodo em 10 lugares. O pipe e criado uma vez e reutilizado.

## O perigo da referencia de memoria

O ponto mais critico do video: se voce passa um objeto inteiro para o pipe e manipula propriedades dele, voce esta alterando o objeto original por referencia de memoria. Isso causa mutacao silenciosa — o dado muda sem que o componente perceba, gerando bugs dificeis de rastrear.

A solucao e dupla:
1. **Preferivel:** passe apenas o valor primitivo que precisa transformar (`user.status` em vez de `user`)
2. **Se inevitavel:** clone o objeto dentro do pipe antes de manipular (`const clone = { ...obj }`)

## Estrutura de pastas recomendada

O instrutor organiza o projeto em:
```
app/
├── components/    # Componentes da feature
├── pipes/         # Pipes customizados
└── services/      # Services com logica de negocio
```

Essa separacao facilita encontrar onde cada responsabilidade vive.

## AsyncPipe como padrao

O instrutor destaca que a classe do componente ficou "bem limpa" porque:
- Nao houve `subscribe()` manual
- Nao houve `ngOnDestroy` para cleanup
- O AsyncPipe cuida da inscricao e desinscricao automaticamente
- Os dados fluem direto do service para o template

Esse padrao evita memory leaks e reduz boilerplate.

## Tipagem do objeto de lookup

O instrutor mostra que sem tipagem explicita, o TypeScript infere `any` para o objeto de mapeamento. A tipagem correta e:

```typescript
const obj: { [key: number]: string } = { 1: 'Ativo', 0: 'Inativo' };
```

Isso garante que as chaves sao numeros e os valores sao strings, mantendo type safety.

## Convencao de nomenclatura

O instrutor reforça o padrao Angular:
- **Nome do pipe** (decorator): `userStatus` (camelCase)
- **Nome da classe**: `UserStatusPipe` (PascalCase + sufixo Pipe)
- **Uso no template**: `| userStatus`

Manter essa consistencia e fundamental para legibilidade.