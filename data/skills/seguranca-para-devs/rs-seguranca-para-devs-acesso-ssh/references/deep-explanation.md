# Deep Explanation: Acesso SSH Seguro

## Por que chave SSH e nao senha?

O instrutor (Elcio) enfatiza que autenticacao por chave criptografica de 2048 bits e "super mais seguro" que qualquer senha. A razao tecnica: uma chave RSA de 2048 bits tem um espaco de possibilidades astronomicamente maior que qualquer senha que um humano consegue memorizar. Ao desabilitar `PasswordAuthentication`, voce elimina de uma vez:

- **Ataques de forca bruta** — tentar todas as combinacoes
- **Ataques de dicionario** — tentar senhas comuns
- **Senhas fracas** — usuarios que colocam "123456"
- **Senhas reutilizadas** — a mesma senha de outro servico vazado

## A analogia da chave Pix

O Elcio usa uma analogia excelente: a chave publica e como a sua chave Pix. Voce pode dar para qualquer pessoa sem problema — ela serve para as pessoas te identificarem e interagirem com voce. A chave privada e como a senha do banco — voce nunca compartilha com ninguem.

## Por que nao trocar de chave a cada emprego?

Muitos devs geram uma nova chave SSH cada vez que mudam de empresa ou computador. O Elcio desaconselha isso porque:

1. A chave e uma **identidade sua**, nao da empresa
2. Trocar exige atualizar `authorized_keys` em todos os servidores que voce tem acesso
3. Gerenciar multiplas chaves e "bem chato"
4. Voce pode trocar periodicamente se quiser, mas com consciencia do impacto

## Criptografia de disco — por que e obrigatorio para programadores

O cenario que o Elcio descreve: voce sai de casa, e assaltado, alguem leva seu notebook. Sem criptografia de disco, o atacante:

1. Coloca um pendrive com Linux bootavel
2. Monta o disco do notebook
3. Tem acesso a TODOS os seus arquivos: codigo de clientes, chaves SSH, senhas salvas no Chrome

Isso vale tanto para o disco local quanto para o VPS — por isso ele ativa disk encryption na Linode.

## Senha na chave privada — trade-off

O `ssh-keygen` pergunta se voce quer colocar senha na chave privada. O Elcio recomenda que sim, mas reconhece o trade-off: e mais uma senha para digitar. Se voce optar por nao colocar senha, precisa garantir:

- SO seguro (sem malware, sem "joguinho pirata no Windows")
- Disco criptografado
- Nenhuma chance de a chave vazar

## Por que sudoers.d ao inves de editar sudoers diretamente

O Debian/Ubuntu inclui o diretorio `/etc/sudoers.d/` que funciona como extensao do arquivo principal. O Elcio prefere criar um arquivo por usuario porque:

- Facil de encontrar a configuracao de cada pessoa
- Facil de revogar acesso (basta deletar o arquivo)
- Nao arrisca corromper o sudoers principal

## A dica critica: testar antes de desconectar

Ao restartar o sshd apos mudar configuracao, **nunca feche a conexao atual**. Abra uma segunda janela e teste a nova conexao. Se algo deu errado na configuracao, voce ainda tem a janela original para corrigir. Se desconectar e a configuracao estiver errada, voce perde acesso ao servidor permanentemente.

## Senhas geradas vs reutilizadas

O Elcio gera senhas com `openssl rand -hex 32` e nao salva. Por que? Porque a senha do root so foi necessaria para a criacao inicial do servidor — depois, o acesso sera exclusivamente por chave SSH. Reutilizar senhas entre servicos e um risco enorme porque um vazamento em qualquer servico compromete todos os outros.

## Um usuario por pessoa vs usuario compartilhado

O Elcio menciona que na Viz (empresa dele), criam um usuario Linux por pessoa. Alguns lugares usam um usuario "admin" compartilhado com chaves de varias pessoas. Ele nao gosta dessa abordagem porque:

- Dificulta saber QUEM fez o que nos logs
- Revogar acesso de uma pessoa exige editar o `authorized_keys` compartilhado
- Com usuarios separados, basta deletar o usuario e seu arquivo em sudoers.d