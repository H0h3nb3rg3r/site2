import "./conta-nav.js";

const $ = (s) => document.querySelector(s);

addEventListener("scroll", () => $("#nav").classList.toggle("scrolled", scrollY > 40));
addEventListener("mousemove", (e) => {
  const g = $("#glow");
  g.style.left = e.clientX + "px";
  g.style.top = e.clientY + "px";
});

export function tilt() {
  document.querySelectorAll(".car").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
    });
    card.addEventListener("mouseleave", () => (card.style.transform = ""));
  });
}