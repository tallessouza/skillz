# Deep Explanation: Instalando Git no Windows

## Por que Git Bash e nao CMD ou PowerShell?

O instrutor (Mike Brito) enfatiza que o Git Bash e o terminal recomendado no Windows para qualquer operacao de terminal. A razao e pratica: o Git Bash ja vem com o git integrado no PATH automaticamente. No CMD ou PowerShell, voce precisaria configurar o PATH manualmente ou instalar de outras formas.

Alem disso, o Git Bash emula um ambiente Unix-like, o que significa que comandos como `ls`, `cat`, `grep` funcionam nativamente — algo que facilita seguir tutoriais que geralmente sao escritos para Linux/Mac.

## Por que o e-mail deve ser o mesmo do GitHub?

O instrutor explica com clareza: "esse git na sua maquina, em algum momento ele vai se conectar com o GitHub que esta em algum lugar do mundo. E ai, para fazer essa conexao perfeita entre as coisas que estao na sua maquina e o que tem la, ele vai observar esse seu e-mail global que voce configurou aqui."

Na pratica, o GitHub usa o e-mail do commit para associar ao perfil. Se o e-mail for diferente, os commits aparecem como de um usuario desconhecido no GitHub, sem link para o perfil.

## Por que nao configurar nada na instalacao?

O instrutor e enfatico: "tudo que vai estar tanto na documentacao ai, ou que eu vou mostrar aqui pra voce, e literalmente voce clicar em next, voce nao precisa ler nada." Isso porque os defaults do instalador do Git SCM sao adequados para a maioria dos usuarios. Nenhuma opcao padrao vai impactar negativamente o uso normal.

Isso reduz a barreira de entrada — um iniciante nao precisa entender o que cada opcao faz para ter um ambiente funcional.

## 32-bit vs 64-bit

O instrutor mostra como verificar via System Information. Ele comenta que "eu acho bem dificil nos dias de hoje ter 32-bit, mas pode ser que tenha." Na pratica, praticamente todos os computadores modernos (pos-2010) sao 64-bit.

## Contexto da maquina virtual

O instrutor usa uma maquina virtual (ARM64 emulando Windows), mas deixa claro que o processo e identico em um Windows nativo. A unica diferenca e que o System Information pode mostrar "ARM64" em vez de "x64".