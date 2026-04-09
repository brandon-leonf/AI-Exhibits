import { useEffect, useRef, useState } from 'react'
import './App.css'
const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Exhibits', href: '#exhibits' },
  { label: 'About', href: '#about' },
]

const exhibitPreviewItems = [
  {
    title: 'The Idea Begins',
    body:
      'The origin of artificial intelligence as a theoretical concept, from early questions about machine thought to the first formal frameworks.',
  },
  {
    title: 'Early AI Research',
    body:
      'The first systems, experiments, and limitations of early AI, including symbolic reasoning, expert systems, and the first AI winters.',
  },
  {
    title: 'AI in Everyday Life',
    body:
      'How artificial intelligence moved into ordinary experiences through search, ranking systems, recommendations, speech tools, and mobile devices.',
  },
  {
    title: 'The Modern AI Revolution',
    body:
      'The rise of powerful machine learning systems, deep neural networks, large-scale compute, and the rapid acceleration of AI capability.',
  },
  {
    title: 'The Future of AI',
    body:
      'The possibilities, risks, and direction of artificial intelligence as society navigates autonomy, creativity, governance, and human collaboration.',
  },
]

const timelineSlides = [
  {
    era: '1950',
    title: 'The Idea Begins',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/c/ce/Alan_turing_header.jpg',
    alt: 'Portrait of Alan Turing',
    body:
      'The modern conversation about artificial intelligence begins when Alan Turing asks whether machines can think. His 1950 paper reframed intelligence as something that could be tested, modeled, and eventually engineered.',
    points: [
      'Turing proposes the imitation game, later called the Turing Test.',
      'Researchers begin linking logic, language, and computation to human reasoning.',
      'The field gains a conceptual foundation before the term AI is formally popularized in 1956.',
    ],
  },
  {
    era: '1960s-1980s',
    title: 'Early Research',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/c/c3/SRI_Shakey_robot%2C_1969%2C_Computer_History_Museum.jpg',
    alt: 'Shakey the robot at SRI',
    body:
      'Early AI labs produce programs that solve algebra, simulate conversation, and reason about simple environments. Systems such as ELIZA and Shakey the robot show what is possible, but hardware limits and scarce data keep progress uneven.',
    points: [
      'Rule-based systems and symbolic reasoning dominate the first wave of AI research.',
      'Expert systems perform well in narrow tasks but struggle outside carefully defined domains.',
      'Periods of high optimism are followed by funding cuts known as AI winters.',
    ],
  },
  {
    era: '2000s',
    title: 'Everyday Integration',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/2/23/Google_Search_screenshot_in_2025_%28EN%29.png',
    alt: 'Google Search interface',
    body:
      'Artificial intelligence becomes part of ordinary digital life. Search ranking, recommendations, spam filtering, ad targeting, and voice features begin shaping what people see, buy, and use every day, often without being labeled as AI.',
    points: [
      'Search engines use learning systems to improve relevance at web scale.',
      'Recommendation models personalize music, shopping, video, and social feeds.',
      'Early assistants and mobile computing normalize AI-driven convenience.',
    ],
  },
  {
    era: '2010s',
    title: 'Machine Learning Growth',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/2/26/Deep_Learning.jpg',
    alt: 'Visualization representing deep learning',
    body:
      'The 2010s mark a major acceleration. Larger datasets, GPU computing, and breakthroughs in deep learning make AI dramatically better at image recognition, language processing, translation, speech, and strategic decision-making.',
    points: [
      'ImageNet-era breakthroughs prove that deep neural networks can outperform earlier approaches.',
      'Systems such as AlphaGo and modern speech recognition show rapid capability gains.',
      'Cloud infrastructure makes advanced training more accessible to startups and research labs.',
    ],
  },
  {
    era: '2020s',
    title: 'Generative AI Era',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/8/82/Astronaut_Riding_a_Horse_%28SD3.5%29.webp',
    alt: 'AI-generated artwork from a text-to-image model',
    body:
      'Generative AI pushes the field into mainstream culture. Large language models and image generators can now create text, code, pictures, and workflows used by millions of people in schools, offices, studios, and products.',
    points: [
      'AI systems move from classification and prediction into content generation.',
      'Chatbots, copilots, and multimodal tools reshape how people learn and work.',
      'Debates about safety, jobs, copyright, and governance become central to AI adoption.',
    ],
  },
  {
    era: '2026',
    title: 'Agentic AI in Production',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Google_AI_Studio_icon_%28July_2025%29.svg/960px-Google_AI_Studio_icon_%28July_2025%29.svg.png',
    alt: 'Google AI Studio icon representing modern AI tooling',
    body:
      'By 2026, the conversation expands beyond chat into agentic AI: systems that can reason across steps, use tools, work with files, and help complete real tasks inside software workflows. AI becomes less of a demo and more of an operational layer.',
    points: [
      'More platforms position AI as a coworker that can plan, execute, and coordinate multistep work.',
      'Security, supervision, and prompt-injection defenses become a core design challenge for deployed agents.',
      'The field shifts toward AI-native products where assistance is embedded directly into research, coding, and enterprise operations.',
    ],
  },
]

const featuredInnovator = {
  name: 'Alan Turing',
  role: 'Mathematician, logician, and early AI visionary',
  image:
    'https://upload.wikimedia.org/wikipedia/commons/c/ce/Alan_turing_header.jpg',
  alt: 'Portrait of Alan Turing',
  summary:
    'Alan Turing helped define the intellectual foundations of artificial intelligence by asking whether machines could think and by treating reasoning as something that computation could model.',
  highlights: [
    'Published “Computing Machinery and Intelligence” in 1950, introducing the question that shaped the field.',
    'Inspired later work in machine reasoning, language, symbolic logic, and intelligent systems.',
    'Remains one of the most referenced figures in the history of AI, computer science, and modern computation.',
  ],
}

const whyItMattersCards = [
  {
    title: 'Daily Decisions',
    body:
      'AI already shapes what people read, watch, buy, and trust through ranking, recommendation, filtering, and prediction systems.',
  },
  {
    title: 'Work and Creativity',
    body:
      'From code generation to design tools and research support, AI changes how individuals and teams create, analyze, and produce work.',
  },
  {
    title: 'Responsibility',
    body:
      'Understanding AI history helps people ask better questions about fairness, safety, labor, transparency, and who benefits from automation.',
  },
]

const heroUpdatedText = 'Updated Apr 7, 2026'
const introHeadingText =
  'Pioneering AI research to transform theory into real-world systems.'

export default function App() {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const heroOrbSceneRef = useRef(null)
  const heroArticleRef = useRef(null)
  const [typedUpdatedText, setTypedUpdatedText] = useState(
    prefersReducedMotion ? heroUpdatedText : '',
  )
  const [typingComplete, setTypingComplete] = useState(prefersReducedMotion)
  const [typedIntroHeading, setTypedIntroHeading] = useState(
    prefersReducedMotion ? introHeadingText : '',
  )
  const [introTypingComplete, setIntroTypingComplete] = useState(prefersReducedMotion)
  const [activeTimelineSlide, setActiveTimelineSlide] = useState(0)
  const [timelinePaused, setTimelinePaused] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion) {
      return
    }

    let currentIndex = 0
    const timer = window.setInterval(() => {
      currentIndex += 1
      setTypedUpdatedText(heroUpdatedText.slice(0, currentIndex))

      if (currentIndex >= heroUpdatedText.length) {
        window.clearInterval(timer)
        setTypingComplete(true)
      }
    }, 55)

    return () => window.clearInterval(timer)
  }, [prefersReducedMotion])

  useEffect(() => {
    if (prefersReducedMotion) {
      return
    }

    let currentIndex = 0
    let timer = 0

    const startDelay = window.setTimeout(() => {
      timer = window.setInterval(() => {
        currentIndex += 1
        setTypedIntroHeading(introHeadingText.slice(0, currentIndex))

        if (currentIndex >= introHeadingText.length) {
          window.clearInterval(timer)
          setIntroTypingComplete(true)
        }
      }, 26)
    }, 280)

    return () => {
      window.clearTimeout(startDelay)
      if (timer) {
        window.clearInterval(timer)
      }
    }
  }, [prefersReducedMotion])

  useEffect(() => {
    if (prefersReducedMotion) {
      return
    }

    let frameId = 0

    const updateParallax = () => {
      frameId = 0
      const scrollY = window.scrollY
      const articleShift = Math.min(scrollY * 0.14, 56)
      const orbShift = Math.min(scrollY * 0.08, 36)

      heroArticleRef.current?.style.setProperty('--hero-parallax-y', `${articleShift}px`)
      heroOrbSceneRef.current?.style.setProperty('--hero-scene-shift', `${orbShift}px`)
    }

    const handleScroll = () => {
      if (!frameId) {
        frameId = window.requestAnimationFrame(updateParallax)
      }
    }

    updateParallax()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }
      window.removeEventListener('scroll', handleScroll)
    }
  }, [prefersReducedMotion])

  useEffect(() => {
    if (prefersReducedMotion || timelinePaused) {
      return
    }

    const timer = window.setInterval(() => {
      setActiveTimelineSlide((current) => (current + 1) % timelineSlides.length)
    }, 4200)

    return () => window.clearInterval(timer)
  }, [prefersReducedMotion, timelinePaused])

  const goToNextTimelineSlide = () => {
    setActiveTimelineSlide((current) => (current + 1) % timelineSlides.length)
  }

  const goToPreviousTimelineSlide = () => {
    setActiveTimelineSlide((current) =>
      current === 0 ? timelineSlides.length - 1 : current - 1,
    )
  }

  return (
    <div className="page-shell" id="home">
      <div className="page-noise" aria-hidden="true" />
      <div className="page-grid" aria-hidden="true" />

      <div className="hero-screen">
        <div className="hero-orb-scene" aria-hidden="true" ref={heroOrbSceneRef}>
          <div className="hero-ai-cloud">
            <span className="hero-ai-lettering">AI</span>
          </div>
          <div className="hero-orb hero-orb-main" />
          <div className="hero-orb hero-orb-top" />
          <div className="hero-orb hero-orb-bottom" />
          <div className="hero-orb hero-orb-far" />
        </div>

        <header className="site-header">
          <nav className="site-nav" aria-label="Primary">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="nav-link">
                {item.label}
              </a>
            ))}
          </nav>

          <a className="brand-badge" href="#home" aria-label="AI Evolution home">
            <span>AI Evolution</span>
          </a>

          <a className="launch-button" href="#timeline">
            View Timeline
          </a>
        </header>

        <section className="hero-section" id="about">
          <div className="hero-article-shell" ref={heroArticleRef}>
            <div className="hero-article">
              <div className="hero-divider" aria-hidden="true" />

              <div className="hero-meta">
                <span
                  className={`typed-meta${typingComplete ? ' is-complete' : ''}`}
                  aria-label={heroUpdatedText}
                >
                  {typedUpdatedText}
                </span>
                <span>by AI Share Core Team</span>
              </div>

              <div className="hero-story">
                <p className="eyebrow">Exhibit / Artificial intelligence</p>
                <h1>History and Evolution of AI</h1>
                <p className="hero-text">
                  Trace the journey of artificial intelligence from early symbolic
                  reasoning and expert systems to machine learning, deep neural
                  networks, and the generative models shaping modern technology.
                </p>

                <div className="hero-actions">
                  <a className="button button-primary" href="#timeline">
                    View Timeline
                  </a>
                  <a className="button button-secondary" href="#exhibits">
                    Explore Platform
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <main>
        <section className="intro-section" id="intro">
          <div className="intro-shell">
            <div className="intro-left">
              <div className="intro-pill">
                <span className="intro-pill-dot" aria-hidden="true" />
                <span>About This Exhibit</span>
              </div>

              <h2
                className={`typed-heading${introTypingComplete ? ' is-complete' : ''}`}
                aria-label={introHeadingText}
              >
                {typedIntroHeading}
              </h2>
            </div>

            <div className="intro-right">
              <p className="intro-lead">
                This exhibit explores how artificial intelligence evolved from
                foundational ideas and laboratory experiments into practical tools
                that shape science, industry, and daily life.
              </p>
            </div>
          </div>
        </section>

        <section
          className="timeline-section"
          id="timeline"
          onMouseEnter={() => setTimelinePaused(true)}
          onMouseLeave={() => setTimelinePaused(false)}
        >
          <div className="timeline-shell">
            <div className="timeline-header">
              <p className="eyebrow">Timeline / evolution of AI</p>
              <h2>From theory to generative systems</h2>
              <p className="timeline-intro">
                Explore the key eras that transformed artificial intelligence from
                an academic question into a global technological force.
              </p>
            </div>

            <div className="timeline-carousel">
              <button
                className="timeline-arrow timeline-arrow-prev"
                type="button"
                onClick={goToPreviousTimelineSlide}
                aria-label="Previous timeline slide"
              >
                Prev
              </button>

              <div className="timeline-stage">
                <div
                  className="timeline-track"
                  style={{ transform: `translateX(-${activeTimelineSlide * 100}%)` }}
                >
                  {timelineSlides.map((slide) => (
                    <article className="timeline-card" key={slide.era}>
                      <div className="timeline-card-media">
                        <img
                          src={slide.image}
                          alt={slide.alt}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>

                      <div className="timeline-card-body">
                        <p className="timeline-era">{slide.era}</p>
                        <h3>{slide.title}</h3>
                        <p>{slide.body}</p>

                        <ul className="timeline-points">
                          {slide.points.map((point) => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <button
                className="timeline-arrow timeline-arrow-next"
                type="button"
                onClick={goToNextTimelineSlide}
                aria-label="Next timeline slide"
              >
                Next
              </button>
            </div>

            <div className="timeline-pagination" aria-label="Timeline slide navigation">
              {timelineSlides.map((slide, index) => (
                <button
                  key={slide.era}
                  type="button"
                  className={`timeline-dot${index === activeTimelineSlide ? ' is-active' : ''}`}
                  onClick={() => setActiveTimelineSlide(index)}
                  aria-label={`Go to ${slide.era}`}
                  aria-pressed={index === activeTimelineSlide}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="exhibits-section" id="exhibits">
          <div className="exhibits-shell">
            <div className="exhibits-content">
              <div className="section-heading">
                <p className="eyebrow">Exhibits Preview</p>
                <h2>
                  Explore key moments in the development of artificial intelligence
                  through a series of curated exhibits.
                </h2>
                <p className="exhibits-copy">
                  Move through defining eras of AI history, from foundational ideas
                  and early research labs to the systems, products, and debates
                  shaping the field today.
                </p>
              </div>

              <div className="exhibits-button-wrap">
                <a className="button button-primary" href="#timeline">
                  Browse Timeline
                </a>
              </div>

              <div className="exhibits-counter">
                <h3>05</h3>
                <h4>Featured exhibits</h4>
                <p>A compact preview of the major themes visitors will explore.</p>
              </div>
            </div>

            <div className="exhibits-list">
              {exhibitPreviewItems.map((item, index) => (
                <article
                  key={item.title}
                  className="exhibit-item"
                  style={{ '--exhibit-delay': `${index * 90}ms` }}
                >
                  <div className="exhibit-index" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="exhibit-text">
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="innovator-section" id="innovator">
          <div className="innovator-shell">
            <div className="innovator-media">
              <img
                src={featuredInnovator.image}
                alt={featuredInnovator.alt}
                className="innovator-image"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="innovator-content">
              <p className="eyebrow">Featured Innovator</p>
              <h2>{featuredInnovator.name}</h2>
              <p className="innovator-role">{featuredInnovator.role}</p>
              <p className="innovator-summary">{featuredInnovator.summary}</p>

              <ul className="innovator-highlights">
                {featuredInnovator.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="why-section" id="why-it-matters">
          <div className="why-shell">
            <div className="why-content">
              <p className="eyebrow">Why It Matters</p>
              <h2>Artificial intelligence is not just a technology story. It is a human one.</h2>
              <p className="why-copy">
                Learning how AI evolved helps people understand why it matters now.
                The systems discussed in this exhibit influence communication,
                creativity, labor, access to information, and the way societies
                make decisions about the future.
              </p>
            </div>

            <div className="why-cards">
              {whyItMattersCards.map((card) => (
                <article key={card.title} className="why-card">
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <footer className="site-footer">
          <div className="footer-shell">
            <div className="footer-brand">
              <p className="eyebrow">AI Evolution</p>
              <h2>Tracing the past, present, and future of artificial intelligence.</h2>
            </div>

            <nav className="footer-nav" aria-label="Footer">
              <a href="#home">Home</a>
              <a href="#timeline">Timeline</a>
              <a href="#exhibits">Exhibits</a>
              <a href="#innovator">Innovator</a>
              <a href="#why-it-matters">Why It Matters</a>
            </nav>

            <div className="footer-note">
              <p>Built as a curated digital exhibit on the history and evolution of AI.</p>
              <p>2026 AI Evolution. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
