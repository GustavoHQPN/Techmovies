# TechMovies

Abra `index.html` no navegador (ou publique a pasta no GitHub Pages). Não precisa de servidor.

## Como adicionar um filme
Em `data.js`, copie um item de `FILMES` e preencha. Coloque o ID do YouTube em `yt` para o título ficar reproduzível; sem `yt` ele aparece como "Em breve". O pôster vai em `p` (ou usa a miniatura do vídeo).

## Login e recuperação de senha
A home abre sem login. Avaliar, comentar, salvar na lista e assinar planos pedem login. A recuperação de senha usa uma pergunta de segurança escolhida no cadastro (não há servidor de e-mail). Contas criadas antes dessa versão não têm pergunta e não podem ser recuperadas por esse caminho. Com um servidor, o ideal é enviar um link de redefinição por e-mail.

## Dados
Contas, listas, notas e comentários ficam no `localStorage` do navegador (camada `db` no início de `app.js`). Para usar um servidor real, troque `db.get` e `db.set` por chamadas `fetch` a uma API. Nesse caso a senha deve ser validada e criptografada no servidor (por exemplo com `password_hash` no PHP), e as consultas SQL devem usar prepared statements.
