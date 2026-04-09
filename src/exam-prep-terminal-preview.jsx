import { useState, useEffect, useCallback } from "react";

const TOPICS = {
  probability: "Probability Models",
  counting: "Counting Techniques",
  distributions: "Random Variables & Distributions",
  hypothesis: "Hypothesis Testing",
  regression: "Correlation & Regression",
};

const NOTES = {
  probability: [
    { title: "Outcome & Sample Space", content: "An **outcome** is the result of a random phenomenon. The **sample space S** is the set of ALL possible outcomes.\n\nExample: Toss a coin → S = {H, T}\nToss a coin 4 times → S has 2⁴ = 16 outcomes" },
    { title: "Events", content: "An **event** is any collection (subset) of outcomes from the sample space.\n\nExample: Toss a coin 4 times. Event A = 'exactly 2 heads'\nA = {HHTT, HTHT, HTTH, THHT, THTH, TTHH}" },
    { title: "Union & Intersection", content: "**Union (A∪B)**: at least one of A or B occurs\n**Intersection (A∩B)**: both A and B occur\n**Disjoint/Mutually Exclusive**: A and B share no outcomes → P(A∪B) = P(A) + P(B)" },
    { title: "Axioms & Addition Rule", content: "1. P(A) ≥ 0 for any event A\n2. P(S) = 1\n3. P(∅) = 0\n4. P(Aᶜ) = 1 − P(A)\n5. P(A) ≤ 1\n\n**General Addition Rule**: P(A∪B) = P(A) + P(B) − P(A∩B)" },
  ],
  counting: [
    { title: "Product Rule", content: "If first element can be chosen n₁ ways and second n₂ ways → **n₁ × n₂ pairs**.\n\nGeneralized for k elements: n₁ × n₂ × … × nₖ k-tuples." },
    { title: "Factorial", content: "n! = n(n−1)(n−2)…(2)(1),  0! = 1\n\nRepresents rearrangements of ALL n items.\nEx: 5! = 120,  10! = 3,628,800" },
    { title: "Permutation", content: "Ordered selection of r items from n:\n\n**ₙPᵣ = n! / (n−r)!**\n\nOrder matters! Ex: Choose president & VP from 5 people = ₅P₂ = 20" },
    { title: "Combination", content: "Unordered selection of r items from n:\n\n**ₙCᵣ = n! / [(n−r)! × r!]  =  C(n,r)**\n\nOrder does NOT matter! Ex: Choose 2 members from 5 = C(5,2) = 10" },
  ],
  distributions: [
    { title: "Random Variable", content: "A **random variable** is a function mapping each outcome in the sample space to a numeric value.\n\nExample: X = number of heads in 2 coin tosses. S = {HT, HH, TH, TT} → X = {1, 2, 1, 0}" },
    { title: "Bernoulli Distribution", content: "Experiment with only two outcomes (success/failure).\n\n**X ~ Bernoulli(p)**\np(0) = P(X=0) = 1−p  (failure)\np(1) = P(X=1) = p   (success)\n\n**Mean**: E[X] = p\n**Variance**: Var(X) = p(1−p)" },
    { title: "Binomial Distribution", content: "X = count of successes in n independent Bernoulli trials.\n\n**X ~ B(n, p)**\nP(X=k) = C(n,k) × pᵏ × (1−p)ⁿ⁻ᵏ\n\n**Mean**: μ = np\n**Std Dev**: σ = √[np(1−p)]" },
    { title: "Geometric Distribution", content: "X = number of trials to get the FIRST success.\n\n**X ~ Geo(p)**\np(x) = P(X=x) = p(1−p)ˣ⁻¹,  x = 1, 2, 3, …\n\n**Mean**: E[X] = 1/p\n**Variance**: Var(X) = (1−p)/p²" },
  ],
  hypothesis: [
    { title: "4 Steps of Significance Testing", content: "1. **Specify** H₀ (null) and Hₐ (alternative) hypotheses\n2. **Calculate** the test statistic\n3. **Find** the P-value (or rejection region)\n4. **State** a complete conclusion" },
    { title: "Z-Test for Population Mean", content: "Use when σ is known (or n > 30).\n\n**Z = (x̄ − μ₀) / (σ/√n)**\n\nHₐ: μ > μ₀ → P-value = P(Z > z)\nHₐ: μ < μ₀ → P-value = P(Z < z)\nHₐ: μ ≠ μ₀ → P-value = 2P(Z > |z|)" },
    { title: "T-Test (Small Sample, σ Unknown)", content: "Use when σ is UNKNOWN and sample is small.\n\n**t = (x̄ − μ₀) / (s/√n)** with df = n−1\n\nSame P-value logic as z-test but use t-distribution table." },
    { title: "Z-Test for Proportion", content: "Testing H₀: p = p₀\n\n**z = (p̂ − p₀) / √[p₀(1−p₀)/n]**\n\nWhere p̂ = sample proportion = X/n" },
    { title: "P-value & Significance", content: "The **P-value** = probability of getting a test statistic as extreme as observed, assuming H₀ is true.\n\n**Decision Rule**: If P-value ≤ α → Reject H₀\nTypically α = 0.05 or α = 0.01\n\nSmaller P-value = stronger evidence against H₀" },
  ],
  regression: [
    { title: "Explanatory vs Response Variable", content: "In two-variable studies, **x** is typically the explanatory (predictor) variable and **y** is the response (outcome) variable.\n\nIn a scatterplot, explanatory variable goes on the x-axis and response variable goes on the y-axis." },
    { title: "Association in Scatterplots", content: "**Positive association**: larger x tends to go with larger y.\n**Negative association**: larger x tends to go with smaller y.\n\nScatterplots help visualize direction and form of the relationship." },
    { title: "Correlation Coefficient (r)", content: "Correlation **r** measures direction and strength of a **linear** relationship.\n\nRange: **−1 ≤ r ≤ 1**\n- r close to 1: strong positive linear association\n- r close to −1: strong negative linear association\n- r near 0: weak/no linear association\n\nOutliers can strongly affect r." },
    { title: "Least Squares Line, Residual, and R²", content: "Regression line form: **y-hat = a + bx**\n- **b (slope)**: estimated change in y for a 1-unit increase in x\n- **a (intercept)**: predicted y when x = 0\n\n**Residual = observed − predicted**\n\n**R² = SSR/SST = r²** gives the proportion of y-variation explained by x." },
  ],
};

const ALL_QUESTIONS = [
  // ── EASY ──
  { id: 1, difficulty: "easy", topic: "probability", type: "mcq",
    question: "What is the sample space S when you toss a fair coin once?",
    options: ["S = {0, 1}", "S = {H, T}", "S = {HH, HT, TH, TT}", "S = {1, 2}"],
    answer: 1, explanation: "The sample space S is the set of ALL possible outcomes. One coin toss yields exactly two outcomes: Heads or Tails." },
  { id: 2, difficulty: "easy", topic: "probability", type: "mcq",
    question: "Events A and B are called 'mutually exclusive' (disjoint) when:",
    options: ["P(A) = P(B)", "They share no common outcomes", "P(A∩B) = 1", "A is a subset of B"],
    answer: 1, explanation: "Disjoint events share no outcomes in common. This means A∩B = ∅, so P(A∩B) = 0." },
  { id: 3, difficulty: "easy", topic: "probability", type: "mcq",
    question: "For any event A in sample space S, which is ALWAYS true?",
    options: ["P(A) = 0.5", "P(A) + P(Aᶜ) = 1", "P(A) > P(Aᶜ)", "P(A) = 1"],
    answer: 1, explanation: "By the complement rule (Axiom 4): P(A) + P(Aᶜ) = 1. This is always true." },
  { id: 4, difficulty: "easy", topic: "distributions", type: "mcq",
    question: "A random variable X follows X ~ Bernoulli(p). What is E[X]?",
    options: ["p(1−p)", "p²", "p", "1/p"],
    answer: 2, explanation: "For X ~ Bernoulli(p): E[X] = p and Var(X) = p(1−p)." },
  { id: 5, difficulty: "easy", topic: "distributions", type: "mcq",
    question: "Which distribution describes the count of successes in n independent trials with constant probability p?",
    options: ["Geometric", "Bernoulli", "Binomial", "Normal"],
    answer: 2, explanation: "Binomial distribution B(n, p) counts successes in n independent trials. Bernoulli is just B(1, p)." },
  { id: 6, difficulty: "easy", topic: "hypothesis", type: "mcq",
    question: "The null hypothesis H₀ typically states:",
    options: ["What the investigator wishes to prove", "No effect or no difference", "That the P-value < α", "The alternative claim"],
    answer: 1, explanation: "H₀ is the statement being tested — usually 'no effect' or 'no difference'. The alternative Hₐ is what the investigator wants to establish." },
  { id: 7, difficulty: "easy", topic: "hypothesis", type: "mcq",
    question: "If P-value = 0.003 and α = 0.05, what is your conclusion?",
    options: ["Fail to reject H₀", "Reject H₀", "Accept H₀", "Cannot determine"],
    answer: 1, explanation: "Since P-value (0.003) < α (0.05), we REJECT H₀. The evidence against H₀ is statistically significant." },
  { id: 8, difficulty: "easy", topic: "counting", type: "mcq",
    question: "What is 5!?",
    options: ["25", "60", "120", "100"],
    answer: 2, explanation: "5! = 5 × 4 × 3 × 2 × 1 = 120" },
  { id: 9, difficulty: "easy", topic: "counting", type: "mcq",
    question: "How many ways can you arrange 3 distinct books on a shelf?",
    options: ["3", "6", "9", "12"],
    answer: 1, explanation: "3! = 3 × 2 × 1 = 6 ways. This is the number of permutations of all 3 items." },
  { id: 10, difficulty: "easy", topic: "distributions", type: "mcq",
    question: "X ~ Geo(p) models the number of trials until the first success. What is E[X]?",
    options: ["p", "p²", "1/p", "1−p"],
    answer: 2, explanation: "For X ~ Geo(p): E[X] = 1/p. If p = 0.5, you expect 2 trials on average to get the first success." },

  // ── MEDIUM ──
  { id: 11, difficulty: "medium", topic: "probability", type: "mcq",
    question: "P(A) = 0.5, P(B) = 0.4, P(A∩B) = 0.2. Find P(A∪B).",
    options: ["0.3", "0.7", "0.9", "0.6"],
    answer: 1, explanation: "General Addition Rule: P(A∪B) = P(A) + P(B) − P(A∩B) = 0.5 + 0.4 − 0.2 = 0.7" },
  { id: 12, difficulty: "medium", topic: "probability", type: "mcq",
    question: "P(A) = 0.5, P(B) = 0.4, P(A∩B) = 0.2. Find P(Aᶜ∩Bᶜ) [neither A nor B].",
    options: ["0.1", "0.3", "0.5", "0.7"],
    answer: 0, explanation: "P(neither) = 1 − P(A∪B) = 1 − 0.7 = 0.1" },
  { id: 13, difficulty: "medium", topic: "counting", type: "mcq",
    question: "How many ways can you choose a president AND a vice-president from 5 candidates?",
    options: ["10", "15", "20", "25"],
    answer: 2, explanation: "Order matters (president ≠ VP), so use Permutation: ₅P₂ = 5!/(5-2)! = 5×4 = 20" },
  { id: 14, difficulty: "medium", topic: "counting", type: "mcq",
    question: "How many ways can you choose 2 members from 5 people (no roles assigned)?",
    options: ["10", "20", "15", "5"],
    answer: 0, explanation: "Order doesn't matter, so use Combination: C(5,2) = 5!/(3!×2!) = 10" },
  { id: 15, difficulty: "medium", topic: "distributions", type: "mcq",
    question: "X ~ B(10, 0.5). What are the mean and standard deviation of X?",
    options: ["μ=5, σ=2.5", "μ=5, σ=√2.5≈1.58", "μ=10, σ=5", "μ=0.5, σ=0.25"],
    answer: 1, explanation: "For X ~ B(n,p): μ = np = 10(0.5) = 5. σ = √[np(1−p)] = √[10(0.5)(0.5)] = √2.5 ≈ 1.58" },
  { id: 16, difficulty: "medium", topic: "distributions", type: "mcq",
    question: "Children each have probability 1/4 of blood type A, independently. 3 children planned. What distribution models X = number with type A?",
    options: ["X ~ Geo(1/4)", "X ~ Bernoulli(1/4)", "X ~ B(3, 1/4)", "X ~ B(4, 1/3)"],
    answer: 2, explanation: "Fixed n=3 trials, constant p=1/4, independent → X ~ Binomial(n=3, p=1/4)" },
  { id: 17, difficulty: "medium", topic: "hypothesis", type: "mcq",
    question: "n=36, x̄=5.5, σ=1.2, testing H₀: μ=5. What is the z-test statistic?",
    options: ["z = 1.5", "z = 2.0", "z = 2.5", "z = 3.0"],
    answer: 2, explanation: "Z = (x̄ − μ₀)/(σ/√n) = (5.5 − 5)/(1.2/√36) = 0.5/(1.2/6) = 0.5/0.2 = 2.5" },
  { id: 18, difficulty: "medium", topic: "hypothesis", type: "mcq",
    question: "A z-test gives z = 2.5 for Hₐ: μ > 5. The P-value = P(Z > 2.5) = 0.0062. With α=0.05, conclude:",
    options: ["Fail to reject H₀", "Reject H₀; evidence μ > 5", "Accept Hₐ unconditionally", "Need more data"],
    answer: 1, explanation: "P-value (0.0062) < α (0.05) → Reject H₀. Strong evidence that μ > 5." },
  { id: 19, difficulty: "medium", topic: "hypothesis", type: "mcq",
    question: "Buffon tossed a coin 4040 times, got 2048 heads. Testing H₀: p=0.5 vs Hₐ: p≠0.5. p̂ = 2048/4040 ≈ 0.5069. The z-statistic is approximately:",
    options: ["z ≈ 0.44", "z ≈ 0.88", "z ≈ 1.76", "z ≈ 2.12"],
    answer: 1, explanation: "z = (p̂ − p₀)/√[p₀(1−p₀)/n] = (0.5069 − 0.5)/√[0.25/4040] = 0.0069/0.00785 ≈ 0.88" },
  { id: 20, difficulty: "medium", topic: "distributions", type: "mcq",
    question: "A quality engineer samples 10 switches; 10% are known defective. P(no more than 1 defective) = P(X≤1) where X~B(10, 0.1). This equals approximately:",
    options: ["0.387", "0.736", "0.651", "0.900"],
    answer: 1, explanation: "P(X≤1) = P(X=0) + P(X=1) = (0.9)¹⁰ + C(10,1)(0.1)(0.9)⁹ ≈ 0.349 + 0.387 = 0.736" },

  // ── HARD ──
  { id: 21, difficulty: "hard", topic: "hypothesis", type: "mcq",
    question: "Vitamin C data (n=8): x̄=22.5, s=7.19, testing H₀: μ=40, Hₐ: μ≠40. The t-statistic is:",
    options: ["t ≈ −4.88", "t ≈ −6.88", "t ≈ −2.88", "t ≈ −8.88"],
    answer: 1, explanation: "t = (x̄ − μ₀)/(s/√n) = (22.5 − 40)/(7.19/√8) = −17.5/2.542 ≈ −6.88, with df = n−1 = 7" },
  { id: 22, difficulty: "hard", topic: "hypothesis", type: "mcq",
    question: "For the vitamin C t-test (t=−6.88, df=7, two-sided), the P-value is approximately:",
    options: ["P ≈ 0.05", "P ≈ 0.01", "P < 0.001", "P ≈ 0.10"],
    answer: 2, explanation: "P-value = 2P(T > 6.88) with df=7. From t-tables, P(T > 5.408) = 0.0005, so P-value < 0.001. Reject H₀ at α=0.05." },
  { id: 23, difficulty: "hard", topic: "hypothesis", type: "mcq",
    question: "200 couples had children within 2 years of marriage; 80 divorced within 5 years. Testing H₀: p=1/3, Hₐ: p≠1/3 at α=0.10. p̂=0.4. The z-statistic is:",
    options: ["z ≈ 1.80", "z ≈ 2.12", "z ≈ 2.55", "z ≈ 1.20"],
    answer: 0, explanation: "z = (p̂ − p₀)/√[p₀(1−p₀)/n] = (0.4 − 0.333)/√[(0.333×0.667)/200] = 0.067/0.0333 ≈ 2.01 ... using exact 1/3: ≈ 1.80" },
  { id: 24, difficulty: "hard", topic: "counting", type: "mcq",
    question: "A box has 5 red, 4 blue, 3 green bulbs. 3 are selected randomly. P(exactly 1 red, 1 blue, 1 green) = ?",
    options: ["C(12,3) = 220 total; favorable = 5×4×3 = 60; P = 60/220", "P = 3/12", "P = C(5,1)×C(4,1)×C(3,1) / C(12,3) = 60/220 ≈ 0.273", "Both A and C"],
    answer: 3, explanation: "Favorable outcomes: C(5,1)×C(4,1)×C(3,1) = 5×4×3 = 60. Total: C(12,3) = 220. P = 60/220 ≈ 0.273. Answers A and C both correctly express this." },
  { id: 25, difficulty: "hard", topic: "distributions", type: "mcq",
    question: "X ~ B(3, 1/4). Find P(X=2).",
    options: ["9/64", "3/64", "27/64", "3/16"],
    answer: 0, explanation: "P(X=2) = C(3,2)(1/4)²(3/4)¹ = 3 × (1/16) × (3/4) = 9/64 ≈ 0.141" },
  { id: 26, difficulty: "hard", topic: "distributions", type: "mcq",
    question: "X ~ B(3, 1/4). Find E[X] and Var(X).",
    options: ["E=3/4, Var=9/16", "E=3/4, Var=9/64", "E=1/4, Var=3/16", "E=3/4, Var=3/4"],
    answer: 0, explanation: "E[X] = np = 3(1/4) = 3/4. Var(X) = np(1−p) = 3(1/4)(3/4) = 9/16. SD = 3/4." },
  { id: 27, difficulty: "hard", topic: "probability", type: "mcq",
    question: "P(A)=0.5, P(B)=0.4, P(A∩B)=0.2. Find P(A∩Bᶜ).",
    options: ["0.1", "0.2", "0.3", "0.4"],
    answer: 2, explanation: "P(A∩Bᶜ) = P(A) − P(A∩B) = 0.5 − 0.2 = 0.3. (A happens but B doesn't)" },
  { id: 28, difficulty: "hard", topic: "counting", type: "mcq",
    question: "In a 5-card hand from 52 cards, P(all 5 cards same color) = ?",
    options: ["C(26,5)/C(52,5)", "2×C(26,5)/C(52,5)", "C(26,5)²/C(52,5)", "C(13,5)/C(52,5)"],
    answer: 1, explanation: "2 colors (red/black), each with 26 cards. Favorable = 2 × C(26,5). P = 2×C(26,5)/C(52,5) = 2×65780/2598960 ≈ 0.0506" },
  { id: 29, difficulty: "hard", topic: "hypothesis", type: "mcq",
    question: "n=72 executives, x̄=126.07, σ=15, testing H₀: μ=128, Hₐ: μ≠128. P-value ≈ 0.2758. With α=0.05, conclude:",
    options: ["Reject H₀; executives differ from other men", "Fail to reject H₀; insufficient evidence executives differ", "Accept that μ=128 with certainty", "Need to use t-test instead"],
    answer: 1, explanation: "P-value (0.2758) > α (0.05) → Fail to reject H₀. x̄=126.07 is not strong enough evidence that μ ≠ 128." },
  { id: 30, difficulty: "hard", topic: "distributions", type: "mcq",
    question: "X ~ Geo(0.3). What is P(X = 4)?",
    options: ["0.3×(0.7)³", "(0.7)³", "0.3⁴", "C(4,1)(0.3)(0.7)³"],
    answer: 0, explanation: "Geometric pmf: P(X=x) = p(1−p)^(x−1). P(X=4) = 0.3×(0.7)³ = 0.3×0.343 = 0.1029" },

  // ── LECTURE 4: CORRELATION & REGRESSION ──
  { id: 31, difficulty: "easy", topic: "regression", type: "mcq",
    question: "In Dr. Kim's example about alcohol given to mice, which variable is the explanatory variable?",
    options: ["Amount of alcohol", "Change in body temperature", "Mouse ID number", "Elapsed time after the study"],
    answer: 0, explanation: "The explanatory variable is the input/predictor. In that example, it is the amount of alcohol administered." },
  { id: 32, difficulty: "easy", topic: "regression", type: "mcq",
    question: "Two variables are positively associated when:",
    options: ["Large values of one tend to pair with small values of the other", "Above-average values of one tend to occur with above-average values of the other", "They always have r = 1 exactly", "There is no trend at all"],
    answer: 1, explanation: "Positive association means high tends to go with high (and low with low), even if the relationship is not perfect." },
  { id: 33, difficulty: "easy", topic: "regression", type: "mcq",
    question: "What is the possible range of the correlation coefficient r?",
    options: ["0 to 1", "−100 to 100", "−1 to 1", "Any real number"],
    answer: 2, explanation: "Correlation is bounded: −1 ≤ r ≤ 1." },
  { id: 34, difficulty: "medium", topic: "regression", type: "mcq",
    question: "If r is close to 0, which statement is best?",
    options: ["There is no linear association (or a very weak one)", "There is a perfect negative linear relationship", "x and y are independent in every case", "The slope must be exactly 0 in any sample"],
    answer: 0, explanation: "r near 0 indicates weak/no linear pattern. It does not automatically guarantee full independence." },
  { id: 35, difficulty: "medium", topic: "regression", type: "mcq",
    question: "Given y-hat = 98.2 + 0.11x (house price in $1000, x in sq ft), what is the predicted price for x = 1700?",
    options: ["$187,200", "$285,200", "$298,200", "$340,000"],
    answer: 1, explanation: "Predicted y = 98.2 + 0.11(1700) = 285.2 ($1000) = $285,200." },
  { id: 36, difficulty: "medium", topic: "regression", type: "mcq",
    question: "For the house model above, an observed point is (1700, 290). What is the residual?",
    options: ["−4.8", "4.8", "290.0", "575.2"],
    answer: 1, explanation: "Residual = observed − predicted = 290 − 285.2 = 4.8 (in $1000 units)." },
  { id: 37, difficulty: "hard", topic: "regression", type: "mcq",
    question: "If x is not useful for predicting y with linear regression, what should be true about SSR and SST?",
    options: ["SSR is much smaller than SST", "SSR is much larger than SST", "SSR is exactly 0 always", "SSR is approximately equal to SST"],
    answer: 0, explanation: "When x explains little of y, explained variation (SSR) is small relative to total variation (SST)." },
  { id: 38, difficulty: "hard", topic: "regression", type: "mcq",
    question: "Suppose n=21, s_y=5, and SSE=180 with negative slope. Find R² and r.",
    options: ["R² = 36%, r = +0.6", "R² = 64%, r = +0.8", "R² = 64%, r = −0.8", "R² = 80%, r = −0.8"],
    answer: 2, explanation: "SST = (n−1)s_y² = 20×25 = 500, SSR = 500−180 = 320, so R² = 320/500 = 0.64 = 64%. Since slope is negative, r = −sqrt(0.64) = −0.8." },
  { id: 39, difficulty: "medium", topic: "regression", type: "mcq",
    question: "If the least-squares line is y-hat = 7x + 5 and an observation is (3, 29), what is the residual?",
    options: ["−3", "0", "3", "8"],
    answer: 2, explanation: "Predicted at x=3 is 7(3)+5 = 26. Residual = observed − predicted = 29 − 26 = 3." },
  { id: 40, difficulty: "medium", topic: "regression", type: "mcq",
    question: "For y-hat = 12.785 + 0.9227x, how do you interpret the slope 0.9227?",
    options: ["When x increases by 1, predicted y increases by about 0.9227", "When y increases by 1, predicted x increases by 0.9227", "x and y increase together by 12.785", "The residual decreases by 0.9227 each time"],
    answer: 0, explanation: "In y-hat = a + bx, the slope b is the estimated change in predicted y for each 1-unit increase in x." },
  { id: 41, difficulty: "easy", topic: "regression", type: "mcq",
    question: "In a standard scatterplot for regression, which axis usually shows the explanatory variable?",
    options: ["x-axis", "y-axis", "either axis randomly", "both axes"],
    answer: 0, explanation: "By convention in this course, explanatory variable is on x-axis and response variable is on y-axis." },
  { id: 42, difficulty: "easy", topic: "regression", type: "mcq",
    question: "Two variables are negatively associated when:",
    options: ["Above-average values of one tend to go with above-average values of the other", "Above-average values of one tend to go with below-average values of the other", "Their correlation is always exactly zero", "They are measured in different units"],
    answer: 1, explanation: "Negative association means high values of one variable tend to pair with low values of the other." },
  { id: 43, difficulty: "medium", topic: "regression", type: "mcq",
    question: "If a dataset has r = -1, the scatterplot points lie:",
    options: ["Exactly on an upward-sloping line", "Exactly on a downward-sloping line", "In a random blob with no trend", "On a curved parabola"],
    answer: 1, explanation: "r = -1 indicates a perfect negative linear relationship: all points on one straight downward line." },
  { id: 44, difficulty: "medium", topic: "regression", type: "mcq",
    question: "Dr. Kim notes correlation is strongly affected by:",
    options: ["Sample size only", "Outliers", "Measurement units only", "Sorting order of the data"],
    answer: 1, explanation: "Outliers can change r substantially, making the linear association appear stronger or weaker." },
  { id: 45, difficulty: "hard", topic: "regression", type: "mcq",
    question: "The least-squares regression line is the line that minimizes:",
    options: ["Sum of absolute residuals", "Sum of squared residuals", "Sum of y-values", "The slope b alone"],
    answer: 1, explanation: "Least squares chooses a and b to minimize the total squared vertical deviations: Σ(y - y-hat)^2." },
  { id: 46, difficulty: "medium", topic: "regression", type: "mcq",
    question: "For Barry Bonds data with r = 0.74 between HR and RBI, the best interpretation is:",
    options: ["A strong positive linear association", "A strong negative linear association", "No linear association", "A perfect positive linear association"],
    answer: 0, explanation: "r = 0.74 is positive and fairly strong, but not perfect (perfect would be r = 1)." },
  { id: 47, difficulty: "hard", topic: "regression", type: "mcq",
    question: "Which identity is correct for sums of squares in simple linear regression?",
    options: ["SSE = SSR + SST", "SSR = SSE + SST", "SST = SSR + SSE", "SST = SSR - SSE"],
    answer: 2, explanation: "Total variation decomposes into explained plus unexplained: SST = SSR + SSE." },
  { id: 48, difficulty: "hard", topic: "regression", type: "mcq",
    question: "What is the correct relationship between R^2 and r in simple linear regression?",
    options: ["R^2 = r", "R^2 = |r|", "R^2 = r^2", "R^2 = 1 - r"],
    answer: 2, explanation: "In simple linear regression, the coefficient of determination is the square of correlation: R^2 = r^2." },

  // ── LECTURE 6: RANDOM VARIABLES & CORE DISTRIBUTIONS ──
  { id: 49, difficulty: "easy", topic: "distributions", type: "mcq",
    question: "A random variable is best defined as:",
    options: ["Any event in a sample space", "A function that maps outcomes in the sample space to real numbers", "A probability table with no outcomes", "Any variable that changes over time"],
    answer: 1, explanation: "A random variable assigns a numerical value to each possible outcome in the sample space." },
  { id: 50, difficulty: "easy", topic: "distributions", type: "mcq",
    question: "For a Bernoulli(p) variable X, which values can X take?",
    options: ["0 and 1 only", "1 and 2 only", "Any nonnegative integer", "Any real number"],
    answer: 0, explanation: "By definition, Bernoulli has two outcomes coded as 0 (failure) and 1 (success)." },
  { id: 51, difficulty: "medium", topic: "distributions", type: "mcq",
    question: "If X ~ B(10, 0.5), what are the possible values of X?",
    options: ["1 through 10", "0 through 10", "0 through infinity", "Only even integers from 0 to 10"],
    answer: 1, explanation: "A binomial count can be any integer from 0 up to n, so here 0,1,...,10." },
  { id: 52, difficulty: "medium", topic: "distributions", type: "mcq",
    question: "Which setting fits a binomial model?",
    options: ["Count of successes in a fixed number of independent trials with constant p", "Number of trials until first success", "Any count where probabilities change each trial", "Any continuous measurement"],
    answer: 0, explanation: "Binomial requires fixed n, independent trials, two outcomes per trial, and constant success probability p." },
  { id: 53, difficulty: "hard", topic: "distributions", type: "mcq",
    question: "Juan and Maria plan 3 children; each child has probability 1/4 of type A independently. If X = number with type A, what is P(X=1)?",
    options: ["9/64", "27/64", "3/4", "3/16"],
    answer: 1, explanation: "X ~ B(3,1/4). P(X=1)=C(3,1)(1/4)(3/4)^2 = 3*(1/4)*(9/16) = 27/64." },
  { id: 54, difficulty: "hard", topic: "distributions", type: "mcq",
    question: "For X ~ B(3, 1/4), which full probability row for x=0,1,2,3 is correct?",
    options: ["27/64, 27/64, 9/64, 1/64", "1/64, 9/64, 27/64, 27/64", "27/64, 9/64, 27/64, 1/64", "1/4, 1/4, 1/4, 1/4"],
    answer: 0, explanation: "Using C(3,x)(1/4)^x(3/4)^(3-x): P0=27/64, P1=27/64, P2=9/64, P3=1/64." },
  { id: 55, difficulty: "medium", topic: "distributions", type: "mcq",
    question: "For X ~ B(3, 1/4), what are the mean and standard deviation?",
    options: ["mu=3/4 and sigma=3/4", "mu=3/4 and sigma=9/16", "mu=1/4 and sigma=3/4", "mu=3 and sigma=sqrt(3)"],
    answer: 0, explanation: "mu=np=3/4. Variance=np(1-p)=3*(1/4)*(3/4)=9/16, so sigma=sqrt(9/16)=3/4." },
  { id: 56, difficulty: "medium", topic: "distributions", type: "mcq",
    question: "If X is the number of trials until first success with success probability p, then:",
    options: ["X ~ B(n,p) with support x=0,1,2,...", "X ~ Geo(p) with pmf P(X=x)=p(1-p)^(x-1), x=1,2,3,...", "X ~ Bernoulli(p) with support x=0,1", "P(X=x)=(1-p)^x for x=1,2,3,..."],
    answer: 1, explanation: "This is geometric: count trials to first success. Its support starts at 1 and pmf is p(1-p)^(x-1)." },

  // ── LECTURE 8: CONFIDENCE INTERVALS ──
  { id: 57, difficulty: "easy", topic: "hypothesis", type: "mcq",
    question: "A confidence interval is generally written as:",
    options: ["parameter ± statistic", "point estimate ± margin of error", "sample size ± standard deviation", "z-score ± p-value"],
    answer: 1, explanation: "The standard structure is point estimate plus/minus margin of error." },
  { id: 58, difficulty: "easy", topic: "hypothesis", type: "mcq",
    question: "Which critical value z* corresponds to a 95% confidence level?",
    options: ["1.645", "1.96", "2.576", "2.33"],
    answer: 1, explanation: "For two-sided 95% confidence, z* = 1.96." },
  { id: 59, difficulty: "medium", topic: "hypothesis", type: "mcq",
    question: "Tim's data: x-bar=190.5, sigma=3, n=4. For 90% confidence (z*=1.645), the CI for mu is:",
    options: ["(188.0, 193.0)", "(185.6, 195.4)", "(186.6, 194.4)", "(190.5, 190.5)"],
    answer: 0, explanation: "ME = 1.645*(3/sqrt(4)) = 1.645*1.5 ≈ 2.5, so CI = 190.5 ± 2.5 = (188.0, 193.0)." },
  { id: 60, difficulty: "medium", topic: "hypothesis", type: "mcq",
    question: "If the same Tim example uses n=1 instead of n=4 (still 90% and sigma=3), what happens?",
    options: ["Interval gets narrower", "Interval stays the same", "Interval gets wider to about (185.6, 195.4)", "Center shifts to 193.0"],
    answer: 2, explanation: "With n=1, standard error is larger, so margin of error grows: 1.645*3 ≈ 4.9, giving (185.6, 195.4)." },
  { id: 61, difficulty: "medium", topic: "hypothesis", type: "mcq",
    question: "Holding all else fixed, increasing confidence level from 90% to 99% will:",
    options: ["Decrease margin of error", "Increase margin of error", "Leave margin of error unchanged", "Make sample mean larger"],
    answer: 1, explanation: "Higher confidence uses a larger critical value, so the margin of error increases." },
  { id: 62, difficulty: "hard", topic: "hypothesis", type: "mcq",
    question: "For a mean with known sigma, desired margin m, and confidence critical value z*, sample size is:",
    options: ["n = (m/(z*sigma))^2", "n = z*sigma/m", "n = (z*sigma/m)^2, rounded up", "n = (z*sigma/m)^2, rounded down"],
    answer: 2, explanation: "Use n = (z*sigma/m)^2 and always round UP to ensure the target margin of error." },
  { id: 63, difficulty: "hard", topic: "hypothesis", type: "mcq",
    question: "With sigma=3, 95% confidence (z*=1.96), and margin m=2, required n is closest to:",
    options: ["8 (exact)", "9", "4", "16"],
    answer: 1, explanation: "n=(1.96*3/2)^2 ≈ 8.64, so round up to 9." },
  { id: 64, difficulty: "easy", topic: "hypothesis", type: "mcq",
    question: "When sigma is unknown, the standard error of the sample mean is:",
    options: ["sigma/sqrt(n)", "s/sqrt(n)", "s/n", "1/sqrt(n)"],
    answer: 1, explanation: "Unknown population SD sigma is replaced by sample SD s, so SE(x-bar)=s/sqrt(n)." },
  { id: 65, difficulty: "easy", topic: "hypothesis", type: "mcq",
    question: "For one-sample t procedures with sample size n, degrees of freedom are:",
    options: ["n", "n+1", "n-1", "2n-1"],
    answer: 2, explanation: "The one-sample t distribution uses df = n - 1." },
  { id: 66, difficulty: "hard", topic: "hypothesis", type: "mcq",
    question: "Vitamin C example: n=8, x-bar=22.5, s=7.19, t*=2.365 (95%). The CI for mu is approximately:",
    options: ["(19.96, 25.04)", "(16.5, 28.5)", "(15.3, 29.7)", "(20.1, 24.9)"],
    answer: 1, explanation: "SE=7.19/sqrt(8)≈2.54; ME=2.365*2.54≈6.0; CI=22.5±6.0=(16.5,28.5)." },
  { id: 67, difficulty: "medium", topic: "hypothesis", type: "mcq",
    question: "Proportion CI example: n=182 and 75 in favor, so p-hat=0.4121. A 95% CI is closest to:",
    options: ["(0.341, 0.484)", "(0.412, 0.512)", "(0.300, 0.524)", "(0.375, 0.449)"],
    answer: 0, explanation: "Using p-hat ± 1.96*sqrt[p-hat(1-p-hat)/n], the interval is about (0.341, 0.484)." },
  { id: 68, difficulty: "medium", topic: "hypothesis", type: "mcq",
    question: "NJIT gender example: n=50, 31 male (p-hat=0.62). The 95% CI for p is approximately:",
    options: ["(0.485, 0.755)", "(0.52, 0.72)", "(0.41, 0.83)", "(0.62, 0.62)"],
    answer: 0, explanation: "ME=1.96*sqrt[(0.62)(0.38)/50]≈0.135, so CI≈0.62±0.135=(0.485,0.755)." },
];

const PATHS = [
  { id: "p1", title: "Probability Foundations", topic: "probability", steps: [
    { title: "Define the Sample Space", prompt: "Toss a coin 3 times. List all outcomes in S and count them." },
    { title: "Identify an Event", prompt: "From S above, list all outcomes in event A = 'at least 2 heads'." },
    { title: "Apply Addition Rule", prompt: "P(A)=0.6, P(B)=0.3, P(A∩B)=0.15. Calculate P(A∪B) and P(neither A nor B)." },
  ]},
  { id: "p2", title: "Counting Mastery", topic: "counting", steps: [
    { title: "Factorial Fluency", prompt: "Calculate 0!, 3!, 5!, and 7!." },
    { title: "Permutation vs Combination", prompt: "From 8 students, (a) how many ways to choose president & secretary? (b) How many ways to choose a 2-person committee?" },
    { title: "Complex Counting", prompt: "A license plate has 3 letters followed by 3 digits (repetition allowed). How many total plates are possible?" },
  ]},
  { id: "p3", title: "Distributions Deep Dive", topic: "distributions", steps: [
    { title: "Identify the Distribution", prompt: "For each: identify the distribution type and parameters.\n(a) Roll a die 20 times, count 6s\n(b) Flip a coin until first Head\n(c) One flip of a fair coin, X=1 for H" },
    { title: "Compute Probabilities", prompt: "X ~ B(5, 0.4). Find P(X=2), P(X≤1), E[X], and SD(X)." },
    { title: "Geometric Application", prompt: "A basketball player makes free throws with p=0.7. What is E[trials until first miss]? What is P(first miss on shot 3)?" },
  ]},
  { id: "p4", title: "Hypothesis Testing Workflow", topic: "hypothesis", steps: [
    { title: "Write the Hypotheses", prompt: "A factory claims average output ≥ 500 units/day. An auditor suspects it's less. Write H₀ and Hₐ." },
    { title: "Calculate the Test Statistic", prompt: "n=36, x̄=487, σ=42 (known). Calculate the z-statistic for H₀: μ=500." },
    { title: "Full Conclusion", prompt: "z = −1.857. The P-value = P(Z < −1.857) ≈ 0.0317. At α=0.05, state your conclusion in plain English." },
  ]},
];

const CHALLENGES = [
  { id: "c1", difficulty: "hard", topic: "hypothesis",
    title: "The Tar Content Test",
    prompt: "A consumer group evaluates cigarettes claimed to have low tar (μ < 5mg). They sample n=36 cigarettes and find x̄=5.5mg with σ=1.2.\n\n**Perform a complete 4-step hypothesis test at α=0.05:**\n1. State H₀ and Hₐ\n2. Calculate z\n3. Find and interpret the P-value\n4. State your conclusion",
    solution: "1. H₀: μ=5 vs Hₐ: μ>5 (one-sided; concerned tar is too high)\n2. Z = (5.5−5)/(1.2/√36) = 0.5/0.2 = 2.5\n3. P-value = P(Z>2.5) = 1−0.9938 = 0.0062\n4. Since 0.0062 < 0.05, reject H₀. Strong evidence the average tar content exceeds 5mg, contradicting the manufacturer's claim." },
  { id: "c2", difficulty: "hard", topic: "distributions",
    title: "Blood Type Probability Distribution",
    prompt: "Juan and Maria's children each have probability 1/4 of blood type A, independently. They plan 3 children.\n\n**Complete all parts:**\na) What distribution fits X = number of children with type A?\nb) Build the complete probability distribution table for X (x = 0, 1, 2, 3)\nc) Find E[X] and SD(X)\nd) Find P(at least 1 child has type A)",
    solution: "a) X ~ B(3, 1/4)\nb) P(0)=27/64≈0.422, P(1)=27/64≈0.422, P(2)=3/64×3=9/64≈0.141, P(3)=1/64≈0.016\nc) E[X]=3(1/4)=3/4=0.75; Var=3(1/4)(3/4)=9/16; SD=3/4=0.75\nd) P(X≥1)=1−P(X=0)=1−27/64=37/64≈0.578" },
  { id: "c3", difficulty: "medium", topic: "counting",
    title: "Poker Hand Probabilities",
    prompt: "A standard deck has 52 cards: 26 red (hearts + diamonds), 26 black (clubs + spades). You draw 5 cards without replacement.\n\n**Calculate:**\na) Total number of possible 5-card hands\nb) How many hands have all 5 cards the same color?\nc) What is the probability of a same-color hand?",
    solution: "a) C(52,5) = 52!/(5!×47!) = 2,598,960\nb) C(26,5) red + C(26,5) black = 2×65,780 = 131,560\nc) P = 131,560/2,598,960 ≈ 0.0506 (about 5.06%)" },
  { id: "c4", difficulty: "hard", topic: "probability",
    title: "Law Firm Partnership Problem",
    prompt: "Deborah thinks her P(making partner) = 0.7, Matthew's P(making partner) = 0.5, and P(both make partner) = 0.3.\n\n**Find:**\na) P(at least one makes partner)\nb) P(neither makes partner)\nc) P(Deborah makes partner but Matthew doesn't)\nd) Are the events disjoint? Why or why not?",
    solution: "a) P(D∪M) = 0.7+0.5−0.3 = 0.9\nb) P(neither) = 1−0.9 = 0.1\nc) P(D∩Mᶜ) = P(D)−P(D∩M) = 0.7−0.3 = 0.4\nd) Not disjoint because P(D∩M)=0.3≠0, meaning both CAN become partners simultaneously." },
];

// ── Utility ──
const cls = (...args) => args.filter(Boolean).join(" ");
const diffColor = { easy: "#4ade80", medium: "#facc15", hard: "#f87171" };
const topicColor = { probability: "#818cf8", counting: "#34d399", distributions: "#60a5fa", hypothesis: "#f472b6", regression: "#f59e0b" };

function useAI() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const ask = useCallback(async (prompt, system = "") => {
    setLoading(true);
    setResponse("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: system || "You are a helpful probability & statistics tutor. Be concise, clear, and encouraging. Use mathematical notation where helpful.",
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      setResponse(data.content?.[0]?.text || "No response received.");
    } catch (e) {
      setResponse("AI tutor temporarily unavailable. Check your answers using the solution provided.");
    }
    setLoading(false);
  }, []);
  return { loading, response, ask, clear: () => setResponse("") };
}

// ── Components ──
function ProgressBar({ value, max, color }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div style={{ background: "#1a1a2e", borderRadius: 6, height: 8, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 6, transition: "width 0.5s ease" }} />
    </div>
  );
}

function Badge({ label, color }) {
  return (
    <span style={{ fontSize: 10, fontFamily: "monospace", fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: color + "22", color, border: `1px solid ${color}44`, letterSpacing: 1 }}>
      {label.toUpperCase()}
    </span>
  );
}

function NoteCard({ note }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(o => !o)} style={{ background: "#0d0d1a", border: "1px solid #2a2a4a", borderRadius: 10, padding: "14px 18px", cursor: "pointer", transition: "border-color 0.2s", borderColor: open ? "#6366f1" : "#2a2a4a" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "monospace", color: "#e2e8f0", fontWeight: 600, fontSize: 14 }}>{note.title}</span>
        <span style={{ color: "#6366f1", fontSize: 18 }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div style={{ marginTop: 12, color: "#94a3b8", fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
          {note.content.replace(/\*\*(.*?)\*\*/g, "$1")}
        </div>
      )}
    </div>
  );
}

// ── Pages ──
function HomePage({ stats, onNav }) {
  const heroLines = ["Study Notes", "Path Exercises", "Take Quiz", "Challenge Mode", "Critical Exam"];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh", gap: 32 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
        <h1 style={{ fontFamily: "'Courier New', monospace", fontSize: 36, color: "#fff", margin: 0, fontWeight: 900, letterSpacing: -1 }}>
          {stats.total === 0 ? "Ready to Study?" : stats.correct === stats.total && stats.total > 0 ? "Perfect Score! 🎉" : "Keep Going! 💪"}
        </h1>
        <p style={{ color: "#64748b", fontFamily: "monospace", marginTop: 8, fontSize: 13 }}>
          Dr. Kim's Probability & Statistics · MATH 105 / 333
        </p>
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        {[
          { label: "📚 Study Notes", page: "notes", color: "#6366f1", bg: "#6366f1" },
          { label: "🗺 Path Exercises", page: "paths", color: "#10b981", bg: "transparent" },
          { label: "⚡ Challenge Mode", page: "challenge", color: "#f59e0b", bg: "transparent" },
        ].map(b => (
          <button key={b.page} onClick={() => onNav(b.page)} style={{ padding: "14px 28px", fontFamily: "monospace", fontWeight: 700, fontSize: 14, borderRadius: 8, cursor: "pointer", border: `2px solid ${b.color}`, background: b.bg === b.color ? b.color : "transparent", color: b.bg === b.color ? "#fff" : b.color, transition: "all 0.2s", letterSpacing: 1 }}>
            {b.label}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        {[
          { label: "✏ Take Quiz", page: "quiz", color: "#22c55e" },
          { label: "🎓 Critical Exam", page: "exam", color: "#ef4444" },
        ].map(b => (
          <button key={b.page} onClick={() => onNav(b.page)} style={{ padding: "14px 28px", fontFamily: "monospace", fontWeight: 700, fontSize: 14, borderRadius: 8, cursor: "pointer", border: `2px solid ${b.color}`, background: "transparent", color: b.color, transition: "all 0.2s", letterSpacing: 1 }}>
            {b.label}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
        {[
          { label: "Questions", value: ALL_QUESTIONS.length, color: "#6366f1" },
          { label: "Topics", value: Object.keys(TOPICS).length, color: "#10b981" },
          { label: "Challenges", value: CHALLENGES.length, color: "#f59e0b" },
        ].map(s => (
          <div key={s.label} style={{ background: "#0d0d1a", border: "1px solid #2a2a4a", borderRadius: 12, padding: "20px 32px", textAlign: "center", minWidth: 120 }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: s.color, fontFamily: "monospace" }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "#475569", fontFamily: "monospace", letterSpacing: 2, marginTop: 4 }}>{s.label.toUpperCase()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotesPage() {
  const [activeTopic, setActiveTopic] = useState("probability");
  return (
    <div>
      <h2 style={{ fontFamily: "monospace", color: "#e2e8f0", fontSize: 20, marginBottom: 20 }}>📚 Study Notes</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {Object.entries(TOPICS).map(([key, label]) => (
          <button key={key} onClick={() => setActiveTopic(key)} style={{ padding: "8px 16px", fontFamily: "monospace", fontSize: 12, borderRadius: 6, cursor: "pointer", border: `1px solid ${topicColor[key]}`, background: activeTopic === key ? topicColor[key] : "transparent", color: activeTopic === key ? "#000" : topicColor[key], fontWeight: 600, letterSpacing: 1 }}>
            {label}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {NOTES[activeTopic].map((note, i) => <NoteCard key={i} note={note} />)}
      </div>
    </div>
  );
}

function PathsPage() {
  const [activePath, setActivePath] = useState(null);
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState("");
  const ai = useAI();

  const startPath = (path) => { setActivePath(path); setStep(0); setAnswer(""); ai.clear(); };

  if (activePath) {
    const currentStep = activePath.steps[step];
    return (
      <div>
        <button onClick={() => setActivePath(null)} style={{ fontFamily: "monospace", fontSize: 12, color: "#6366f1", background: "none", border: "none", cursor: "pointer", marginBottom: 20, padding: 0 }}>← Back to Paths</button>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {activePath.steps.map((s, i) => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= step ? topicColor[activePath.topic] : "#1e1e3a" }} />
          ))}
        </div>
        <h2 style={{ fontFamily: "monospace", color: "#e2e8f0", fontSize: 18, marginBottom: 4 }}>{activePath.title}</h2>
        <p style={{ color: "#475569", fontFamily: "monospace", fontSize: 12, marginBottom: 20 }}>Step {step + 1} of {activePath.steps.length}: <span style={{ color: topicColor[activePath.topic] }}>{currentStep.title}</span></p>
        <div style={{ background: "#0d0d1a", border: `1px solid ${topicColor[activePath.topic]}44`, borderRadius: 10, padding: 20, marginBottom: 16 }}>
          <p style={{ color: "#cbd5e1", fontFamily: "monospace", fontSize: 14, whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{currentStep.prompt}</p>
        </div>
        <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Write your solution here..." style={{ width: "100%", minHeight: 120, background: "#0a0a1a", border: "1px solid #2a2a4a", borderRadius: 8, padding: 14, color: "#e2e8f0", fontFamily: "monospace", fontSize: 13, resize: "vertical", boxSizing: "border-box", outline: "none" }} />
        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <button onClick={() => ai.ask(`The student is working on this exercise:\n"${currentStep.prompt}"\n\nTheir answer: "${answer || '(not written yet)'}"\n\nProvide a helpful hint or feedback without giving the full answer away. Be encouraging.`)} disabled={ai.loading} style={{ padding: "10px 20px", fontFamily: "monospace", fontSize: 12, borderRadius: 6, cursor: "pointer", border: "1px solid #6366f1", background: "transparent", color: "#818cf8", fontWeight: 600 }}>
            {ai.loading ? "Thinking..." : "💡 Get Hint"}
          </button>
          <button onClick={() => ai.ask(`Provide the complete, worked solution for: "${currentStep.prompt}". Be thorough and explain each step.`)} disabled={ai.loading} style={{ padding: "10px 20px", fontFamily: "monospace", fontSize: 12, borderRadius: 6, cursor: "pointer", border: "1px solid #10b981", background: "transparent", color: "#34d399", fontWeight: 600 }}>
            {ai.loading ? "Thinking..." : "✅ Show Solution"}
          </button>
          {step < activePath.steps.length - 1 && (
            <button onClick={() => { setStep(s => s + 1); setAnswer(""); ai.clear(); }} style={{ padding: "10px 20px", fontFamily: "monospace", fontSize: 12, borderRadius: 6, cursor: "pointer", border: "none", background: topicColor[activePath.topic], color: "#000", fontWeight: 700, marginLeft: "auto" }}>
              Next Step →
            </button>
          )}
          {step === activePath.steps.length - 1 && (
            <button onClick={() => setActivePath(null)} style={{ padding: "10px 20px", fontFamily: "monospace", fontSize: 12, borderRadius: 6, cursor: "pointer", border: "none", background: "#10b981", color: "#000", fontWeight: 700, marginLeft: "auto" }}>
              🎉 Complete!
            </button>
          )}
        </div>
        {ai.response && (
          <div style={{ marginTop: 16, background: "#0d1117", border: "1px solid #2a2a4a", borderRadius: 8, padding: 16 }}>
            <div style={{ fontFamily: "monospace", color: "#818cf8", fontSize: 11, marginBottom: 8, letterSpacing: 1 }}>AI TUTOR</div>
            <p style={{ color: "#94a3b8", fontFamily: "monospace", fontSize: 13, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{ai.response}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontFamily: "monospace", color: "#e2e8f0", fontSize: 20, marginBottom: 20 }}>🗺 Learning Paths</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {PATHS.map(path => (
          <div key={path.id} onClick={() => startPath(path)} style={{ background: "#0d0d1a", border: `1px solid ${topicColor[path.topic]}44`, borderRadius: 12, padding: 20, cursor: "pointer", transition: "all 0.2s" }}>
            <div style={{ marginBottom: 8 }}><Badge label={TOPICS[path.topic]} color={topicColor[path.topic]} /></div>
            <h3 style={{ fontFamily: "monospace", color: "#e2e8f0", fontSize: 15, margin: "8px 0 4px" }}>{path.title}</h3>
            <p style={{ color: "#475569", fontFamily: "monospace", fontSize: 12 }}>{path.steps.length} guided steps</p>
            <div style={{ display: "flex", gap: 4, marginTop: 12 }}>
              {path.steps.map((_, i) => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: "#1e1e3a" }} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuizPage({ mode = "quiz" }) {
  const isExam = mode === "exam";
  const pool = isExam
    ? ALL_QUESTIONS.filter(q => q.difficulty === "hard" || q.difficulty === "medium")
    : ALL_QUESTIONS;

  const [questions] = useState(() => {
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, isExam ? 15 : 10);
  });
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [filterDiff, setFilterDiff] = useState("all");
  const [showExplanation, setShowExplanation] = useState(false);
  const ai = useAI();

  const q = questions[current];
  const answered = selected !== null;
  const isCorrect = answered && selected === q.answer;

  const submit = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswers(a => ({ ...a, [q.id]: idx }));
    setShowExplanation(false);
    ai.clear();
  };

  const next = () => {
    if (current < questions.length - 1) { setCurrent(c => c + 1); setSelected(null); setShowExplanation(false); ai.clear(); }
    else setShowResult(true);
  };

  const score = Object.entries(answers).filter(([id, ans]) => {
    const qq = questions.find(x => x.id === Number(id));
    return qq && qq.answer === ans;
  }).length;

  if (showResult) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>{pct >= 80 ? "🎉" : pct >= 60 ? "📈" : "📚"}</div>
        <h2 style={{ fontFamily: "monospace", color: "#e2e8f0", fontSize: 28 }}>{score}/{questions.length} Correct</h2>
        <p style={{ color: pct >= 80 ? "#4ade80" : pct >= 60 ? "#facc15" : "#f87171", fontFamily: "monospace", fontSize: 20, fontWeight: 700 }}>{pct}%</p>
        <p style={{ color: "#64748b", fontFamily: "monospace", fontSize: 13 }}>{pct >= 80 ? "Excellent! You're exam-ready." : pct >= 60 ? "Good work! Review your mistakes." : "Keep studying — you've got this!"}</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
          <button onClick={() => { setCurrent(0); setSelected(null); setAnswers({}); setShowResult(false); ai.clear(); }} style={{ padding: "12px 24px", fontFamily: "monospace", fontSize: 13, borderRadius: 8, cursor: "pointer", border: "2px solid #6366f1", background: "#6366f1", color: "#fff", fontWeight: 700 }}>
            Retry Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontFamily: "monospace", color: "#e2e8f0", fontSize: 18, margin: 0 }}>{isExam ? "🎓 Critical Exam" : "✏ Quiz Mode"}</h2>
        <span style={{ fontFamily: "monospace", color: "#475569", fontSize: 13 }}>{current + 1} / {questions.length}</span>
      </div>
      <ProgressBar value={current + (answered ? 1 : 0)} max={questions.length} color={isExam ? "#ef4444" : "#6366f1"} />
      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <Badge label={q.difficulty} color={diffColor[q.difficulty]} />
          <Badge label={TOPICS[q.topic]} color={topicColor[q.topic]} />
        </div>
        <p style={{ fontFamily: "monospace", color: "#e2e8f0", fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>{q.question}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {q.options.map((opt, i) => {
            let bg = "#0d0d1a", border = "#2a2a4a", color = "#94a3b8";
            if (answered) {
              if (i === q.answer) { bg = "#052e16"; border = "#4ade80"; color = "#4ade80"; }
              else if (i === selected) { bg = "#1c0a0a"; border = "#f87171"; color = "#f87171"; }
            } else if (selected === i) { bg = "#1e1e3a"; border = "#6366f1"; color = "#e2e8f0"; }
            return (
              <div key={i} onClick={() => submit(i)} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: "12px 16px", cursor: answered ? "default" : "pointer", color, fontFamily: "monospace", fontSize: 13, transition: "all 0.2s", display: "flex", alignItems: "flex-start", gap: 12 }}>
                <span style={{ minWidth: 20, fontWeight: 700 }}>{String.fromCharCode(65 + i)}.</span>
                <span style={{ lineHeight: 1.5 }}>{opt}</span>
              </div>
            );
          })}
        </div>
      </div>
      {answered && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ background: isCorrect ? "#052e16" : "#1c0a0a", border: `1px solid ${isCorrect ? "#4ade80" : "#f87171"}`, borderRadius: 8, padding: 14, marginBottom: 12 }}>
            <p style={{ color: isCorrect ? "#4ade80" : "#f87171", fontFamily: "monospace", fontSize: 12, fontWeight: 700, margin: "0 0 6px" }}>{isCorrect ? "✓ CORRECT" : "✗ INCORRECT"}</p>
            <p style={{ color: "#94a3b8", fontFamily: "monospace", fontSize: 13, margin: 0, lineHeight: 1.6 }}>{q.explanation}</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={() => { setShowExplanation(true); ai.ask(`Explain this statistics concept more deeply: "${q.question}"\nThe correct answer is: "${q.options[q.answer]}"\nExplanation: "${q.explanation}"\n\nGive a deeper explanation with context and any common misconceptions.`); }} disabled={ai.loading} style={{ padding: "8px 16px", fontFamily: "monospace", fontSize: 11, borderRadius: 6, cursor: "pointer", border: "1px solid #6366f1", background: "transparent", color: "#818cf8" }}>
              {ai.loading ? "Loading..." : "🤖 Deeper Explanation"}
            </button>
            <button onClick={next} style={{ padding: "10px 24px", fontFamily: "monospace", fontSize: 13, borderRadius: 6, cursor: "pointer", border: "none", background: "#6366f1", color: "#fff", fontWeight: 700, marginLeft: "auto" }}>
              {current < questions.length - 1 ? "Next →" : "See Results"}
            </button>
          </div>
          {ai.response && (
            <div style={{ marginTop: 12, background: "#0d1117", border: "1px solid #2a2a4a", borderRadius: 8, padding: 14 }}>
              <div style={{ fontFamily: "monospace", color: "#818cf8", fontSize: 11, marginBottom: 8, letterSpacing: 1 }}>AI TUTOR</div>
              <p style={{ color: "#94a3b8", fontFamily: "monospace", fontSize: 13, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{ai.response}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ChallengePage() {
  const [active, setActive] = useState(null);
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const ai = useAI();

  if (active) {
    return (
      <div>
        <button onClick={() => { setActive(null); setAnswer(""); setRevealed(false); ai.clear(); }} style={{ fontFamily: "monospace", fontSize: 12, color: "#f59e0b", background: "none", border: "none", cursor: "pointer", marginBottom: 20, padding: 0 }}>← Back to Challenges</button>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <Badge label={active.difficulty} color={diffColor[active.difficulty]} />
          <Badge label={TOPICS[active.topic]} color={topicColor[active.topic]} />
        </div>
        <h2 style={{ fontFamily: "monospace", color: "#e2e8f0", fontSize: 18, marginBottom: 16 }}>⚡ {active.title}</h2>
        <div style={{ background: "#0a0a1a", border: "1px solid #2a2a4a", borderRadius: 10, padding: 20, marginBottom: 16 }}>
          <p style={{ color: "#cbd5e1", fontFamily: "monospace", fontSize: 13, whiteSpace: "pre-wrap", lineHeight: 1.8 }}>{active.prompt}</p>
        </div>
        <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Show your full work here..." style={{ width: "100%", minHeight: 160, background: "#0a0a1a", border: "1px solid #2a2a4a", borderRadius: 8, padding: 14, color: "#e2e8f0", fontFamily: "monospace", fontSize: 13, resize: "vertical", boxSizing: "border-box", outline: "none" }} />
        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <button onClick={() => ai.ask(`Grade this student's work and provide detailed feedback:\n\nProblem: "${active.prompt}"\n\nStudent's answer: "${answer || '(blank)'}"\n\nThe correct solution approach: "${active.solution}"\n\nProvide: (1) Grade/assessment (2) What they got right (3) What needs correction (4) Tips for improvement`)} disabled={ai.loading || !answer.trim()} style={{ padding: "10px 20px", fontFamily: "monospace", fontSize: 12, borderRadius: 6, cursor: "pointer", border: "1px solid #818cf8", background: "transparent", color: "#818cf8", fontWeight: 600, opacity: answer.trim() ? 1 : 0.5 }}>
            {ai.loading ? "Grading..." : "🤖 Grade My Answer"}
          </button>
          <button onClick={() => { setRevealed(true); ai.clear(); }} style={{ padding: "10px 20px", fontFamily: "monospace", fontSize: 12, borderRadius: 6, cursor: "pointer", border: "1px solid #10b981", background: "transparent", color: "#34d399", fontWeight: 600 }}>
            ✅ Reveal Solution
          </button>
        </div>
        {ai.response && (
          <div style={{ marginTop: 16, background: "#0d1117", border: "1px solid #6366f1", borderRadius: 8, padding: 16 }}>
            <div style={{ fontFamily: "monospace", color: "#818cf8", fontSize: 11, marginBottom: 8, letterSpacing: 1 }}>AI GRADER</div>
            <p style={{ color: "#94a3b8", fontFamily: "monospace", fontSize: 13, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{ai.response}</p>
          </div>
        )}
        {revealed && (
          <div style={{ marginTop: 16, background: "#052e16", border: "1px solid #4ade80", borderRadius: 8, padding: 16 }}>
            <div style={{ fontFamily: "monospace", color: "#4ade80", fontSize: 11, marginBottom: 8, letterSpacing: 1 }}>FULL SOLUTION</div>
            <p style={{ color: "#86efac", fontFamily: "monospace", fontSize: 13, whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{active.solution}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontFamily: "monospace", color: "#e2e8f0", fontSize: 20, marginBottom: 8 }}>⚡ Challenge Mode</h2>
      <p style={{ color: "#475569", fontFamily: "monospace", fontSize: 12, marginBottom: 24 }}>Full worked problems — show your complete solution and get AI feedback.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {CHALLENGES.map(c => (
          <div key={c.id} onClick={() => { setActive(c); setAnswer(""); setRevealed(false); ai.clear(); }} style={{ background: "#0d0d1a", border: "1px solid #2a2a4a", borderRadius: 12, padding: 20, cursor: "pointer", transition: "border-color 0.2s" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <Badge label={c.difficulty} color={diffColor[c.difficulty]} />
              <Badge label={TOPICS[c.topic]} color={topicColor[c.topic]} />
            </div>
            <h3 style={{ fontFamily: "monospace", color: "#e2e8f0", fontSize: 15, margin: "0 0 6px" }}>{c.title}</h3>
            <p style={{ color: "#475569", fontFamily: "monospace", fontSize: 12, margin: 0 }}>{c.prompt.split("\n")[0].slice(0, 80)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main App ──
export default function App() {
  const [page, setPage] = useState("home");
  const [stats] = useState({ total: ALL_QUESTIONS.length, correct: 0 });

  const nav = [
    { id: "home", label: "HOME", icon: "🏠" },
    { id: "notes", label: "NOTES", icon: "📚" },
    { id: "paths", label: "PATHS", icon: "🗺" },
    { id: "quiz", label: "QUIZ", icon: "✏" },
    { id: "challenge", label: "CHALLENGE", icon: "⚡" },
    { id: "exam", label: "EXAM", icon: "🎓" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#050508", color: "#e2e8f0", fontFamily: "monospace" }}>
      {/* Header */}
      <div style={{ background: "#0a0a15", borderBottom: "1px solid #1a1a2e", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div>
            <div style={{ fontSize: 10, color: "#4a4a6a", letterSpacing: 3, textTransform: "uppercase" }}>Probability & Statistics</div>
            <div style={{ fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 18, color: "#fff", letterSpacing: -0.5 }}>Exam Prep Terminal</div>
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {nav.map(n => (
              <button key={n.id} onClick={() => setPage(n.id)} style={{ padding: "6px 14px", fontFamily: "monospace", fontSize: 11, borderRadius: 6, cursor: "pointer", border: `1px solid ${page === n.id ? "#6366f1" : "#1a1a2e"}`, background: page === n.id ? "#1e1a3a" : "transparent", color: page === n.id ? "#818cf8" : "#475569", fontWeight: 700, letterSpacing: 1, transition: "all 0.2s" }}>
                {n.icon} {n.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Content */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>
        {page === "home" && <HomePage stats={stats} onNav={setPage} />}
        {page === "notes" && <NotesPage />}
        {page === "paths" && <PathsPage />}
        {page === "quiz" && <QuizPage mode="quiz" />}
        {page === "challenge" && <ChallengePage />}
        {page === "exam" && <QuizPage mode="exam" />}
      </div>
    </div>
  );
}
