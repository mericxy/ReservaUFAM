## Evidência 2 — Conflito com PostCSS

Na segunda evidência, durante a execução do projeto com Vite, ocorre falha de compilação gerada pelo plugin de PostCSS.
A mensagem de erro apresentada é:

```
[plugin:vite:css] [postcss] It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin.
The PostCSS plugin has moved to a separate package, so to continue using Tailwind CSS with PostCSS
you'll need to install `@tailwindcss/postcss` and update your PostCSS configuration.
```

Esse erro mostra que, a partir do TailwindCSS 4.1, o plugin do Tailwind para PostCSS não é mais integrado diretamente no pacote principal, sendo necessário instalar e configurar o pacote separado `@tailwindcss/postcss` para que a integração funcione corretamente.