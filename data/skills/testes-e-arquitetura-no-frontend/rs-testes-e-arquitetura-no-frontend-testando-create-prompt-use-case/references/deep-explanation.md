# Deep Explanation: Testando Use Cases com Inversão de Dependências

## Teste unitário vs teste de integração neste contexto

O instrutor levanta uma distinção importante: testar um use case pode ser considerado teste de integração, não unitário, porque o use case orquestra entidades e repositórios. A menor unidade seria um componente simples (como um Logo). O use case, mesmo usando apenas a interface do repository, está integrando múltiplas unidades.

Em um backend, isso ficaria mais claro: o use case orquestraria regras de negócio via entidades (classes com lógica). No frontend, como as regras ficam mais leves, a distinção é mais sutil, mas o princípio se mantém.

## Por que a inversão de dependências simplifica tudo

Como o `PromptRepository` é apenas uma interface (não uma classe concreta), não é necessário usar libs de mock como `jest.mock()` ou `sinon`. Basta criar um objeto que satisfaça a interface. O cast `as PromptRepository` permite implementar apenas os métodos necessários para cada teste.

Isso é resultado direto do trabalho de arquitetura feito antes: a inversão de dependências paga dividendos na testabilidade.

## O padrão factory com overrides

O `makeRepository` segue um padrão comum em testes:

1. Define um `base` com todos os métodos mockados com valores default seguros
2. Aceita `overrides` como `Partial<T>` para customizar por cenário
3. Spread do overrides sobre o base: `{ ...base, ...overrides }`

Isso evita repetição e torna cada teste declarativo: "neste cenário, o `findByTitle` retorna X".

## Validação de falsos positivos

O instrutor demonstra uma técnica importante: depois de ver o teste passar, ele remove a lógica (lança um erro manual) para confirmar que o teste realmente falha. Se o teste continuar passando mesmo com lógica errada, é um falso positivo.

Também demonstra com a mensagem de erro: muda a string esperada e confirma que o Jest detecta a diferença (funciona como um "includes").

## Coverage não é confiança

O instrutor mostra que o componente Logo aparece com 100% de coverage sem ter nenhum teste próprio. Isso acontece porque a Sidebar (que tem teste) importa e renderiza o Logo, então o Jest conta como "executado". Mas nenhuma asserção verifica o comportamento do Logo.

Lição: coverage mede execução de linhas, não intenção de teste. Um componente pode ter 100% coverage e zero confiança.