# Deep Explanation: SOLID na Pratica

## O insight central do Diego

O ponto mais importante da aula e que **SOLID nao sao 5 principios separados — sao 5 facetas do mesmo principio**. Uma unica linha de codigo pode justificar 3 principios simultaneamente. Tentar aplicar cada um isoladamente perde o sentido.

## Por que classes no exemplo?

Diego esclarece: nao importa se voce usa classes ou funcoes. Ele usa classes porque:
- A maioria dos exemplos de SOLID e Clean Architecture vem de Java
- Esses conceitos nasceram em linguagens orientadas a objeto
- Mesmo em linguagens que nao exigem OOP, os exemplos classicos usam classes

O principio e o mesmo independente da construcao sintatica.

## Como os principios se conectam

### SRP → cria a separacao inicial
`CalculateOrderDiscount` so calcula desconto. `SubmitOrderInvoice` so emite nota. Um caso de uso de ordem (`CreateOrder`) orquestra ambos.

### OCP → motiva a extracao para interfaces
Sem OCP, cada novo meio de pagamento exige um novo `if` dentro da classe. Pior: parametros como `installments` so fazem sentido para credito, mas poluem a assinatura de todos.

### LSP → garante que a interface funciona
Qualquer implementacao de `PaymentMethod` (Billet, Credit, Debit, Pix) pode ser passada no lugar da outra sem que `CalculateOrderDiscount` quebre.

### DIP → faz o desacoplamento real
A classe `CalculateOrderDiscount` **nao importa** nenhuma implementacao concreta. Se estivesse em outro arquivo, nao precisaria importar Debit, Credit, Billet. Quem chama e que injeta a dependencia. Por isso "inversao" — a direcao da dependencia inverteu.

### ISP → resolve interfaces gordas
Se `PaymentMethod` tivesse `cardNumber`, `cvv`, `expiration`, o Boleto e o Pix teriam que implementar campos que nao fazem sentido. Segregar em `Card` + `PaymentMethod` resolve.

## O que SOLID NAO e

Diego enfatiza: SOLID nao define:
- Estrutura de pastas
- Arquitetura de software
- Como conectar com banco de dados
- Organizacao de modulos

SOLID e sobre **como o codigo funciona na sua versao mais pura**. Arquitetura de software e um assunto a parte.

## A armadilha do parametro desnecessario

Exemplo concreto: quando `CalculateOrderDiscount` recebe `installments` como parametro, o Boleto recebe essa informacao mesmo sem precisar dela. Isso e um sinal claro de que:
1. A responsabilidade esta misturada (SRP violado)
2. A classe nao esta fechada para modificacao (OCP violado)
3. A interface esta gorda demais (ISP violado)

A solucao (extrair para classes com interface) resolve os 3 simultaneamente.

## Injecao no construtor vs no metodo

Diego mostra duas abordagens:
1. Receber `paymentMethod` no `execute()` — funciona, mas repete a injecao a cada chamada
2. Receber no `constructor()` e armazenar em `this.paymentMethod` — melhor quando o metodo sera chamado multiplas vezes

A segunda abordagem e preferida em casos de uso reais.