"use client";

import { FormEvent, useId, useState, useSyncExternalStore } from "react";

const solutions = [
  { short: "Pré-gravado", title: "Transcrição assíncrona", copy: "Transforme arquivos de áudio pré-gravados em texto para extrair insights ou transcrever conteúdo em escala.", tag: "speech-to-text" },
  { short: "Ao vivo", title: "Transcrição em tempo real", copy: "Legendas em tempo real para palestras e treinamentos, com possibilidade de arquivamento para uso futuro.", tag: "live-speech-to-text" },
  { short: "52 idiomas", title: "Identificação de idiomas", copy: "Obtenha fala e insights em escala global, com suporte a 52 idiomas descrito pela solução.", tag: "language-id" },
  { short: "Sentimento", title: "Análise a partir do áudio", copy: "Diferencie momentos positivos e negativos em áudio pré-gravado para uma compreensão mais profunda das falas.", tag: "sentiment" },
];

const plans = [
  { name: "Beginner", price: "R$ 29", yearly: "ou R$ 328 no anual", desc: "Para começar a transformar voz em texto.", rows: ["Assíncrono · 120 min · R$ 0,20 excedente", "Tempo real · 90 min · R$ 0,40 excedente", "Idiomas · 200 min · R$ 0,05 excedente", "Sentimento · 120 min · R$ 0,40 excedente"] },
  { name: "Business", price: "R$ 44", yearly: "ou R$ 499 no anual", desc: "Mais volume para operações em crescimento.", featured: true, rows: ["Assíncrono · 200 min · R$ 0,15 excedente", "Tempo real · 120 min · R$ 0,40 excedente", "Idiomas · 500 min · R$ 0,03 excedente", "Sentimento · 200 min · R$ 0,35 excedente"] },
  { name: "Enterprise", price: "Vamos conversar", yearly: "preço sob consulta", desc: "Uma operação desenhada para grandes volumes.", rows: ["Preços especiais para grandes volumes", "Prioridade no suporte técnico", "Gestor de conta dedicado"] },
];

type Errors = Record<string, string>;

function AudioMark() {
  return <svg aria-hidden="true" viewBox="0 0 440 250" className="audio-mark"><path d="M22 124H67l16-74 22 150 23-106 23 57 28-104 24 150 22-74h46" /><path className="pulse" d="M22 124H67l16-74 22 150 23-106 23 57 28-104 24 150 22-74h46" /></svg>;
}

export default function Home() {
  const [openMenu, setOpenMenu] = useState(false);
  const [activeSolution, setActiveSolution] = useState(0);
  const [showCookiePreferences, setShowCookiePreferences] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "failure" | "unconfigured">("idle");
  const tabBaseId = useId();
  const consent = useSyncExternalStore(
    () => () => undefined,
    () => window.localStorage.getItem("checkspeech-consent"),
    () => null,
  );
  const cookieOpen = showCookiePreferences || !consent;

  function saveConsent(value: "accepted" | "rejected") {
    window.localStorage.setItem("checkspeech-consent", value);
    setShowCookiePreferences(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextErrors: Errors = {};
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const country = String(form.get("country") || "");
    const captcha = String(form.get("captcha") || "").trim();
    if (!name) nextErrors.name = "Informe seu nome.";
    if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Informe um e-mail válido.";
    if (!country) nextErrors.country = "Escolha seu país.";
    if (!form.get("privacy")) nextErrors.privacy = "O consentimento é obrigatório.";
    if (captcha !== "8") nextErrors.captcha = "Confira a resposta do desafio.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) { setStatus("idle"); return; }
    const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;
    if (!endpoint) { setStatus("unconfigured"); return; }
    setStatus("sending");
    fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) })
      .then((response) => { if (!response.ok) throw new Error("Request failed"); setStatus("success"); event.currentTarget.reset(); })
      .catch(() => setStatus("failure"));
  }

  return <>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <header className="site-header"><a className="brand" href="#inicio" aria-label="CheckSpeech AI, início"><span>check</span>speech<em>AI</em></a>
      <button className="menu-button" aria-expanded={openMenu} aria-controls="site-navigation" onClick={() => setOpenMenu(!openMenu)}><span className="sr-only">Abrir menu</span><i /><i /></button>
      <nav id="site-navigation" className={openMenu ? "open" : ""} aria-label="Principal"><a href="#solucoes" onClick={() => setOpenMenu(false)}>Soluções</a><a href="#clientes" onClick={() => setOpenMenu(false)}>Clientes</a><a href="#precos" onClick={() => setOpenMenu(false)}>Preços</a><a href="#contato" onClick={() => setOpenMenu(false)}>Contato</a><a className="nav-cta" href="#contato" onClick={() => setOpenMenu(false)}>Falar com a equipe</a></nav>
    </header>
    <main id="conteudo">
      <section id="inicio" className="hero section"><div className="hero-copy"><p className="eyebrow">A inteligência por trás da fala</p><h1>Quando a voz vira <i>clareza.</i></h1><p className="lead">APIs para transcrever, acompanhar e entender o que foi dito — de arquivos gravados a conversas em tempo real.</p><a className="button button-light" href="#contato">Quero conversar <span>↘</span></a><p className="quiet">Feito para produtos que escutam com propósito.</p></div><div className="hero-visual" aria-label="Visualização abstrata de uma onda sonora sendo transcrita"><div className="visual-top"><span>LIVE / PT-BR</span><b>00:24:18</b></div><AudioMark /><div className="transcript"><span>00:24:13</span><p>“precisamos ouvir os detalhes antes de decidir”</p><strong>positivo · 84%</strong></div><div className="orbit orbit-one" /><div className="orbit orbit-two" /></div></section>
      <section id="clientes" className="clients section"><div><p className="eyebrow">Cenários ilustrativos</p><h2>Construído para quem precisa <i>escutar melhor.</i></h2></div><p className="clients-note">Marcas fictícias usadas apenas para demonstrar aplicações possíveis.</p><div className="logos" aria-label="Exemplos fictícios de clientes"><b>CASCA<span>DE</span></b><b>norte<small>media</small></b><b>VIA<sup>O</sup></b><b>clara<span>co.</span></b><b>RITMO</b></div></section>
      <section id="solucoes" className="solutions section"><div className="section-intro"><p className="eyebrow">Quatro formas de ouvir</p><h2>Uma camada de inteligência para cada <i>momento da fala.</i></h2></div><div className="solution-layout"><div role="tablist" aria-label="Soluções CheckSpeech" className="solution-tabs">{solutions.map((solution, index) => <button key={solution.title} role="tab" aria-selected={activeSolution === index} aria-controls={`${tabBaseId}-${index}`} id={`${tabBaseId}-tab-${index}`} tabIndex={activeSolution === index ? 0 : -1} onClick={() => setActiveSolution(index)}><span>0{index + 1}</span>{solution.short}</button>)}</div><article className="solution-detail" role="tabpanel" id={`${tabBaseId}-${activeSolution}`} aria-labelledby={`${tabBaseId}-tab-${activeSolution}`}><p className="code-label">/{solutions[activeSolution].tag}</p><h3>{solutions[activeSolution].title}</h3><p>{solutions[activeSolution].copy}</p><div className="solution-meter"><span /><span /><span /><span /><span /><span /></div><p className="detail-foot">CheckSpeech AI · processamento de fala</p></article></div></section>
      <section id="precos" className="pricing section"><div className="section-intro"><p className="eyebrow">Planos claros</p><h2>O volume certo para a sua <i>escuta.</i></h2><p>Valores mensais e franquias organizados para uma comparação direta.</p></div><div className="plan-grid">{plans.map((plan) => <article key={plan.name} className={`plan ${plan.featured ? "featured" : ""}`}>{plan.featured && <p className="plan-tag">Para equipes em movimento</p>}<h3>{plan.name}</h3><p>{plan.desc}</p><div className="price">{plan.price}{plan.name !== "Enterprise" && <small>/mês</small>}</div><p className="yearly">{plan.yearly}</p><ul>{plan.rows.map((row) => <li key={row}>{row}</li>)}</ul><a href="#contato" className={plan.featured ? "button button-accent" : "text-link"}>{plan.name === "Enterprise" ? "Falar sobre Enterprise" : "Começar uma conversa"} <span>↘</span></a></article>)}</div></section>
      <section id="contato" className="contact section"><div className="contact-intro"><p className="eyebrow">Próximo passo</p><h2>Vamos entender o que sua operação precisa <i>ouvir.</i></h2><p>Conte um pouco sobre o seu contexto. Nossa equipe responderá assim que houver uma integração de atendimento configurada.</p><div className="contact-rule" /><p className="mono">checkspeech.ai / contato</p></div><form noValidate onSubmit={handleSubmit} aria-describedby="form-status"><div className="form-row"><Field label="Nome" name="name" error={errors.name} required /><Field label="E-mail" name="email" type="email" error={errors.email} required /></div><div className="form-row"><Field label="Telefone" name="phone" type="tel" placeholder="+55 (00) 00000-0000" /><SelectField error={errors.country} /></div><Field label="Mensagem" name="message" textarea placeholder="Como podemos ajudar?" /><div className="captcha"><label htmlFor="captcha">Verificação <strong aria-hidden="true">*</strong></label><p id="captcha-help">Demonstração: quanto é 5 + 3?</p><input id="captcha" name="captcha" inputMode="numeric" aria-describedby="captcha-help captcha-error" aria-invalid={Boolean(errors.captcha)} />{errors.captcha && <p id="captcha-error" className="field-error">{errors.captcha}</p>}</div><label className="checkbox"><input name="privacy" type="checkbox" aria-describedby="privacy-error" aria-invalid={Boolean(errors.privacy)} /><span>Eu concordo com a <a href="#privacidade">Política de Privacidade</a>.</span></label>{errors.privacy && <p id="privacy-error" className="field-error">{errors.privacy}</p>}<button className="button button-light submit" type="submit" disabled={status === "sending"}>{status === "sending" ? "Enviando…" : "Enviar mensagem"} <span>↘</span></button><p id="form-status" className={`form-status ${status}`} role="status">{status === "success" && "Mensagem enviada. Obrigado pelo contato!"}{status === "failure" && "Não foi possível enviar agora. Tente novamente mais tarde."}{status === "unconfigured" && "O envio real ainda não está configurado: nenhuma mensagem foi enviada."}</p></form></section>
    </main>
    <footer id="privacidade" className="footer"><a className="brand" href="#inicio"><span>check</span>speech<em>AI</em></a><div><a href="#solucoes">Soluções</a><a href="#clientes">Clientes</a><a href="#precos">Preços</a><a href="#contato">Contato</a></div><div className="footer-meta"><p>© 2026 CheckSpeech AI. Produto fictício para fins de desafio.</p><button onClick={() => setShowCookiePreferences(true)}>Preferências de cookies</button></div></footer>
    {cookieOpen && <aside className="cookie" aria-labelledby="cookie-title" role="dialog"><p className="eyebrow">Sua escolha</p><h2 id="cookie-title">Cookies, sem ruído.</h2><p>Não usamos rastreadores nem cookies não essenciais. Guardamos sua escolha localmente para não repetir este aviso.</p><div><button className="button button-accent" onClick={() => saveConsent("accepted")}>Aceitar</button><button className="button button-ghost" onClick={() => saveConsent("rejected")}>Recusar não essenciais</button></div></aside>}
  </>;
}

function Field({ label, name, type = "text", error, required, placeholder, textarea = false }: { label: string; name: string; type?: string; error?: string; required?: boolean; placeholder?: string; textarea?: boolean }) {
  const id = `field-${name}`;
  return <div className="field"><label htmlFor={id}>{label}{required && <strong aria-hidden="true"> *</strong>}</label>{textarea ? <textarea id={id} name={name} placeholder={placeholder} rows={4} /> : <input id={id} name={name} type={type} required={required} placeholder={placeholder} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} />}{error && <p id={`${id}-error`} className="field-error">{error}</p>}</div>;
}

function SelectField({ error }: { error?: string }) {
  return <div className="field"><label htmlFor="field-country">País <strong aria-hidden="true">*</strong></label><select id="field-country" name="country" required aria-invalid={Boolean(error)} aria-describedby={error ? "field-country-error" : undefined}><option value="">Selecione</option><option value="BR">Brasil</option><option value="PT">Portugal</option><option value="US">Estados Unidos</option><option value="other">Outro</option></select>{error && <p id="field-country-error" className="field-error">{error}</p>}</div>;
}
