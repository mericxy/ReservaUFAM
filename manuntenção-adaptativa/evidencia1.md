## Evidência 1 — Erro de regra desconhecida no CSS

Na primeira evidência, ao abrir o arquivo index.css, o editor (VSCode) sinaliza erro nas diretivas do TailwindCSS (@tailwind base;, @tailwind components; e @tailwind utilities;).
A mensagem exibida é:

```
Unknown at rule @tailwind css(unknownAtRules)
```

Esse erro indica que, após a atualização para o TailwindCSS 4.1, o interpretador de CSS do editor não reconhece mais essas diretivas, possivelmente devido a mudanças no suporte ao PostCSS ou na forma como o Tailwind deve ser configurado.