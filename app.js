/**
 * ====================================================================
 * BLUSH & GOLD WEDDING INVITATION LOGIC (app.js)
 * InviteVibes Exact Replication for Antima Gupta & Saksham Mathur
 * ====================================================================
 * Key Features:
 * 1. Exact Video Envelope Gate:
 *    - Uncropped full video
 *    - Plays until envelope is FULLY OPENED
 *    - Only then fades out and reveals main content (#main-content.visible)
 * 2. Exact 3-Card Scratch Date (Month, Day, Year):
 *    - Destination-out canvas with blush-gold gradient foil
 *    - Card glows upon reveal
 *    - When all 3 cards scratched, #locked is revealed with countdown!
 * 3. Live Countdown Timer (5 Dec 2026)
 * 4. Ambient Rose Petals & Golden Dust Canvas
 * 5. Polaroid Photos with Captions (5 uncropped photos)
 * 6. Native Share API & Fallback
 */

document.addEventListener("DOMContentLoaded", () => {
  const config = window.WEDDING_CONFIG || {};

  // ==========================================
  // 1. Background Music (ReelAudio-14254.mp3)
  // ==========================================
  const audioEl = document.getElementById("wedding-audio");
  const audioBtn = document.getElementById("audio-btn");
  let isAudioPlaying = false;

  const audioSrc = config.audio?.src || "https://pub-1953a6673e864f3488c645252f75de98.r2.dev/April/Kriti%20%26%20Manmeet/ReelAudio-14254.mp3";

  if (audioEl) {
    audioEl.src = audioSrc;
    audioEl.loop = true;
    audioEl.preload = "auto";
  }

  function playAudio() {
    if (!audioEl) return;
    audioEl.play().then(() => {
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
    }).catch((err) => {
      console.warn("Autoplay blocked:", err);
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
  // 2. InviteVibes entry gate (Modern Bliss: type2 + envelope video 1-10)
  // ==========================================
  const entryGate = document.getElementById("entry-gate");
  const entryVideo = document.getElementById("entry-video");
  const entryLoader = document.getElementById("entry-loader");
  const entryTapHint = document.getElementById("entry-tap-hint");
  const entryGateMessage = document.getElementById("entry-gate-message");
  const entryLoaderNames = document.getElementById("entry-loader-names");
  const mainContent = document.getElementById("main-content");
  let isEnvelopeOpening = false;
  let isEnvelopeFinished = false;
  let isEntryReady = false;

  const entryConfig = config.entry || {};
  const entryVideoUrl =
    entryConfig.videoUrl ||
    "https://pub-1953a6673e864f3488c645252f75de98.r2.dev/website%20assets/New%20Envelope/1%20(10).mp4";

  function finishEnvelope() {
    if (isEnvelopeFinished) return;
    isEnvelopeFinished = true;

    if (entryGate) {
      entryGate.classList.add("fade-out");
      setTimeout(() => {
        entryGate.style.display = "none";
        document.body.classList.remove("gate-locked");
        if (mainContent) {
          mainContent.classList.add("visible");
        }
        if (audioBtn) {
          audioBtn.classList.add("visible");
        }
        activatePetals();
        setTimeout(initScratchCards, 100);
        showHeroScrollCue();
      }, 800);
    }
  }

  function showHeroScrollCue() {
    const cue = document.getElementById("hero-scroll-cue");
    const target = document.getElementById("scratch-section");
    if (!cue || cue.dataset.bound === "1") return;

    cue.dataset.bound = "1";
    cue.addEventListener("click", () => {
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    requestAnimationFrame(() => {
      setTimeout(() => cue.classList.add("is-visible"), 400);
    });
  }

  function markEntryReady() {
    if (isEntryReady || !entryGate) return;
    isEntryReady = true;
    entryGate.classList.remove("entry-gate--buffering");
    entryGate.classList.add("entry-gate--ready");
    if (entryLoader) {
      entryLoader.classList.add("hide");
    }
    if (entryVideo) {
      try {
        if (entryVideo.currentTime === 0) {
          entryVideo.currentTime = 0.001;
        }
      } catch (e) {
        /* seek may fail on some browsers before metadata */
      }
    }
  }

  let blessingHidden = false;

  const BLESSING_EXIT_MS = 1150;
  let blessingExitFinalized = false;

  function finalizeEntryBlessingHide() {
    if (blessingExitFinalized || !entryGateMessage) return;
    blessingExitFinalized = true;
    entryGateMessage.classList.remove("blessing-exit");
    entryGateMessage.classList.add("hidden");
    entryGateMessage.setAttribute("aria-hidden", "true");
    entryGateMessage.style.display = "none";
    if (entryGate) {
      entryGate.classList.add("gate-blessing-hidden");
    }
  }

  function hideEntryBlessing() {
    if (blessingHidden) return;
    blessingHidden = true;
    if (!entryGateMessage) return;

    entryGateMessage.classList.add("blessing-exit");
    if (entryGate) {
      entryGate.classList.add("gate-blessing-hiding");
    }

    entryGateMessage.addEventListener(
      "animationend",
      (e) => {
        if (e.animationName !== "blessingRecede") return;
        finalizeEntryBlessingHide();
      },
      { once: true }
    );

    setTimeout(finalizeEntryBlessingHide, BLESSING_EXIT_MS + 80);
  }

  function onEnvelopeTimeUpdate() {
    if (!entryVideo) return;
    const d = entryVideo.duration;
    if (Number.isFinite(d) && d > 3.5 && entryVideo.currentTime >= d - 3.8) {
      hideEntryBlessing();
    }
    if (Number.isFinite(d) && d > 2.5 && entryVideo.currentTime >= d - 2.8) {
      try {
        entryVideo.pause();
      } catch (e) {}
      finishEnvelope();
    }
  }

  function hideEntryTapHint() {
    if (entryGate) {
      entryGate.classList.add("gate-tap-hidden", "video-playing");
    }
    if (entryTapHint) {
      entryTapHint.classList.add("hidden");
      entryTapHint.setAttribute("aria-hidden", "true");
      entryTapHint.style.display = "none";
    }
  }

  function startOpenEnvelope() {
    if (!isEntryReady || isEnvelopeOpening) return;
    isEnvelopeOpening = true;

    hideEntryTapHint();
    playAudio();

    if (entryGate) {
      entryGate.classList.add("video-playing");
    }

    if (entryVideo) {
      entryVideo.muted = true;
      try {
        entryVideo.currentTime = 0;
      } catch (e) {}
      const playPromise = entryVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          entryVideo.play().catch(() => finishEnvelope());
        });
      }

      entryVideo.addEventListener("timeupdate", onEnvelopeTimeUpdate);
      entryVideo.addEventListener("ended", finishEnvelope, { once: true });

      setTimeout(() => {
        if (!isEnvelopeFinished) {
          finishEnvelope();
        }
      }, 9000);
    } else {
      finishEnvelope();
    }
  }

  function initEntryGate() {
    if (entryConfig.enabled === false) {
      finishEnvelope();
      return;
    }

    const loaderNames =
      entryConfig.loaderNames ||
      [config.hero?.bride?.name, config.hero?.groom?.name].filter(Boolean).join(" & ") ||
      "Antima & Saksham";

    if (entryLoaderNames) {
      entryLoaderNames.textContent = loaderNames;
    }
    if (entryTapHint && entryConfig.tapHint) {
      entryTapHint.textContent = entryConfig.tapHint;
    }
    if (entryGateMessage && entryConfig.message) {
      entryGateMessage.textContent = entryConfig.message;
    }

    if (!entryGate || !entryVideo) {
      finishEnvelope();
      return;
    }

    const variantType = entryConfig.variantType || "type2";
    const overlayClass =
      entryConfig.overlayStyle === "light" ? "entry-overlay--light" : "entry-overlay--dark";

    entryGate.classList.remove(
      "entry-gate--type1",
      "entry-gate--type2",
      "entry-gate--type3",
      "entry-overlay--light",
      "entry-overlay--dark",
      "entry-gate--modern-bliss"
    );
    entryGate.classList.add(`entry-gate--${variantType}`, overlayClass, "entry-gate--modern-bliss");

    if (entryTapHint) {
      entryTapHint.style.fontFamily = "'Satisfy', cursive";
      if (entryConfig.tapHintTopPercent != null) {
        entryTapHint.style.top = `${entryConfig.tapHintTopPercent}%`;
      }
    }
    if (entryGateMessage) {
      entryGateMessage.style.fontFamily = "'Satisfy', cursive";
    }

    entryVideo.src = entryVideoUrl;
    entryVideo.load();

    const onVideoReady = () => {
      markEntryReady();
    };

    entryVideo.addEventListener("loadeddata", onVideoReady, { once: true });
    entryVideo.addEventListener("canplay", onVideoReady, { once: true });

    entryGate.addEventListener("pointerdown", () => {
      if (isEntryReady && !isEnvelopeOpening) {
        hideEntryTapHint();
      }
    });

    entryGate.addEventListener("click", startOpenEnvelope);
    entryGate.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        startOpenEnvelope();
      }
    });

    setTimeout(() => {
      if (!isEntryReady) {
        markEntryReady();
      }
    }, 12000);
  }

  initEntryGate();

  if (entryConfig.enabled === false) {
    activatePetals();
    showHeroScrollCue();
  }

  // ==========================================
  // Modern Bliss events (sacred ceremony cards)
  // ==========================================
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  const EVENT_FRAME_INSET = 6;

  function computeContainRect(containerW, containerH, mediaW, mediaH) {
    if (!mediaW || !mediaH) {
      return { x: 0, y: 0, w: containerW, h: containerH };
    }
    const scale = Math.min(containerW / mediaW, containerH / mediaH);
    const w = mediaW * scale;
    const h = mediaH * scale;
    return {
      x: (containerW - w) / 2,
      y: (containerH - h) / 2,
      w,
      h,
    };
  }

  function measureInviteTextLayers(frame) {
    const overlay = frame.querySelector(".event-invite-overlay");
    if (!overlay) return [];
    const frameRect = frame.getBoundingClientRect();
    const selectors =
      ".event-invite-title, .event-date-weekday, .event-date-bar, .event-date-num, .event-date-myy, .event-invite-time";
    const layers = [];

    overlay.querySelectorAll(selectors).forEach((el) => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const style = getComputedStyle(el);
      const x = r.left - frameRect.left - EVENT_FRAME_INSET;
      const y = r.top - frameRect.top - EVENT_FRAME_INSET;
      const fontSize = parseFloat(style.fontSize) || 16;
      const lineHeight = parseFloat(style.lineHeight) || fontSize * 1.2;
      const baselineY = y + lineHeight * 0.78;

      layers.push({
        text: el.textContent || "",
        x: x + r.width / 2,
        y: baselineY,
        font: `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`,
        color: style.color,
        shadow: style.textShadow,
        align: "center",
      });
    });

    return layers;
  }

  function drawInviteTextLayer(ctx, layer) {
    ctx.save();
    ctx.font = layer.font;
    ctx.fillStyle = layer.color;
    ctx.textAlign = layer.align;
    ctx.textBaseline = "alphabetic";
    if (layer.shadow && layer.shadow !== "none") {
      ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 2;
    }
    ctx.fillText(layer.text, layer.x, layer.y);
    ctx.restore();
  }

  function initEventInviteComposite(frame) {
    const video = frame.querySelector("video.event-invite-src");
    const canvas = frame.querySelector("canvas.event-invite-composite");
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let textLayers = [];
    let rafId = 0;
    let running = false;
    let innerW = 1;
    let innerH = 1;
    let dpr = 1;
    const bgColor =
      frame.classList.contains("event-invite--dark")
        ? "#0c1824"
        : frame.classList.contains("event-invite--arch")
          ? "#faf6f0"
          : "#faf8f5";

    const resizeCanvas = () => {
      const wasCompositeActive = frame.classList.contains("is-composite-active");
      if (wasCompositeActive) {
        frame.classList.remove("is-composite-active");
      }

      innerW = Math.max(1, frame.clientWidth - EVENT_FRAME_INSET * 2);
      innerH = Math.max(1, frame.clientHeight - EVENT_FRAME_INSET * 2);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(innerW * dpr);
      canvas.height = Math.round(innerH * dpr);
      canvas.style.width = `${innerW}px`;
      canvas.style.height = `${innerH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      textLayers = measureInviteTextLayers(frame);

      if (wasCompositeActive) {
        frame.classList.add("is-composite-active");
      }
    };

    const drawFrame = () => {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, innerW, innerH);

      if (video.readyState >= 2 && video.videoWidth) {
        const rect = computeContainRect(innerW, innerH, video.videoWidth, video.videoHeight);
        ctx.drawImage(video, rect.x, rect.y, rect.w, rect.h);
      }

      textLayers.forEach((layer) => drawInviteTextLayer(ctx, layer));
    };

    const tick = () => {
      if (!running) return;
      drawFrame();
      rafId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      resizeCanvas();
      frame.classList.add("is-composite-active");
      running = true;
      tick();
    };

    const stop = () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
    };

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        if (visible) start();
        else stop();
      },
      { rootMargin: "80px", threshold: 0.05 }
    );
    io.observe(frame);

    const ro = new ResizeObserver(() => {
      resizeCanvas();
      if (running) drawFrame();
    });
    ro.observe(frame);

    video.addEventListener("loadeddata", () => {
      resizeCanvas();
      if (running) drawFrame();
    });

    document.fonts.ready.then(() => {
      resizeCanvas();
      if (running) drawFrame();
    });

    video.play().catch(() => {});
  }

  function parseInviteDateParts(dateStr) {
    const raw = String(dateStr || "");
    const segments = raw.split("·").map((s) => s.trim());
    const weekday =
      segments[0] && /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/i.test(segments[0])
        ? segments[0]
        : "";
    const datePart = segments.length > 1 ? segments[1] : raw;
    const match = datePart.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
    if (!match) {
      return { weekday, day: "", monthYear: "" };
    }
    const monthWord = match[2];
    const monthShort =
      monthWord.length > 3 ? `${monthWord.charAt(0).toUpperCase()}${monthWord.slice(1, 3).toLowerCase()}` : monthWord;
    return {
      weekday,
      day: String(match[1]).padStart(2, "0"),
      monthYear: `${monthShort} ${match[3]}`,
    };
  }

  function renderModernBlissEvents() {
    const mount = document.getElementById("events-mount");
    const eventsCfg = config.events;
    if (!mount || !eventsCfg?.items?.length) return;

    const sub = escapeHtml(eventsCfg.subheading || "The Celebration Unfolds");
    const heading = escapeHtml(eventsCfg.heading || "Wedding Festivities");
    const intro = escapeHtml(eventsCfg.intro || "");

    const cards = eventsCfg.items
      .map((item) => {
        const inviteStyle = item.inviteStyle || "light";
        const inviteClass =
          inviteStyle === "dark"
            ? "event-invite--dark"
            : inviteStyle === "arch"
              ? "event-invite--arch"
              : "event-invite--light";

        const bakedVideo = item.composedVideo || item.videoWithText || "";
        const media = bakedVideo || item.video || item.image || "";
        const isVideo = /\.mp4(\?|$)/i.test(media);
        const useComposite =
          !bakedVideo && isVideo && (eventsCfg.compositeVideoCards !== false);
        const parsed = item.inviteDate || parseInviteDateParts(item.date);
        const { weekday, day, monthYear } = parsed;
        const cardTitle = item.cardTitle || item.dayTitle || item.title;
        const titleClass = String(cardTitle).includes("\n") ? " is-multiline" : "";

        const dress = item.dressCode;
        const dressDots = (dress?.colors || [])
          .map((c) => `<span class="evt-dresscode-dot" style="background:${escapeHtml(c)}"></span>`)
          .join("");

        const mediaTag = isVideo
          ? `<video class="event-invite-bg event-invite-src" playsinline muted loop autoplay preload="metadata" src="${escapeHtml(media)}"></video>`
          : `<img class="event-invite-bg" src="${escapeHtml(media)}" alt="${escapeHtml(item.title)}" loading="lazy" />`;

        const compositeCanvas = useComposite
          ? `<canvas class="event-invite-composite" aria-hidden="true"></canvas>`
          : "";

        const overlayBlock =
          bakedVideo || !isVideo
            ? ""
            : `
            <div class="event-invite-overlay${useComposite ? " event-invite-overlay--for-measure" : ""}">
              <div class="event-invite-stack">
                <h3 class="event-invite-title${titleClass}">${escapeHtml(cardTitle)}</h3>
                <div class="event-date-row">
                  <span class="event-date-weekday">${escapeHtml(weekday)}</span>
                  <span class="event-date-bar">|</span>
                  <span class="event-date-num">${escapeHtml(day)}</span>
                  <span class="event-date-bar">|</span>
                  <span class="event-date-myy">${escapeHtml(monthYear)}</span>
                </div>
                <p class="event-invite-time">${escapeHtml(item.time || "")}</p>
              </div>
            </div>`;

        const bakedAria = bakedVideo
          ? ` aria-label="${escapeHtml(`${cardTitle} — ${weekday} ${day} ${monthYear} — ${item.time || ""}`)}"`
          : "";

        const blockExtra = item.highlighted ? " event-block--wedding" : "";

        return `
        <article class="event-block reveal${blockExtra}">
          <header class="event-day-header">
            <span class="event-day-label">${escapeHtml(item.dayLabel || "")}</span>
          </header>
          <div class="event-invite-frame ${inviteClass}${useComposite ? " event-invite-frame--composite" : ""}"${bakedAria}>
            ${compositeCanvas}
            ${mediaTag}
            ${overlayBlock}
          </div>
          <div class="evt-details">
            <span class="evt-tagline">${escapeHtml(item.description || "")}</span>
            ${
              dress
                ? `<div class="evt-dresscode">
                <span class="evt-dresscode-lbl">Attire</span>
                <span class="evt-dresscode-names">${escapeHtml(dress.label || "")}</span>
                <div class="evt-dresscode-dots">${dressDots}</div>
                ${dress.names ? `<span class="evt-dresscode-note">${escapeHtml(dress.names)}</span>` : ""}
              </div>`
                : ""
            }
            <div class="evt-venue">
              <span class="evt-venue-name">${escapeHtml(item.venue || "")}</span>
              <a href="${escapeHtml(item.mapsUrl || "#")}" target="_blank" rel="noopener" class="evt-dir-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                Directions
              </a>
            </div>
          </div>
        </article>`;
      })
      .join("");

    mount.innerHTML = `
      <span class="sec-label">${sub}</span>
      <h2 class="sec-heading" id="events-heading">${heading}</h2>
      ${intro ? `<p class="events-intro">${intro}</p>` : ""}
      <div class="event-day-cards">${cards}</div>
    `;

    mount.querySelectorAll("video.event-invite-src, video.event-invite-bg").forEach((vid) => {
      vid.play().catch(() => {});
    });

    mount.querySelectorAll(".event-invite-frame--composite").forEach((frame) => {
      initEventInviteComposite(frame);
    });
  }

  renderModernBlissEvents();

  function activatePetals() {
    const canvas = document.getElementById("petals-canvas");
    if (canvas) {
      canvas.classList.add("active");
    }
    document.dispatchEvent(new Event("gateEnded"));
  }

  // ==========================================
  // 3. Exact InviteVibes Scratch Cards
  // ==========================================
  let totalCardsScratched = 0;

  function initScratchCards() {
    const cards = [
      { canvasId: "canvas-day",   cardId: "card-day",   unitId: "unit-day"   },
      { canvasId: "canvas-month", cardId: "card-month", unitId: "unit-month" },
      { canvasId: "canvas-year",  cardId: "card-year",  unitId: "unit-year"  }
    ];

    cards.forEach((item) => {
      setupSingleScratchCard(item.canvasId, item.cardId, item.unitId);
    });
  }

  function setupSingleScratchCard(canvasId, cardId, unitId) {
    const canvas = document.getElementById(canvasId);
    const card = document.getElementById(cardId);
    const unit = document.getElementById(unitId);
    if (!canvas || !card) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const rect = card.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = rect.width || 110;
    const h = rect.height || 150;

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.scale(dpr, dpr);

    // Exact InviteVibes Blush-Gold Gradient Foil
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#EAC9C7");
    grad.addColorStop(0.5, "#BA7A76");
    grad.addColorStop(1, "#EAC9C7");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle luxury diagonal highlight
    ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
    ctx.fillRect(w * 0.18, 0, w * 0.16, h);

    ctx.globalCompositeOperation = "destination-out";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = Math.max(38, Math.round(w * 0.38));

    let isDrawing = false;
    let isDone = false;

    function getCoords(e) {
      const r = canvas.getBoundingClientRect();
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: cx - r.left, y: cy - r.top };
    }

    function checkScratchedPercentage() {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clearPixels = 0;
      for (let i = 3; i < imgData.length; i += 4) {
        if (imgData[i] === 0) clearPixels++;
      }
      const ratio = clearPixels / (canvas.width * canvas.height);
      if (ratio > 0.45 && !isDone) {
        isDone = true;
        card.classList.add("glow");

        // Hide hint
        const hint = unit ? unit.querySelector(".scratch-hint") : null;
        if (hint) hint.style.display = "none";

        // Fade out canvas smoothly
        canvas.style.transition = "opacity 0.4s ease";
        canvas.style.opacity = "0";
        setTimeout(() => { canvas.style.display = "none"; }, 400);

        totalCardsScratched++;
        if (totalCardsScratched >= 3) {
          unlockRestOfInvitation();
        }
      }
    }

    function draw(e) {
      if (!isDrawing || isDone) return;
      if (e.cancelable && e.type.startsWith("touch")) e.preventDefault();
      const pos = getCoords(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      checkScratchedPercentage();
    }

    function startDraw(e) {
      if (isDone) return;
      isDrawing = true;
      const pos = getCoords(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      draw(e);
    }

    function stopDraw() {
      isDrawing = false;
    }

    // Mouse Listeners
    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", draw);
    window.addEventListener("mouseup", stopDraw);

    // Touch Listeners
    canvas.addEventListener("touchstart", startDraw, { passive: false });
    canvas.addEventListener("touchmove", draw, { passive: false });
    window.addEventListener("touchend", stopDraw);
  }

  // Celebration Crackers / Confetti Blast (InviteVibes Exact Effect)
  function fireCelebrationCrackers() {
    const colors = ["#C47A82", "#faf6f2", "#B8956A", "#9E4D56", "#D4BC8E", "#5C2430", "#F0E6D4"];

    if (typeof window.confetti === "function") {
      // 1. Center burst
      window.confetti({
        particleCount: 180,
        spread: 100,
        origin: { x: 0.5, y: 0.6 },
        colors: colors,
        zIndex: 99999,
        disableForReducedMotion: false
      });

      // 2. Left side cannon
      setTimeout(() => {
        window.confetti({
          particleCount: 120,
          angle: 60,
          spread: 70,
          origin: { x: 0.05, y: 0.65 },
          colors: colors,
          zIndex: 99999
        });
      }, 300);

      // 3. Right side cannon
      setTimeout(() => {
        window.confetti({
          particleCount: 120,
          angle: 120,
          spread: 70,
          origin: { x: 0.95, y: 0.65 },
          colors: colors,
          zIndex: 99999
        });
      }, 550);
    }
  }

  function unlockRestOfInvitation() {
    const lockedEl = document.getElementById("locked");
    if (!lockedEl) return;

    // Shatter crackers / confetti!
    fireCelebrationCrackers();

    lockedEl.classList.add("unlocked");
    requestAnimationFrame(() => {
      lockedEl.classList.add("visible");
      // Smooth scroll to countdown section
      const cdSection = document.getElementById("countdown-section");
      if (cdSection) {
        setTimeout(() => {
          cdSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 600);
      }
    });
  }

  // ==========================================
  // 4. Live Countdown (Target: 5 Dec 2026)
  // ==========================================
  function initCountdown() {
    const targetStr = config.countdown?.targetDate || "2026-12-05T10:30:00+05:30";
    const targetDate = new Date(targetStr).getTime();

    const daysEl = document.getElementById("countdown-days");
    const hoursEl = document.getElementById("countdown-hours");
    const minsEl = document.getElementById("countdown-mins");
    const secsEl = document.getElementById("countdown-secs");

    function update() {
      const now = Date.now();
      const distance = targetDate - now;

      if (distance <= 0) {
        if (daysEl) daysEl.innerText = "00";
        if (hoursEl) hoursEl.innerText = "00";
        if (minsEl) minsEl.innerText = "00";
        if (secsEl) secsEl.innerText = "00";
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((distance % (1000 * 60)) / 1000);

      const pad = (n) => String(n).padStart(2, "0");

      if (daysEl) daysEl.innerText = pad(days);
      if (hoursEl) hoursEl.innerText = pad(hours);
      if (minsEl) minsEl.innerText = pad(mins);
      if (secsEl) secsEl.innerText = pad(secs);
    }

    update();
    setInterval(update, 1000);
  }
  initCountdown();

  // ==========================================
  // 5. Romantic Petals & Gold Sparkles Canvas
  // ==========================================
  function initPetalsCanvas() {
    const canvas = document.getElementById("petals-canvas");
    if (!canvas || config.theme?.petalsEnabled === false) return;

    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let running = false;

    const petalColors = ["#C47A82", "#B85C5C", "#E8C4B8", "#9E4D56"];
    const dustColors = ["#B8956A", "#D4BC8E", "#F0E6D4"];

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", resize);

    const particles = [];
    const count = Math.min(52, Math.max(28, Math.floor(width / 22)));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        size: Math.random() * 5 + 2.5,
        speedX: Math.random() * 0.6 - 0.3,
        speedY: Math.random() * 1.1 + 0.45,
        opacity: Math.random() * 0.5 + 0.2,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.025 + 0.008,
        rotation: Math.random() * Math.PI,
        rotSpeed: Math.random() * 0.04 - 0.02,
        color:
          Math.random() > 0.35
            ? petalColors[Math.floor(Math.random() * petalColors.length)]
            : dustColors[Math.floor(Math.random() * dustColors.length)],
        isPetal: Math.random() > 0.38,
      });
    }

    function drawPetal(p) {
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 1.6, p.size * 0.85, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    function animate() {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.wobble += p.wobbleSpeed;
        p.rotation += p.rotSpeed;
        p.x += p.speedX + Math.sin(p.wobble) * 0.75;
        p.y += p.speedY;

        if (p.y > height + 16) {
          p.y = -12 - Math.random() * 80;
          p.x = Math.random() * width;
        }
        if (p.x > width + 12) p.x = -12;
        if (p.x < -12) p.x = width + 12;

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.isPetal) {
          drawPetal(p);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.55, 0, Math.PI * 2);
          ctx.shadowBlur = 6;
          ctx.shadowColor = "#B8956A";
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        ctx.restore();
      });

      requestAnimationFrame(animate);
    }

    function start() {
      if (running) return;
      running = true;
      animate();
    }

    document.addEventListener("gateEnded", start);
    if (canvas.classList.contains("active")) {
      start();
    }
  }
  initPetalsCanvas();

  // ==========================================
  // 6. Scroll Reveal Observer
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
      { threshold: 0.1, rootMargin: "0px 0px -20px 0px" }
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
        text: `With love and blessings, join us as we celebrate the wedding of ${bride} & ${groom} on 04 & 05 December 2026!`,
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
