# Deep Explanation: Mapeamento de Objetos com Mapster

## Por que migrar do AutoMapper para Mapster?

O instrutor explica que o AutoMapper, apesar de ser extremamente popular no mercado .NET, tem "haters" que criticam sua performance. A implementacao do AutoMapper consome mais memoria e mais tempo para fazer transformacoes. Algumas pessoas preferem fazer mapeamento manual (criando instancias e atribuindo propriedades uma a uma).

O instrutor concorda que a critica tem fundamento, mas considera "um pouco exagerado". Ele usava AutoMapper em APIs sem problemas, mas **em aplicativos mobile (.NET MAUI) evitava completamente** — a performance importa mais em dispositivos moveis.

## Benchmarks: Mapster vs AutoMapper

Dados da documentacao oficial do Mapster (versoes antigas, mas ilustrativos):

| Metrica | Mapster | AutoMapper | Diferenca |
|---------|---------|------------|-----------|
| Tempo | 108ms | 420ms | ~4x mais rapido |
| Memoria | 124MB | 350MB | ~2.8x menos memoria |

O instrutor ressalva que esses benchmarks usam versoes antigas e nao detalham o objeto transformado, mas a tendencia de performance e clara.

## A sacada do IMapper compativel

O time do Mapster foi "bem espertinho" (nas palavras do instrutor): eles criaram uma interface `IMapper` com a mesma assinatura do AutoMapper. Isso significa que em projetos grandes, a migracao pode ser feita apenas trocando o `using`:

```csharp
// Antes
using AutoMapper;

// Depois
using Mapster;
```

O `IMapper` e o metodo `Map<T>()` funcionam com a mesma sintaxe. Isso elimina o trabalho de:
- Remover IMapper dos construtores
- Trocar todas as chamadas de Map para Adapt
- Reconfigurar DI

Para projetos menores ou novos, o instrutor recomenda usar `Adapt<T>()` direto, que e ainda mais simples.

## Dois pacotes NuGet separados

- **Mapster** (7.4.0): pacote principal com extension methods (`Adapt<T>()`)
- **Mapster.DependencyInjection** (1.0.1): pacote adicional para `services.AddMapster()` e uso de `IMapper` via DI

Isso e um design intencional — se voce nao precisa de DI, nao precisa instalar o segundo pacote.

## Sobre customizacao de mapeamentos

O instrutor mostra que o Mapster, por padrao, mapeia TODAS as propriedades com mesmo nome — incluindo senha. No AutoMapper, era possivel ignorar propriedades especificas. O Mapster tambem suporta isso, mas a customizacao sera abordada na proxima aula.

O caso concreto: ao registrar usuario, a senha vem na request mas deve ser criptografada antes de salvar na entidade. Entao o mapeamento da propriedade `Password` deve ser ignorado para que o servico de criptografia trate separadamente.

## Performance em contexto

O instrutor faz uma distincao importante sobre onde performance de mapeamento importa:
- **APIs**: AutoMapper era aceitavel, diferenca de performance raramente perceptivel
- **Aplicativos mobile (.NET MAUI)**: performance e critica, evitar bibliotecas pesadas
- **Mapster**: aceitavel em ambos os cenarios por ser mais leve