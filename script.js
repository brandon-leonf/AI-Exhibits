document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches

  setupTypedText('.typed-meta', 55, 0, prefersReducedMotion)
  setupTypedText('.typed-heading', 26, 280, prefersReducedMotion)
  setupHeroParallax(prefersReducedMotion)
  setupTimelineCarousel(prefersReducedMotion)
})

function setupTypedText(selector, speed, delay, prefersReducedMotion) {
  const element = document.querySelector(selector)

  if (!element) {
    return
  }

  const fullText = element.dataset.text || ''

  if (prefersReducedMotion) {
    element.textContent = fullText
    element.classList.add('is-complete')
    return
  }

  element.textContent = ''

  window.setTimeout(() => {
    let currentIndex = 0

    const timer = window.setInterval(() => {
      currentIndex += 1
      element.textContent = fullText.slice(0, currentIndex)

      if (currentIndex >= fullText.length) {
        window.clearInterval(timer)
        element.classList.add('is-complete')
      }
    }, speed)
  }, delay)
}

function setupHeroParallax(prefersReducedMotion) {
  if (prefersReducedMotion) {
    return
  }

  const heroArticle = document.querySelector('.hero-article-shell')
  const orbScene = document.querySelector('.hero-orb-scene')

  if (!heroArticle || !orbScene) {
    return
  }

  let frameId = 0

  const updateParallax = () => {
    frameId = 0

    const scrollY = window.scrollY
    const articleShift = Math.min(scrollY * 0.14, 56)
    const orbShift = Math.min(scrollY * 0.08, 36)

    heroArticle.style.setProperty('--hero-parallax-y', `${articleShift}px`)
    orbScene.style.setProperty('--hero-scene-shift', `${orbShift}px`)
  }

  const handleScroll = () => {
    if (!frameId) {
      frameId = window.requestAnimationFrame(updateParallax)
    }
  }

  updateParallax()
  window.addEventListener('scroll', handleScroll, { passive: true })
}

function setupTimelineCarousel(prefersReducedMotion) {
  const timelineSection = document.querySelector('.timeline-section')
  const timelineTrack = document.querySelector('.timeline-track')
  const previousButton = document.querySelector('.timeline-arrow-prev')
  const nextButton = document.querySelector('.timeline-arrow-next')
  const dots = Array.from(document.querySelectorAll('.timeline-dot'))

  if (
    !timelineSection ||
    !timelineTrack ||
    !previousButton ||
    !nextButton ||
    dots.length === 0
  ) {
    return
  }

  const slideCount = timelineTrack.children.length
  let activeIndex = 0
  let autoplayTimer = null
  let isPaused = false

  const updateSlide = (index) => {
    activeIndex = (index + slideCount) % slideCount
    timelineTrack.style.transform = `translateX(-${activeIndex * 100}%)`

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeIndex
      dot.classList.toggle('is-active', isActive)
      dot.setAttribute('aria-pressed', String(isActive))
    })
  }

  const stopAutoplay = () => {
    if (autoplayTimer) {
      window.clearInterval(autoplayTimer)
      autoplayTimer = null
    }
  }

  const startAutoplay = () => {
    if (prefersReducedMotion || isPaused) {
      return
    }

    stopAutoplay()
    autoplayTimer = window.setInterval(() => {
      updateSlide(activeIndex + 1)
    }, 4200)
  }

  previousButton.addEventListener('click', () => {
    updateSlide(activeIndex - 1)
    startAutoplay()
  })

  nextButton.addEventListener('click', () => {
    updateSlide(activeIndex + 1)
    startAutoplay()
  })

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      updateSlide(Number(dot.dataset.index))
      startAutoplay()
    })
  })

  timelineSection.addEventListener('mouseenter', () => {
    isPaused = true
    stopAutoplay()
  })

  timelineSection.addEventListener('mouseleave', () => {
    isPaused = false
    startAutoplay()
  })

  updateSlide(0)
  startAutoplay()
}
