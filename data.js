/* Catálogo da TechMovies.
   Para adicionar um título: copie um item e preencha.
   - yt: ID do vídeo do YouTube (a parte depois de "v=" ou de "/embed/"). Sem yt, o título aparece como "Em breve".
   - p: caminho do pôster. Sem p, usa a miniatura do vídeo.
   - elenco: opcional. */
const GENEROS = ['Aventura', 'Comédia', 'Drama', 'Ficção Científica', 'Romance', 'Terror'];

const FILMES = [
  { id: 'sete-homens', t: 'Sete Homens e um Destino', g: 'Aventura', yt: '9hjefJS2RJ0', p: 'img/hero.jpg',
    s: 'Moradores desesperados de uma cidadezinha contratam sete mercenários para combater um inescrupuloso empresário e seus capangas, no Velho Oeste norte-americano.',
    elenco: [
      { n: 'Denzel Washington', c: 'Sam Chisholm', f: 'denzel' },
      { n: 'Chris Pratt', c: 'Josh Faraday', f: 'chris' },
      { n: 'Ethan Hawke', c: 'Goodnight', f: 'ethan' },
      { n: "Vincent D'Onofrio", c: 'Jack Horne', f: 'vincent' } ] },
  { id: 'cinderela', t: 'Não o Tipo da Cinderela', g: 'Romance', yt: '4Y5jk3sNinA', s: 'Filme de romance completo, dublado. Sinopse em breve.' },
  { id: 'o-grito', t: 'O Grito', g: 'Terror', yt: 'D6HF2nJxKEk', s: 'Filme de terror completo, dublado. Sinopse em breve.' },
  { id: 'olhos-famintos-3', t: 'Olhos Famintos 3', g: 'Terror', yt: 'DTroE4IOVsc', s: 'Filme de terror completo, dublado. Sinopse em breve.' },
  { id: 'sorte-nos-separe', t: 'Até Que a Sorte Nos Separe', g: 'Comédia', yt: 'q0gZOGoRRnc', s: 'Comédia nacional completa. Sinopse em breve.' },
  { id: 'centro-da-terra', t: 'Centro da Terra', g: 'Ficção Científica', yt: 'LXxCrbM7dyc', s: 'Filme de aventura e ficção completo, dublado. Sinopse em breve.' },

  { id: 'umbrella', t: 'The Umbrella Academy', g: 'Ficção Científica', p: 'img/p/p1.jpg', s: 'Irmãos adotivos com poderes se reúnem após a morte do pai e tentam evitar o fim do mundo.' },
  { id: 'star-wars', t: 'Star Wars: A Ascensão Skywalker', g: 'Ficção Científica', p: 'img/p/p2.jpg', s: 'A Resistência encara a Primeira Ordem na batalha final da saga Skywalker.' },
  { id: 'pokemon', t: 'Pokémon', g: 'Aventura', p: 'img/p/p3.jpg', s: 'Ash e Pikachu viajam pelo mundo para se tornar Mestre Pokémon.' },
  { id: 'guerra-civil', t: 'Capitão América: Guerra Civil', g: 'Aventura', p: 'img/p/p4.jpg', s: 'Os Vingadores se dividem em dois lados após uma discussão sobre controle de heróis.' },
  { id: 'hobbit', t: 'O Hobbit: A Batalha dos Cinco Exércitos', g: 'Aventura', p: 'img/p/p5.jpg', s: 'Bilbo e os anões enfrentam a batalha final pela Montanha Solitária.' },
  { id: 'breaking-bad', t: 'Breaking Bad', g: 'Drama', p: 'img/p/p6.jpg', s: 'Um professor de química com câncer passa a fabricar metanfetamina para garantir o futuro da família.' },
  { id: 'house', t: 'House', g: 'Drama', p: 'img/p/p7.jpg', s: 'O brilhante e ranzinza Dr. House lidera uma equipe que resolve casos médicos impossíveis.' },
  { id: 'sobrenatural', t: 'Sobrenatural', g: 'Terror', p: 'img/p/p8.jpg', s: 'Dois irmãos caçam demônios e criaturas sobrenaturais pelas estradas dos Estados Unidos.' },
  { id: 'smallville', t: 'Smallville: As Aventuras do Superboy', g: 'Ficção Científica', p: 'img/p/p9.jpg', s: 'A juventude de Clark Kent na cidade de Smallville, antes de se tornar o Superman.' },
  { id: 'vingadores', t: 'Vingadores: Guerra Infinita', g: 'Ficção Científica', p: 'img/p/p10.jpg', s: 'Os heróis tentam impedir Thanos de reunir as Joias do Infinito.' },
];

const DESTAQUE = 'sete-homens';

// Valores de exemplo: ajuste para os planos reais do projeto.
const PLANOS = [
  { id: 'basico', n: 'Básico', preco: '19,90', itens: ['1 tela por vez', 'Qualidade HD', 'Com anúncios'] },
  { id: 'padrao', n: 'Padrão', preco: '29,90', itens: ['2 telas por vez', 'Qualidade Full HD', 'Sem anúncios'] },
  { id: 'premium', n: 'Premium', preco: '39,90', itens: ['4 telas por vez', 'Qualidade 4K', 'Sem anúncios'] },
];
