# Deep Explanation: Testes de Integracao para Login e Update de Perfil

## Por que testar apenas fluxos completos

O instrutor enfatiza que os testes de integracao devem ser escritos apenas para fluxos que estao completamente implementados. Fluxos parciais (como alterar foto de perfil) sao deixados para depois. Isso evita testes frageis que quebram conforme o fluxo evolui.

## O falso positivo do UseInMemoryDatabase

Em versoes antigas do Entity Framework, o parametro do `UseInMemoryDatabase` precisava ser um valor especifico (geralmente o nome do DbContext). Isso mudou — agora o parametro e simplesmente o `databaseName`, um identificador qualquer. O banco em memoria cria as tabelas baseado nos DbSets definidos no contexto, por isso nao precisa de migrations.

O instrutor admitiu que falou isso por memoria de versoes antigas — um ponto importante sobre como informacoes desatualizadas podem se propagar.

## Internal vs Public em projetos de infraestrutura

A regra e clara: todas as classes no projeto de infraestrutura devem ser `internal`, exceto a classe de extensao de Dependency Injection. A razao:

- **DependencyInjectionExtension** precisa ser `public` porque a API a chama diretamente para registrar servicos no container de DI
- **Todas as outras classes** (DbContext, repositorios, etc.) sao detalhes de implementacao e devem ser `internal`

Quando voce muda para `internal`, os projetos de teste perdem acesso. A solucao e o atributo `[assembly: InternalsVisibleTo("NomeDoProjeto.Tests")]`, que concede acesso seletivo sem quebrar o encapsulamento.

## Padrao de organizacao dos testes

Os testes seguem uma estrutura de pastas que espelha os controllers:
- `Login/` — LoginTests (sucesso + erro)
- `User/Update/` — UpdateUserTest (sucesso + erro) + UpdateUserInvalidTokenTest

## Reutilizacao de validacao entre testes

O instrutor mencionou que fez "ctrl-c ctrl-v" da validacao do JSON entre o teste de registro e o teste de login, porque ambos os endpoints retornam a mesma estrutura (id, nome, tokens). Isso e pragmatico — quando a resposta e identica, reutilizar a validacao e aceitavel.

## Execucao paralela no Test Explorer

O instrutor enfatiza executar TODOS os testes de uma vez pelo Test Explorer (nao individualmente), porque isso revela problemas de concorrencia. Quando testes rodam em paralelo, compartilhamento de estado ou conflitos de banco podem causar falhas que nao aparecem em execucao individual.

No caso demonstrado, 53 testes passaram com sucesso, validando que nao ha conflitos.