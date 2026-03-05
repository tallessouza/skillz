# Deep Explanation: RxResource para Registro de Usuario

## Por que RxResource em vez de subscribe manual?

O instrutor reforça que o padrao RxResource é o mesmo usado no login — consistencia no codebase. O RxResource gerencia automaticamente:

1. **Lifecycle do Observable** — sem memory leaks por subscribe esquecido
2. **Deduplicacao** — se o signal nao mudou de valor, a requisicao nao é refeita
3. **Controle de disparo** — undefined inicial impede chamada automatica no init do componente

## O mecanismo do undefined inicial

Quando o signal começa como `undefined`, o RxResource reconhece que nao ha parametros validos e **nao executa o stream**. Isso resolve o problema de componentes que disparam requisicoes ao inicializar.

Somente quando `registerParams.set(valor)` é chamado com um valor nao-undefined, o RxResource detecta a mudanca e executa o stream.

## Deduplicacao por referencia

O instrutor destaca: "fazendo dessa forma aqui a gente evita aquele problema que nós tivemos no login de chamadas duplicadas caso os valores do meu formulário não tenham mudado."

O RxResource compara o valor anterior do signal com o novo. Se forem iguais (por referencia ou valor), a requisicao nao é disparada novamente. Por isso é importante extrair `this.registerForm.value` para uma constante — cada chamada a `.value` pode gerar um novo objeto, mas o conteudo é o mesmo.

## Fluxo completo de dados

```
Usuario digita nos inputs
  → FormGroup atualiza via field binding
    → Click no botao "Criar"
      → register() extrai form.value
        → registerParams.set(userInfos)
          → RxResource detecta mudanca no signal
            → Executa stream callback
              → Chama _userApi.register(name, email, password)
                → Observable executado, resposta processada
```

## Organizacao de interfaces

O instrutor cria a interface `IRegisterParams` dentro de `models/` na feature de authentication, nao em um arquivo global. Isso segue o principio de colocalizacao — tipagens ficam perto de onde sao usadas.

A interface inclui `confirmPassword` mesmo que o endpoint nao precise dele, porque ela representa os dados do formulario completo, nao o payload da API.

## Padrao consistente com Login

O instrutor enfatiza que esta implementacao é "muito, muito parecida com o que fizemos na parte do login". O padrao é:

1. Inject do service
2. Signal de params com `T | undefined`
3. RxResource com `params` e `stream`
4. Metodo de acao que faz `.set()` no signal

Esse padrao se repete para qualquer chamada API disparada por acao do usuario em Angular moderno.