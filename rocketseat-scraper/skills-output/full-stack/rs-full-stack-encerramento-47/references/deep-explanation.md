# Deep Explanation: Estrategia de Testes Automatizados

## Por que separar testes unitarios de e2e?

O instrutor enfatiza que primeiro se estuda separado para depois integrar. Essa separacao nao e apenas didatica — e uma pratica de engenharia:

1. **Velocidade de feedback:** Unitarios rodam em milissegundos, e2e em segundos. Rodar unitarios primeiro no CI da feedback rapido.
2. **Granularidade do erro:** Unitario falhou = funcao X quebrou. E2E falhou = algo na cadeia completa quebrou (pode ser rota, controller, service, ou banco).
3. **Custo de manutencao:** Unitarios sao baratos de manter. E2E sao mais frageis porque dependem de mais camadas.

## Modelo mental: Piramide de testes

```
        /  E2E  \        ← Poucos, caros, lentos
       /----------\
      / Integracao  \    ← Medio
     /----------------\
    /    Unitarios      \ ← Muitos, baratos, rapidos
```

O instrutor foca em dois extremos da piramide: unitarios (base) e e2e (topo). Isso e intencional — sao os dois tipos mais distintos e que ensinam os conceitos fundamentais.

## Jest como escolha

Jest e o runner padrao do ecossistema Node.js porque:
- Zero config para comecar
- Inclui assertions, mocks, spies, coverage
- Suporta TypeScript via ts-jest ou @swc/jest
- Watch mode para desenvolvimento

## SuperTest como escolha para e2e

SuperTest conecta diretamente no app Express/Fastify sem precisar subir um servidor HTTP real. Isso significa:
- Sem porta ocupada
- Sem race conditions de startup
- Testes determinísticos
- Mais rapido que subir servidor + fazer fetch

## Quando juntar no projeto real

O instrutor antecipa que "depois a gente vai juntar todas essas pecas" — isso significa que em um projeto real:
1. Testes unitarios cobrem services e utils
2. Testes e2e cobrem endpoints da API
3. Ambos rodam no CI antes de merge
4. Coverage report garante cobertura minima

## Edge cases importantes

- **Banco de dados em testes e2e:** Use banco de teste separado ou in-memory (SQLite para testes se usar Prisma)
- **Estado entre testes:** Cada teste deve ser independente — limpe o banco antes/depois
- **Testes flakey:** Se e2e falha intermitentemente, provavelmente ha dependencia de estado entre testes