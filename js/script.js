gsap.registerPlugin(ScrollTrigger);

window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".reveal-up").forEach((el, index) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: index * 0.03,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" }
    });
  });

  document.querySelectorAll(".reveal-card").forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" }
    });
  });

  gsap.utils.toArray(".feature-card").forEach((card) => {
    card.addEventListener("mouseenter", () => gsap.to(card, { y: -6, duration: 0.25, ease: "power2.out" }));
    card.addEventListener("mouseleave", () => gsap.to(card, { y: 0, duration: 0.25, ease: "power2.out" }));
  });
});

const SUPABASE_URL = "https://wmyqquixprkkumdztrug.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndteXFxdWl4cHJra3VtZHp0cnVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxOTEwMzIsImV4cCI6MjA4OTc2NzAzMn0.Jd7c_Ab36mfeGIbtgUUOSE981L67I1bpGpne1D9fCiE";
const isConfigured =
  SUPABASE_URL !== "https://YOUR_PROJECT.supabase.co" &&
  SUPABASE_ANON_KEY !== "YOUR_PUBLIC_ANON_KEY";

let supabaseClient = null;
if (window.supabase && isConfigured) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

const feedbackForm = document.getElementById("feedbackForm");
const formMessage = document.getElementById("formMessage");

function setMessage(text, type = "") {
  formMessage.textContent = text;
  formMessage.className = `form-message mt-3 ${type}`.trim();
}

feedbackForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const full_name = document.getElementById("full_name").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!full_name || !phone) {
    setMessage("Заполни имя и телефон.", "error");
    return;
  }

  if (!supabaseClient) {
    setMessage("Укажи SUPABASE_URL и SUPABASE_ANON_KEY в js/script.js.", "error");
    return;
  }

  setMessage("Отправка...");

  const { error } = await supabaseClient.from("contacts").insert([{ full_name, phone }]);

  if (error) {
    setMessage("Не удалось отправить форму. Проверь настройки Supabase.", "error");
    return;
  }

  setMessage("Спасибо! Заявка отправлена.", "success");
  feedbackForm.reset();
});
