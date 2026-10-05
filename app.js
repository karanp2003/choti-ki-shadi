/**
 * ====================================================================
 * BLUSH & GOLD WEDDING INVITATION LOGIC (app.js)
 * ====================================================================
 * Features:
 * - Dynamic binding for Antima Gupta & Saksham Mathur
 * - Exact Blush & Gold Romantic Envelope Opening Video
 * - Exact Bollywood Audio Song (ReelAudio-14254.mp3)
 * - Soft Rose Petal & Golden Bokeh Rain Canvas
 * - Real-time Countdown Timer (Target: 5 Dec 2026)
 * - Polaroid Photos Gallery with Tilt Effect
 * - Interactive Schedule of Events (Haldi Lunch, Sangeet Night, Day Wedding)
 * - Dress Code Color Swatches
 * - Interactive RSVP Form with direct WhatsApp message submission
 */

document.addEventListener("DOMContentLoaded", () => {
  const config = window.WEDDING_CONFIG || {};

  // ==========================================
  // 1. Audio Setup (Blush & Gold Song)
  // ==========================================
  const audioEl = document.getElementById("wedding-audio");
  const audioBtn = document.getElementById("audio-btn");
  let isAudioPlaying = false;

  if (audioEl && config.audio && config.audio.enabled) {
    audioEl.src = config.audio.src;
    audioEl.loop = true;
    audioEl.preload = "auto";
  }

  function playAudio() {
    if (!audioEl) return;
    audioEl
      .play()
      .then(() => {
        isAudioPlaying = true;
        if (audioBtn) {
          audioBtn.classList.add("playing");
          audioBtn.setAttribute("title", "Pause Music");
          audioBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin-disc">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span class="audio-waves">
              <span></span><span></span><span></span>
            </span>
          `;
        }
      })
      .catch((err) => {
        console.warn("Autoplay blocked by browser policy:", err);
      });
  }

  function pauseAudio() {
    if (!audioEl) return;
    audioEl.pause();
    isAudioPlaying = false;
    if (audioBtn) {
      audioBtn.classList.remove("playing");
      audioBtn.setAttribute("title", "Play Music");
      audioBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>
      `;
    }
  }

  if (audioBtn) {
    audioBtn.addEventListener("click", () => {
      if (isAudioPlaying) {
        pauseAudio();
      } else {
        playAudio();
      }
    });
  }

  // ==========================================
  // 2. Blush Envelope Opening Gate
  // ==========================================
  const entryGate = document.getElementById("entry-gate");
  const entryVideo = document.getElementById("entry-video");
  const openInviteBtn = document.getElementById("open-invite-btn");

  function openEnvelope() {
    if (!entryGate) return;

    // Start background music immediately
    playAudio();

    // Play video envelope animation
    if (entryVideo) {
      entryVideo.play().catch(() => {});
    }

    entryGate.classList.add("opening");

    setTimeout(() => {
      entryGate.style.opacity = "0";
      entryGate.style.pointerEvents = "none";
      setTimeout(() => {
        entryGate.style.display = "none";
        document.body.classList.remove("gate-locked");
      }, 800);
    }, 1200);
  }

  if (entryGate) {
    document.body.classList.add("gate-locked");
    entryGate.addEventListener("click", openEnvelope);
  }
  if (openInviteBtn) {
    openInviteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openEnvelope();
    });
  }

  // ==========================================
  // 3. Live Countdown Timer (Target: 5 Dec 2026)
  // ==========================================
  function initCountdown() {
    const targetStr = config.countdown?.targetDate || "2026-12-05T10:30:00";
    const targetDate = new Date(targetStr).getTime();

    const daysEl = document.getElementById("countdown-days");
    const hoursEl = document.getElementById("countdown-hours");
    const minsEl = document.getElementById("countdown-minutes");
    const secsEl = document.getElementById("countdown-seconds");

    function update() {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        if (daysEl) daysEl.innerText = "00";
        if (hoursEl) hoursEl.innerText = "00";
        if (minsEl) minsEl.innerText = "00";
        if (secsEl) secsEl.innerText = "00";
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (daysEl) daysEl.innerText = String(days).padStart(2, "0");
      if (hoursEl) hoursEl.innerText = String(hours).padStart(2, "0");
      if (minsEl) minsEl.innerText = String(minutes).padStart(2, "0");
      if (secsEl) secsEl.innerText = String(seconds).padStart(2, "0");
    }

    update();
    setInterval(update, 1000);
  }
  initCountdown();

  // ==========================================
  // 4. Romantic Rose Petal & Golden Sparkles Canvas
  // ==========================================
  function initPetalsCanvas() {
    const canvas = document.getElementById("petals-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(32, Math.floor(width / 35));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 4 + 2,
        speedX: Math.random() * 0.8 - 0.4,
        speedY: Math.random() * 0.8 + 0.3,
        opacity: Math.random() * 0.55 + 0.25,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.02 + 0.01,
        // Soft blush pink rose petals & gold dust
        color: Math.random() > 0.45 ? "#E2B4B1" : "#D4AF37",
        isPetal: Math.random() > 0.5,
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.wobble += p.wobbleSpeed;
        p.x += p.speedX + Math.sin(p.wobble) * 0.6;
        p.y += p.speedY;

        if (p.y > height + 10) {
          p.y = -10;
          p.x = Math.random() * width;
        }
        if (p.x > width + 10) p.x = -10;
        if (p.x < -10) p.x = width + 10;

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;

        if (p.isPetal) {
          // Draw gentle organic oval rose petal
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.size * 1.5, p.size, p.wobble, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Golden sparkle circle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
          ctx.shadowBlur = 4;
          ctx.shadowColor = "#D4AF37";
          ctx.fill();
        }

        ctx.restore();
      });

      requestAnimationFrame(animate);
    }
    animate();
  }
  initPetalsCanvas();

  // ==========================================
  // 5. Scroll Reveal Observer
  // ==========================================
  function initScrollReveal() {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
    );

    reveals.forEach((el) => observer.observe(el));
  }
  initScrollReveal();



  // ==========================================
  // 7. Share Invitation Link
  // ==========================================
  const shareBtn = document.getElementById("share-btn");
  if (shareBtn) {
    shareBtn.addEventListener("click", () => {
      const bride = config.hero?.bride?.name || "Antima Gupta";
      const groom = config.hero?.groom?.name || "Saksham Mathur";
      const shareData = {
        title: `${bride} & ${groom} — Wedding Invitation`,
        text: `With love and blessings, join us as we celebrate the wedding of ${bride} & ${groom}!`,
        url: window.location.href,
      };

      if (navigator.share) {
        navigator.share(shareData).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
          alert("Wedding Invitation link copied to clipboard!");
        });
      }
    });
  }
});
