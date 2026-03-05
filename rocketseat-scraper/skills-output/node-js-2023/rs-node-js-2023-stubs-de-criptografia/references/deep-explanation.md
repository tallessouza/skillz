# Deep Explanation: Stubs de Criptografia

## O que e um Stub

Um stub, no contexto de testes, e uma classe que implementa um contrato (interface ou classe abstrata) com uma implementacao ficticia, feita exclusivamente para testes. E o mesmo conceito dos InMemoryRepositories — repositorios que existem apenas em memoria para substituir o banco de dados real nos testes unitarios.

## Por que nao usar bcrypt real nos testes

O bcrypt e lento por design — ele faz hashing com salt rounds que consomem CPU propositalmente. Em testes unitarios, voce quer velocidade. Alem disso, o objetivo do teste unitario nao e testar se o bcrypt funciona (isso e responsabilidade da lib), mas sim se o SEU codigo chama o contrato corretamente.

## A sacada de implementar multiplos contratos

O instrutor destaca que uma classe pode implementar multiplas interfaces. No caso do `FakeHasher`, ele implementa tanto `HashGenerator` quanto `HashComparer`. Isso e possivel e desejavel porque:

1. Hash e compare sao operacoes complementares sobre o mesmo dominio
2. O stub precisa que a logica de hash e compare sejam consistentes entre si
3. Se `hash('123')` retorna `'123-hashed'`, entao `compare('123', '123-hashed')` deve retornar `true`
4. Ter uma unica classe garante essa consistencia automaticamente

## Por que nao retornar o input inalterado

O instrutor enfatiza: "nao e legal pegar e retornar a senha da mesma maneira que ela vem, porque acaba que dai a gente nao vai testar nada." Se `hash(x) === x`, entao `compare(x, x)` sempre sera true, e o teste nunca vai pegar um bug onde o hash nao foi aplicado.

Alternativas de transformacao ficticia mencionadas:
- Concatenar um sufixo (escolha do instrutor: `-hashed`)
- Adicionar um caractere a mais
- Inverter a ordem dos caracteres

Qualquer transformacao deterministica serve, desde que `hash(x) !== x`.

## FakeEncrypter e JSON.stringify

Para o encrypter (que gera tokens JWT em producao), o stub simplesmente usa `JSON.stringify(payload)`. Isso e elegante porque:
- Transforma objeto em string (cumpre o contrato)
- E deterministico
- Permite que o teste inspecione o conteudo do "token" fazendo `JSON.parse(token)`
- Nao depende de nenhuma lib externa

## Organizacao de arquivos

O instrutor cria os stubs em `test/cryptography/`, espelhando a estrutura `src/cryptography/` da aplicacao. Esse padrao e consistente com os `InMemoryRepositories` que ficam em `test/repositories/`.