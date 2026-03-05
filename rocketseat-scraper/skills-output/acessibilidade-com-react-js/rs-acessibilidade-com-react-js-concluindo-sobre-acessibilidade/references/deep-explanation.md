# Deep Explanation: Acessibilidade Alem das Ferramentas

## Por que testes automatizados nao bastam

O instrutor Joseph Oliveira faz um ponto crucial: ferramentas como Axe nao conseguem **usar** a aplicacao como um humano. Elas verificam markup, atributos ARIA, contraste — mas nao conseguem perceber que um modal funciona perfeitamente com mouse e e completamente inacessivel via teclado.

A analogia central e: "O que aconteceria se eu quebrasse meu mouse? Meus oculos? Se estivesse usando um leitor de tela?" Essas perguntas forcam o desenvolvedor a sair da perspectiva de usuario padrao e experimentar a aplicacao de formas diferentes.

Joseph menciona que voce vai "dormir nessas ideias e acordar no outro dia pensando: nossa, e por isso que isso acontece!" — o conhecimento de acessibilidade muda como voce percebe interfaces permanentemente.

## A hierarquia: Regras > Ferramentas

O ponto mais enfatizado da aula: **as regras sao o que importa, ferramentas sao secundarias**. A WAI (Web Accessibility Initiative) da W3C tem guidelines que Joseph descreve como "conteudos infinitos" — voce nao precisa decorar todas, mas precisa **conhecer** que existem.

A razao: em momentos-chave do desenvolvimento, voce vai lembrar "existe uma regra de acessibilidade para essa funcionalidade" e saber onde procurar. E independente de como voce implementa (qual ferramenta, qual lib), se seguiu a regra, o resultado e acessivel.

Em alguns paises, as guidelines da WAI sao **obrigatorias** para sites governamentais.

## Skip to Content — o padrao que todo site deveria ter

Joseph demonstra ao vivo no site da WAI: o primeiro elemento focavel da pagina e um botao "Skip to Content" que usa `href="#main"` para pular toda a navegacao. Para usuarios de tecnologias assistivas, isso significa nao precisar percorrer 20+ links de navegacao toda vez que mudam de pagina.

O mecanismo e simples: um link ancora para o `<main id="main">`. Alem de scrollar a pagina, leitores de tela movem o foco para o conteudo principal.

## Layout consistente — acessibilidade por previsibilidade

Quando o header e identico entre paginas, usuarios de tecnologias assistivas **memorizam** a estrutura. Eles sabem que o conteudo repetido pode ser pulado (especialmente com Skip to Content) porque ja viram em outra pagina.

Joseph enfatiza: "nem todos os sites vao ter layout consistente", mas a consistencia e um multiplicador de acessibilidade que muitos desenvolvedores ignoram.

## Descricao de imagens como disciplina separada

Joseph menciona que alt text muitas vezes nao e responsabilidade do desenvolvedor — pode ser um trabalho de **copywriting** especializado. Mas o desenvolvedor precisa entender o conceito para implementar corretamente, mesmo que o texto venha de outra pessoa.

## Aprender por inspecao

A dica repetida "duas ou tres vezes" no curso: inspecione sites como Facebook, GitHub, e componentes do Radix. Veja como implementam navegacao por teclado, Skip to Content, e outros padroes. "Voce vai fazer isso o tempo todo" — e uma pratica continua, nao um estudo unico.