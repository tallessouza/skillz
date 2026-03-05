# Deep Explanation: Caso de Uso — Escolher Melhor Resposta

## Por que não pedir questionId como input?

O instrutor enfatiza: "eu não preciso do questionId porque toda answer já está associada automaticamente com uma única question, então é muito fácil buscar os dados da pergunta baseado no answerId."

Isso é um princípio de design importante: **não aceite inputs redundantes que podem ser derivados**. Se o caller passa `questionId` e `answerId`, e o `answerId` já contém um `questionId` diferente, você tem uma inconsistência. Ao derivar, você elimina essa classe inteira de bugs.

## Multi-repositório em um use case

O instrutor deixa claro que "esse caso de uso precisa ter acesso tanto ao questionsRepository quanto ao answersRepository" e que "não é nenhum problema." 

No DDD, use cases orquestram. Eles não são 1:1 com repositórios. Um use case pode precisar de N repositórios para completar uma operação de negócio. A restrição real é que cada repositório deve corresponder a um aggregate root.

## Ordem de validação: existência → autorização

O código primeiro busca a answer, depois busca a question, e só então verifica o authorId. Essa ordem importa:
1. Se answer não existe → "Answer not found" (404)
2. Se question não existe → "Question not found" (404)  
3. Se author não bate → "Not allowed" (403)

Inverter essa ordem seria impossível (você precisa da question para saber o authorId), mas o princípio geral é: valide existência antes de autorização.

## Desenvolvimento de dentro para fora (Inside-Out)

O instrutor destaca um ponto filosófico importante sobre Clean Architecture: "a gente desenvolve a nossa aplicação de dentro para fora." 

Nenhuma rota HTTP foi criada. Nenhuma conexão com banco. Apenas domínio + testes. Isso dá "segurança de que está indo pelo caminho certo, porque já está conseguindo criar testes automatizados desde o momento zero."

As camadas externas (HTTP, banco, cache, filas) são detalhes de implementação que virão depois. O domínio é o coração — e ele funciona sozinho, testável sem infraestrutura.

## toString() vs toValue()

O instrutor menciona que prefere usar `toString()` ao converter IDs para comparação: "sempre prefiro usar o toString." Isso sugere uma convenção do projeto onde `toString()` é o método padrão para serializar Value Objects de ID.