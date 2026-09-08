;(function () {
  'use strict'

  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /* ---------- nav ---------- */
  var nav = document.getElementById('nav')
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'bottom top',
    onEnter: function () {
      nav.classList.add('is-solid')
    },
    onLeaveBack: function () {
      nav.classList.remove('is-solid')
    },
  })

  /* ---------- hero ---------- */
  var heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  heroTl
    .fromTo('#heroBackdrop', { scale: 1.14 }, { scale: 1, duration: 2.6, ease: 'power2.out' }, 0)
    .fromTo('.hero__eyebrow', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.35)
    .fromTo('.hero__title', { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: 1.1 }, 0.5)
    .fromTo('.hero__sub', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.78)
    .fromTo('.hero__scroll', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 1.1)

  if (!reduceMotion) {
    gsap.to('#heroBackdrop', {
      yPercent: 14,
      ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
    })
    gsap.to('#heroContent', {
      autoAlpha: 0,
      y: -40,
      scale: 0.96,
      ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
    })
  }

  /* ---------- intro reveal ---------- */
  // wraps each non-space character in its own span so GSAP can stagger them;
  // spaces stay as plain text nodes so normal word-wrapping still works.
  function splitChars(el) {
    var chars = []
    var frag = document.createDocumentFragment()
    el.textContent.split('').forEach(function (ch) {
      if (ch === ' ') {
        frag.appendChild(document.createTextNode(' '))
      } else {
        var span = document.createElement('span')
        span.textContent = ch
        span.style.display = 'inline-block'
        frag.appendChild(span)
        chars.push(span)
      }
    })
    el.textContent = ''
    el.appendChild(frag)
    return chars
  }

  var introTitleChars = splitChars(document.getElementById('introTitle'))
  gsap.set(introTitleChars, { autoAlpha: 0, yPercent: 70 })
  gsap.set('.intro__text .reveal-line > *', { yPercent: 110 })

  gsap
    .timeline({
      scrollTrigger: { trigger: '#intro', start: 'top 72%' },
    })
    .to('#introMedia', { clipPath: 'inset(0 0% 0 0)', duration: 1.3, ease: 'power4.inOut' }, 0)
    .to(
      introTitleChars,
      { autoAlpha: 1, yPercent: 0, duration: 0.5, stagger: 0.025, ease: 'power3.out' },
      0.2,
    )
    .to(
      '.intro__text .reveal-line > *',
      { yPercent: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' },
      0.55,
    )
    .fromTo(
      '.intro > .wrap > .intro__text > .eyebrow',
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.6 },
      0.1,
    )

  /* ---------- philosophy reveal ---------- */
  gsap
    .timeline({
      scrollTrigger: { trigger: '#pillars', start: 'top 72%' },
    })
    .to('#philoMedia', { clipPath: 'inset(0 0 0 0)', duration: 1.3, ease: 'power4.inOut' }, 0)

  /* ---------- catalog cta overlap / footer clearance ----------
     .catalog-card should overlap the footer by half its own rendered
     height, without its top edge shifting away from .stories (see the
     long comment on .catalog-cta in the CSS for why that rules out a
     transform-based approach). So: measure the card's actual height,
     write half of it as --catalog-overlap (consumed as a negative
     margin-bottom on the card, pulling the footer up underneath it),
     and give the footer --footer-clear = that overlap + 64px of
     padding-top so its own content never starts under the card.
     Mobile switches to a smaller ~34% fraction, matching the shallower
     overlap that suits the stacked (image-on-top) mobile card. Runs on
     load/resize/font-load and on every .rise reveal tick below, since
     that entry animation briefly changes the reveal wrapper's size. */
  function syncCatalogCta() {
    var card = document.querySelector('.catalog-card')
    var footer = document.getElementById('footer')
    if (!card || !footer) return
    var fraction = window.innerWidth <= 860 ? 0.34 : 0.5
    var overlap = Math.ceil(card.getBoundingClientRect().height * fraction)
    card.style.setProperty('--catalog-overlap', overlap + 'px')
    footer.style.setProperty('--footer-clear', overlap + 64 + 'px')
  }
  syncCatalogCta()
  window.addEventListener('resize', syncCatalogCta)
  window.addEventListener('load', syncCatalogCta)
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncCatalogCta)
  if (window.ResizeObserver) {
    var catalogCardEl = document.querySelector('.catalog-card')
    if (catalogCardEl) new ResizeObserver(syncCatalogCta).observe(catalogCardEl)
  }

  /* ---------- generic rise reveals ---------- */
  gsap.utils.toArray('.rise').forEach(function (el, i) {
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 30 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
        delay: (i % 3) * 0.08,
        onUpdate: syncCatalogCta,
      },
    )
  })

  /* ---------- product showcase ---------- */
  var products = [
    { name: 'Arvand One' },
    { name: 'Arvand Mesh' },
    { name: 'Arvand Lite' },
    { name: 'Arvand Executive' },
  ]
  var N = products.length
  var TRANSITIONS = N - 1 // frame-to-frame transitions — the pin only needs to last long enough to cover these, not a whole extra segment after the last frame settles
  var leftFrames = gsap.utils.toArray('#stageLeft .frame')
  var rightFrames = gsap.utils.toArray('#stageRight .frame')
  var currentIndex = 0
  var mainST = null
  var sectionTransitioning = false
  var SNAP_DELAY = 0.05 // seconds to wait after scroll stops before snap decides direction — lower = snaps sooner
  var VH_PER_FRAME = 175 // physical scroll (vh) needed per frame-to-frame transition — higher = more scrolling needed per frame = smaller jump per scroll tick
  var SCRUB_SMOOTHNESS = 0.5 // seconds for the animation to catch up to the scroll position — higher = smoother/laggier, lower = snappier/more direct
  var HANDOFF_DURATION = 0.9 // seconds for the animated scroll into the next section once the last frame is reached
  var handoffArmed = false

  // once the last frame is settled, wait for one genuine forward scroll
  // gesture (not the snap tween landing there on its own) before handing off.
  function runHandoff(triggerEnd) {
    if (reduceMotion || sectionTransitioning) return
    sectionTransitioning = true
    gsap.to(window, {
      scrollTo: { y: triggerEnd + window.innerHeight, autoKill: true },
      duration: HANDOFF_DURATION,
      ease: 'power2.inOut',
      onComplete: function () {
        sectionTransitioning = false
      },
    })
  }

  function onHandoffWheel(e) {
    if (e.deltaY <= 0 || !mainST) return
    e.preventDefault()
    disarmHandoff()
    runHandoff(mainST.end)
  }

  function armHandoff() {
    if (handoffArmed) return
    handoffArmed = true
    window.addEventListener('wheel', onHandoffWheel, { passive: false })
  }

  function disarmHandoff() {
    if (!handoffArmed) return
    handoffArmed = false
    window.removeEventListener('wheel', onHandoffWheel)
  }

  function layout(progress) {
    var activeFloat = progress * TRANSITIONS

    var REST_DRIFT = 10 // right stage: how far the outgoing product parallaxes under the next one, in %
    var FEATHER_PX = 8 // left stage: max width of the feathered leading edge, in px
    var DIM_MAX = 0.3 // right stage: max black overlay on the outgoing product

    leftFrames.forEach(function (frame, i) {
      var offset = activeFloat - i
      // entering: slides in fully from the right. once active, it's covered by
      // the next frame sliding over it and holds perfectly still underneath.
      var t = offset <= 0 ? gsap.utils.clamp(-1, 0, offset) : 0
      var amount = offset <= 0 ? gsap.utils.clamp(0, 100, -offset * 100) : 0
      gsap.set(frame, { xPercent: amount })

      // the leading edge feathers (like a Photoshop feather) while still arriving,
      // then sharpens to full opacity the instant it settles into place.
      var img = frame.querySelector('.frame__img')
      if (img) {
        var featherPx = FEATHER_PX * gsap.utils.clamp(0, 1, -t / 0.1)
        var maskCss =
          featherPx > 0.5
            ? 'linear-gradient(to right, transparent 0px, #000 ' + featherPx.toFixed(0) + 'px)'
            : 'none'
        img.style.maskImage = maskCss
        img.style.webkitMaskImage = maskCss
      }
    })

    rightFrames.forEach(function (frame, i) {
      var offset = activeFloat - i
      var hasNext = i < N - 1
      // entering: slides in fully from below. once active, it only parallaxes
      // a further REST_DRIFT% upward while the next frame covers it. the last
      // frame has nothing covering it, so it just holds still once settled.
      var amount =
        offset <= 0
          ? gsap.utils.clamp(0, 100, -offset * 100)
          : hasNext
            ? -REST_DRIFT * gsap.utils.clamp(0, 1, offset)
            : 0
      gsap.set(frame, { yPercent: amount })

      // once covered, the outgoing product dims slightly to read as fading out.
      var dim = frame.querySelector('.frame__dim')
      if (dim) {
        dim.style.opacity = hasNext && offset > 0 ? DIM_MAX * gsap.utils.clamp(0, 1, offset) : 0
      }
    })

    var idx = gsap.utils.clamp(0, N - 1, Math.round(activeFloat))
    if (idx !== currentIndex) {
      currentIndex = idx
    }
  }

  layout(0)

  var mm = gsap.matchMedia()

  mm.add('(min-width: 861px)', function () {
    var track = document.getElementById('showcaseTrack')
    track.style.height = VH_PER_FRAME * TRANSITIONS + 'vh'

    mainST = ScrollTrigger.create({
      trigger: '#showcaseTrack',
      start: 'top top',
      end: 'bottom bottom',
      pin: '.showcase-pin',
      pinSpacing: false,
      scrub: reduceMotion ? false : SCRUB_SMOOTHNESS,
      snap: reduceMotion
        ? false
        : {
            snapTo: gsap.utils.snap(1 / TRANSITIONS),
            duration: 0.35,
            delay: SNAP_DELAY,
            ease: 'power1.inOut',
          },
      onUpdate: function (self) {
        layout(self.progress)
        // parked exactly at the last frame: arm the handoff so the next
        // deliberate scroll (not the snap settling here) moves to the next section.
        if (self.progress >= 1) {
          armHandoff()
        } else {
          disarmHandoff()
        }
      },
    })

    return function () {
      disarmHandoff()
      if (mainST) {
        mainST.kill()
        mainST = null
      }
      track.style.height = ''
    }
  })

  /* ---------- stories carousel ---------- */
  ;(function () {
    var section = document.getElementById('stories')
    if (!section) return

    var testimonials = [
      {
        name: 'David Anderson',
        role: 'Studio Manager',
        quote:
          'From the premium materials to the flawless finish, every detail feels carefully crafted. It brings quiet comfort and confidence to a nine-hour day.',
        img: 'https://i.pravatar.cc/400?img=13',
      },
      {
        name: 'Martin Mitchell',
        role: 'Interior Designer',
        quote:
          'The quality exceeded every expectation. Thoughtful in every detail, the Arvand has become the anchor piece of our studio.',
        img: 'https://i.pravatar.cc/400?img=51',
      },
      {
        name: 'Elena Rossi',
        role: 'Product Lead',
        quote:
          'Eight hours in and my back still thanks me. The recline mechanism alone is worth the switch.',
        img: 'https://i.pravatar.cc/400?img=47',
      },
      {
        name: 'Owen Baxter',
        role: 'Founder, Baxter & Co',
        quote:
          "We outfitted the whole studio in a week. Every hire since has asked where it's from.",
        img: 'https://i.pravatar.cc/400?img=14',
      },
      {
        name: 'Priya Nair',
        role: 'Architect',
        quote:
          'Precision engineering you can actually feel. It moves with you instead of against you.',
        img: 'https://i.pravatar.cc/400?img=44',
      },
      {
        name: 'Tom Richter',
        role: 'Creative Director',
        quote:
          'Understated, well-made, endlessly adjustable — exactly what a chair should be and rarely is.',
        img: 'https://i.pravatar.cc/400?img=52',
      },
    ]
    var N = testimonials.length

    // slot geometry, expressed as % of the .stories-visual box so it stays
    // responsive without a resize listener.
    // top = previous, tucked top-left and behind the main photo (lower z).
    // bottom = next, bottom-right and in front of the main photo (higher z).
    var SLOTS = {
      center: {
        left: '8.7%',
        top: '18.3%',
        width: '65.2%',
        height: '63.3%',
        radius: '28px',
        z: 2,
        opacity: 1,
      },
      top: {
        left: '-4%',
        top: '0%',
        width: '28.3%',
        height: '21.7%',
        radius: '24px',
        z: 1,
        opacity: 1,
      },
      bottom: {
        left: '60%',
        top: '75%',
        width: '32.6%',
        height: '25%',
        radius: '24px',
        z: 4,
        opacity: 1,
      },
      offBelow: {
        left: '88%',
        top: '113%',
        width: '32.6%',
        height: '25%',
        radius: '24px',
        z: 4,
        opacity: 0,
      },
      offAbove: {
        left: '-34%',
        top: '-24%',
        width: '28.3%',
        height: '21.7%',
        radius: '24px',
        z: 1,
        opacity: 0,
      },
    }

    var photoEls = gsap.utils.toArray('#stories .stories-photo')
    var elTop = photoEls[0],
      elCenter = photoEls[1],
      elBottom = photoEls[2]
    var centerIndex = 0
    var animating = false

    var quoteEl = document.getElementById('storiesQuote')
    var nameEl = document.getElementById('storiesName')
    var roleEl = document.getElementById('storiesRole')
    var countEl = document.getElementById('storiesCount')
    var btnPrev = section.querySelector('.stories-btn--prev')
    var btnNext = section.querySelector('.stories-btn--next')

    function setImg(el, item) {
      var img = el.querySelector('img')
      img.src = item.img
      img.alt = item.name
    }

    function applySlot(el, spec, animate) {
      var vars = {
        left: spec.left,
        top: spec.top,
        width: spec.width,
        height: spec.height,
        borderRadius: spec.radius,
        zIndex: spec.z,
        opacity: spec.opacity,
      }
      if (animate) {
        gsap.to(el, Object.assign({ duration: 0.75, ease: 'power3.inOut' }, vars))
      } else {
        gsap.set(el, vars)
      }
    }

    function pad(n) {
      return n < 10 ? '0' + n : String(n)
    }

    function renderText(item, animate) {
      var count = pad(centerIndex + 1) + ' / ' + pad(N)
      if (!animate) {
        quoteEl.textContent = '“' + item.quote + '”'
        nameEl.textContent = item.name
        roleEl.textContent = item.role
        countEl.textContent = count
        return
      }
      gsap.to([quoteEl, nameEl, roleEl], {
        autoAlpha: 0,
        y: 8,
        duration: 0.22,
        ease: 'power2.in',
        onComplete: function () {
          quoteEl.textContent = '“' + item.quote + '”'
          nameEl.textContent = item.name
          roleEl.textContent = item.role
          countEl.textContent = count
          gsap.to([quoteEl, nameEl, roleEl], {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
          })
        },
      })
    }

    function setLock(locked) {
      animating = locked
      btnPrev.disabled = locked
      btnNext.disabled = locked
    }

    function goNext() {
      if (animating) return
      setLock(true)
      centerIndex = (centerIndex + 1) % N

      var incoming = elTop
      setImg(incoming, testimonials[(centerIndex + 1) % N])
      applySlot(incoming, SLOTS.offBelow, false)

      applySlot(elCenter, SLOTS.top, true)
      applySlot(elBottom, SLOTS.center, true)
      applySlot(incoming, SLOTS.bottom, true)

      elTop = elCenter
      elCenter = elBottom
      elBottom = incoming

      renderText(testimonials[centerIndex], true)
      gsap.delayedCall(0.75, function () {
        setLock(false)
      })
    }

    function goPrev() {
      if (animating) return
      setLock(true)
      centerIndex = (centerIndex - 1 + N) % N

      var incoming = elBottom
      setImg(incoming, testimonials[(centerIndex - 1 + N) % N])
      applySlot(incoming, SLOTS.offAbove, false)

      applySlot(elCenter, SLOTS.bottom, true)
      applySlot(elTop, SLOTS.center, true)
      applySlot(incoming, SLOTS.top, true)

      elBottom = elCenter
      elCenter = elTop
      elTop = incoming

      renderText(testimonials[centerIndex], true)
      gsap.delayedCall(0.75, function () {
        setLock(false)
      })
    }

    // initial paint — no animation
    setImg(elTop, testimonials[(centerIndex - 1 + N) % N])
    setImg(elCenter, testimonials[centerIndex])
    setImg(elBottom, testimonials[(centerIndex + 1) % N])
    applySlot(elTop, SLOTS.top, false)
    applySlot(elCenter, SLOTS.center, false)
    applySlot(elBottom, SLOTS.bottom, false)
    renderText(testimonials[centerIndex], false)

    btnNext.addEventListener('click', goNext)
    btnPrev.addEventListener('click', goPrev)
  })()

  /* ---------- newsletter form ---------- */
  var newsForm = document.getElementById('newsForm')
  newsForm.addEventListener('submit', function (e) {
    e.preventDefault()
    var btn = newsForm.querySelector('button')
    var original = btn.textContent
    btn.textContent = 'Subscribed'
    setTimeout(function () {
      btn.textContent = original
      newsForm.reset()
    }, 2200)
  })
})()
