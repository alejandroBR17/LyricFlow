# LyricFlow

Protótipo pessoal em React e TypeScript para limpar e organizar letras de músicas antes da projeção. Gerado com assistência de IA para experimentar essa ideia; ainda não foi publicado na Vercel.

## Como funciona

O usuário cola uma letra, ajusta as regras de limpeza e confere o resultado. O processamento usa expressões regulares no navegador para remover cifras, marcadores e metadados reconhecidos, organizar o título e dividir linhas em blocos para slides. A interface inclui prévia de projeção e histórico local.

O motor não depende de IA para a limpeza. A regra padrão de duas linhas por bloco é uma escolha do projeto, não uma exigência universal de programas de projeção. Formatos diferentes podem precisar de ajustes ou revisão manual; não há garantia de preservar corretamente qualquer entrada.

## Execução local

Use uma versão atual do Node.js compatível com as dependências, como Node.js 24.

```sh
git clone https://github.com/alejandroBR17/LyricFlow.git
cd LyricFlow
npm install
npm run dev
```

Abra `http://localhost:3000`.

```sh
npm run lint
npm test
npm run build
```

`lint` verifica tipos com TypeScript. Os testes Vitest em `src/lib/__tests__/cleaner.test.ts` cobrem exemplos do motor de limpeza; sua existência não comprova cobertura de 100% ou sucesso em todos os formatos de letras. O build gera arquivos em `dist`.

## Decisões e participação

Projeto de Alejandro Cortes, iniciado com assistência de IA. A proposta é manter o processamento principal no navegador e o algoritmo separado da interface em `src/lib/cleaner.ts`, permitindo testar entradas sem abrir o app. O histórico usa armazenamento local; limpar os dados do navegador pode removê-lo.

O protótipo precisa de mais testes de uso e revisão de diferentes formatos de letras antes de ser apresentado como solução concluída. As letras utilizadas continuam sujeitas aos direitos de seus autores.

## Licença

O código segue a [licença MIT](LICENSE). Dependências e conteúdos de terceiros mantêm suas próprias condições.
