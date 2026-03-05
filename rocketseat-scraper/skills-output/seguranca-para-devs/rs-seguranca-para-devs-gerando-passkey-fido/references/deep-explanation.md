# Deep Explanation: Registro de Passkeys FIDO (WebAuthn)

## Por que passkeys sao o futuro (e o presente)

O padrao WebAuthn foi aprovado pelo W3C e pela FIDO Alliance em 2018. Ja tem anos e deveria estar em uso generalizado. O que falta e os desenvolvedores aprenderem e implementarem. Para o usuario, e o melhor metodo de autenticacao: pratico E seguro ao mesmo tempo.

## A API WebAuthn por baixo

A Web Authentication API (apelido: WebAuthn) tem basicamente dois metodos:
- **Criar credenciais** (registro)
- **Obter credenciais** (login)

Porem, os metodos crus exigem criar varios objetos e interfaces. O codigo fica extenso e complexo. Por isso a comunidade criou bibliotecas que encapsulam essa complexidade.

## O repositorio awesome-webauthn

O repositorio `awesome-webauthn` e a referencia central. Contem:
- Demos para ver funcionando
- Bibliotecas de servidor: Python, PHP, Go (muitas!), Java, Elixir, Ruby, Rust, Node.js
- Bibliotecas de client (JavaScript)
- Software de autenticacao, ferramentas para dev, especificacoes, tutoriais

Qualquer linguagem ou framework que voce use, provavelmente ja tem biblioteca pronta.

## O fluxo de registro em detalhe

### Fetch 1: Buscar challenge

O navegador faz um GET ao servidor pedindo "opcoes de registro". O servidor:
1. Gera um challenge (numero aleatorio criptografico)
2. Salva o challenge na sessao do usuario
3. Retorna um objeto JSON com challenge (em base64), algoritmos criptograficos, e metadados

### Geracao da chave (no cliente)

Com as opcoes recebidas, a biblioteca `startRegistration()` aciona o dialog nativo do browser. O usuario escolhe onde salvar a chave:
- Gerenciador de senhas local (ex: Google Password Manager)
- Celular via QR Code
- Chave de hardware (YubiKey etc.)

Sao 2-3 cliques para o usuario. A chave criptografica e gerada automaticamente.

### Fetch 2: Enviar chave para validacao

O navegador envia a chave gerada ao servidor. O servidor:
1. Decriptografa o challenge com a chave recebida
2. Verifica que o challenge e o mesmo que enviou (protecao contra man-in-the-middle)
3. Se valido, salva a chave publica no banco associada ao usuario

## Por que RPID nao pode ser IP

A especificacao WebAuthn exige que o Relying Party ID seja um dominio valido. IPs nao sao aceitos. Em desenvolvimento, use `localhost` (que e um dominio). Nunca abra a aplicacao como `127.0.0.1`.

## Contexto de uso do registro

O registro de passkey acontece em dois cenarios:
1. **Novo cadastro**: apos validar email do usuario, gerar passkey como parte do onboarding
2. **Usuario ja logado**: dentro do perfil/painel, como opcao de seguranca adicional

Voce nunca mostra "cadastrar chave" e "login" lado a lado na tela inicial. O registro pressupoe que voce ja sabe quem e o usuario.

## Experiencia do usuario (UX)

O instrutor enfatiza: sao 3 cliques totais para registrar uma passkey:
1. Clique no botao "cadastrar chave"
2. Escolher onde salvar (dialog nativo do browser)
3. Confirmar criacao

Comparado com criar e memorizar senhas, e incomparavelmente mais simples e seguro.