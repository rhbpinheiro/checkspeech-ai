# CheckSpeech AI — desafio Front-End

Landing page em Next.js para o desafio da MOST Specialist Technologies. O enunciado original permanece em `desafio-01/README.md`.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`. Para validar produção, execute `npm run lint` e `npm run build`, depois `npm start`.

## Formulário e CAPTCHA

O formulário possui validação acessível no navegador e um desafio aritmético apenas demonstrativo. Ele **não é um CAPTCHA de produção**. Para um envio real, configure `NEXT_PUBLIC_CONTACT_ENDPOINT` com a URL de um endpoint que:

1. receba e valide os campos no servidor;
2. verifique um CAPTCHA de verdade no servidor (por exemplo, Turnstile/reCAPTCHA com o segredo no ambiente do servidor);
3. aplique limites de taxa e entregue a mensagem ao destino apropriado.

Sem essa variável, a página informa corretamente que nenhum envio foi realizado.

## Privacidade e desempenho

A página não carrega analytics, publicidade ou qualquer cookie não essencial. A escolha da barra é persistida somente no `localStorage`, e pode ser alterada no rodapé. Os visuais são SVG/CSS locais; não há imagens ou fontes remotas.
