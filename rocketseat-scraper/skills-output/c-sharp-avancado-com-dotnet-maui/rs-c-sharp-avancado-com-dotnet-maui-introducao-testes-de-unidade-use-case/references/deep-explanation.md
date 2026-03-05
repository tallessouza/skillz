# Deep Explanation: Testes de Unidade para Use Cases com Mocks

## Por que mocar e nao usar implementacoes reais?

O instrutor Allison explica com clareza: "A gente nao esta interessado no que esta externo ao nosso use case. Nos queremos testar a regra de negocio." O use case recebe dependencias via injecao de dependencia (construtor). Quando a API executa, essas dependencias vem do container de DI. No teste, precisamos fornecer algo — mas nao a implementacao real.

A analogia central: o use case **transfere responsabilidade** para suas dependencias. Quando ele chama `repository.Add(user)`, ele confia que o repositorio fez o trabalho e segue para a proxima linha. O mock faz exatamente isso — finge que fez e diz "beleza, continua ai". O use case nao se importa se o dado foi para MySQL, SQL Server ou lugar nenhum.

## Por que NAO passar null nos parametros?

O instrutor levanta a questao diretamente: "Nulo? Obvio que nao. Se eu passo um repositorio como nulo, quando o use case for utilizar a funcao Add de uma coisa nula, vai estourar uma NullReferenceException." Cada parametro do construtor sera usado em algum momento da execucao, entao cada um precisa de um mock funcional.

## Por que interfaces e nao classes?

Ponto enfatico do instrutor: "Da pra fazer mock de classe? Poder voce ate pode, so que eu nao recomendo, porque vai precisar de uma sintaxe especifica na implementacao das classes e ai voce vai ter uma classe com modificadores de acesso por causa de um teste de unidade. Isso nao faz sentido."

O problema tecnico: Moq precisa que metodos sejam `virtual` para criar mocks de classes concretas. Adicionar `virtual` a metodos que nao precisam ser virtuais polui o codigo de producao por uma necessidade exclusiva de teste.

## O caso do PasswordEncrypter (internal vs public)

Exemplo didatico importante: `BcryptNet` implementa `IPasswordEncrypter`. A classe e simples, nao acessa banco, nao tem parametros no construtor. Seria tentador fazer `new BcryptNet()` direto no teste. Porem, `BcryptNet` e `internal` — so acessivel dentro do projeto Infrastructure. O projeto de testes nao tem acesso.

Solucao: mocar a interface `IPasswordEncrypter` (que e publica, definida em Domain). "Eu nao vou colocar public simplesmente para o meu teste de unidade. Nao faz sentido. Vamos manter internal."

## Dois tipos de mock por tipo de retorno

O instrutor divide claramente:
1. **Funcoes que NAO retornam valor** (void/Task): mock simples, `new Mock<T>().Object` basta
2. **Funcoes que RETORNAM valor**: precisam de `.Setup()` para configurar o que o mock deve devolver — coberto na aula seguinte

Exemplos da aula:
- `IUserWriteOnlyRepository` — funcao `Add` nao retorna nada → mock simples
- `IUnitOfWork` — funcao `Commit` nao retorna nada → mock simples
- `IUserReadOnlyRepository` — tres funcoes, todas retornam valores → mock com setup (proxima aula)

## Cobertura de cenarios

O instrutor lista os cenarios que o teste deve cobrir para o RegisterUserUseCase:
1. **Sucesso**: request com dados validos → nenhuma excecao, response com propriedades corretas
2. **Email duplicado**: repositorio indica que email ja existe → excecao com mensagem especifica
3. **Validacao falha**: propriedade invalida na request → excecao de validacao com mensagem correta
4. **Cada branch condicional**: cada `if` no use case deve ter pelo menos um teste dedicado

## Organizacao dos builders

Builders ficam em `CommonTestUtilities` porque:
- Sao reutilizaveis entre testes de diferentes use cases
- Centralizam a logica de criacao de mocks
- Seguem o mesmo padrao dos request builders ja criados para validators
- Convenção de nomenclatura: `{InterfaceName}Builder` (sem o prefixo `I`)