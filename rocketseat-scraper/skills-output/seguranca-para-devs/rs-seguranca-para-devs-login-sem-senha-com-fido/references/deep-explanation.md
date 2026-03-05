# Deep Explanation: Login Sem Senha com FIDO

## Por que dois fetches?

O fluxo FIDO/WebAuthn para login segue o padrao challenge-response, identico ao registro mas com funcoes diferentes:

1. **Fetch 1 — generateAuthenticationOptions**: O servidor gera um challenge aleatorio e envia ao cliente junto com o RPID. O cliente usa a chave privada armazenada no dispositivo para assinar esse challenge.

2. **Fetch 2 — verifyAuthenticationResponse**: O cliente envia a resposta assinada. O servidor usa a public key salva durante o registro para verificar que a assinatura e valida.

## O papel do Challenge

O instrutor deliberadamente usou um challenge diferente do registro ("someOtherChallenge") para enfatizar um ponto critico: **cada operacao deve ter seu proprio challenge**. Em producao:

- Sorteia um challenge criptograficamente aleatorio
- Guarda na sessao do servidor
- Envia ao cliente
- Quando o cliente responde, valida que o challenge na resposta e identico ao da sessao
- Isso previne replay attacks — um atacante nao pode reutilizar uma resposta capturada

## Como identificar a credential correta

O response do `startAuthentication` traz um objeto com:
- `id`: o credential ID em Base64
- `rawId`: o mesmo ID em bytes
- `response`: os dados de autenticacao assinados

O `id` corresponde ao `credentialID` salvo no banco durante o registro. Use-o para buscar a public key correspondente e verificar a assinatura.

## signCount — Deteccao de clonagem

O `signCount` (ou `counter`) e incrementado a cada uso da chave. Se o servidor recebe um counter menor ou igual ao anterior, indica possivel clonagem da chave. O parametro e obrigatorio na funcao de verificacao — passe 0 se nao estiver contando, mas em producao persista esse valor.

## Niveis de seguranca — A analogia do instrutor

O instrutor faz uma distincao pratica muito valiosa:

- **Rede social, blog, app comum**: Login FIDO sem friccao e suficiente. O proprio Facebook nao se preocupa com alguem usando o computador desbloqueado do usuario. Se o usuario esqueceu o computador aberto, o Facebook ja esta logado mesmo.

- **Banco, fintech, governo, usina nuclear**: Exija `userVerification` tanto no registro quanto no login. Isso forca PIN, login do SO, ou biometria. Impede que alguem simplesmente clique e se logue no computador abandonado.

- **Operacoes sensiveis dentro do app**: Mesmo com login simples, peca segundo fator (biometria, FIDO com userVerification) antes de operacoes criticas como transferencias ou alteracao de dados sensiveis.

## Por que NAO pedir 2FA apos login FIDO

O instrutor e enfatico: **nao faca login sem senha e peca 2FA imediatamente**. A logica:

- Login com senha + 2FA faz sentido porque a senha sozinha e fraca
- Login FIDO ja e intrinsecamente seguro (chave criptografica no dispositivo)
- Adicionar 2FA no login anula o beneficio da experiencia sem friccao
- Reserve o segundo fator para o momento de uma operacao perigosa

## Experiencia do usuario

O instrutor destaca a experiencia: "Eu vou dar um clique para iniciar, vou ter uma chave so provavelmente, clico nela, segundo clique e estou logado." Dois cliques para autenticar — sem senha, sem codigo, sem email.

## Seguranca contra ataques

Se alguem hackear o navegador e tentar usar uma chave que nao pertence ao site, a verificacao de assinatura vai falhar. A chave e vinculada ao RPID (dominio), entao uma chave registrada para `site-A.com` nao funciona em `site-B.com`.