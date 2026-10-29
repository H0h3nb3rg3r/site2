// Configuração do EmailJS: cole aqui os 3 valores do painel emailjs.com
const EMAILJS = {
  service: "service_ih7bbmh",
  template: "template_afyh0ne",
  chave: "xBiOKaynIKVnLh9Ep",
};

// Envia um aviso por e-mail para a loja. Nunca interrompe o pedido se falhar.
export async function avisarLoja(assunto, linhas) {
  if (EMAILJS.service.startsWith("COLE")) return; // ainda não configurado

  const detalhes = linhas
    .filter(([, valor]) => valor)
    .map(([campo, valor]) => `${campo}: ${valor}`)
    .join("\n");

  try {
    const r = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS.service,
        template_id: EMAILJS.template,
        user_id: EMAILJS.chave,
        template_params: { assunto, detalhes },
      }),
    });
    if (!r.ok) console.warn("Aviso por e-mail não enviado:", await r.text());
  } catch (err) {
    console.warn("Aviso por e-mail não enviado:", err.message);
  }
}