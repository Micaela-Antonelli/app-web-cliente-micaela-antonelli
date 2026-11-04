(() => {
  const form = document.getElementById('form-contacto');
  if (!form) return;

  const captcha = document.getElementById('recaptcha');
  const captchaEtiqueta = captcha ? captcha.closest('.recaptcha-placeholder') : null;

  if (captcha && captchaEtiqueta) {
    captcha.addEventListener('change', () => {
      captchaEtiqueta.classList.toggle('recaptcha-ok', captcha.checked);
    });
  }

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();

    if (captcha && !captcha.checked) {
      alert('Marcá "No soy un robot" para enviar el mensaje.');
      captcha.focus();
      return;
    }

    alert('¡Gracias! Recibimos tu mensaje. Te vamos a responder a la brevedad.');
    form.reset();

    if (captchaEtiqueta) {
      captchaEtiqueta.classList.remove('recaptcha-ok');
    }
  });
})();
