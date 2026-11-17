export type Question = {
  id: string;
  prompt: string;
  choices: string[];
  answer: number;
  explain: string;
};

export type Section = { heading: string; body: string[] };

export type Unit = {
  slug: string;
  number: number;
  title: string;
  bigIdea: string;
  grades: string;
  minutes: number;
  summary: string;
  objectives: string[];
  reading: Section[];
  lab: { title: string; steps: string[] };
  questions: Question[];
  standards: string[];
  discussion: string;
};

export const units: Unit[] = [
  {
    slug: "images-are-numbers",
    number: 1,
    title: "Images are numbers",
    bigIdea: "Perception",
    grades: "9-10",
    minutes: 50,
    summary:
      "Turn a drawing into a grid of numbers, then slide a 3 by 3 kernel across it to find edges.",
    objectives: [
      "Explain how a grayscale image is stored as pixel values.",
      "Compute one output cell of a convolution by hand.",
      "Predict which kernel responds to vertical versus horizontal edges.",
    ],
    reading: [
      {
        heading: "What a camera gives a computer",
        body: [
          "A digital image is a grid of pixels. In a grayscale image each pixel holds one number, usually from 0 (black) to 255 (white). A color image holds three numbers per pixel: red, green, and blue.",
          "A 1920 by 1080 photo has 2,073,600 pixels. In color that is about 6.2 million numbers. The computer never sees a face or a stop sign, only those numbers.",
        ],
      },
      {
        heading: "Finding edges with a kernel",
        body: [
          "An edge is a place where neighboring pixel values change sharply. A kernel is a small grid of weights, often 3 by 3, that slides across the image. At each position, multiply every weight by the pixel under it and add the nine results.",
          "This operation is called convolution. The output grid is a feature map. Its values are large where the image contains the pattern the kernel describes, such as dark-to-light from left to right.",
        ],
      },
      {
        heading: "Where this shows up",
        body: [
          "Convolutional neural networks learn their kernel weights from training data instead of having a person pick them. When researchers inspect the first layer of a trained network, many kernels look like the hand-made edge detectors in this lab.",
        ],
      },
    ],
    lab: {
      title: "Draw, then filter",
      steps: [
        "Draw on the left grid. Drag to paint, switch to Erase to remove.",
        "Pick a kernel and compare the feature map on the right.",
        "Hover any output cell to see its value.",
      ],
    },
    questions: [
      {
        id: "u1q1",
        prompt:
          "A grayscale image is 28 by 28 pixels, the size used in the MNIST handwritten digit dataset. How many numbers does it store?",
        choices: ["56", "784", "2,352", "28"],
        answer: 1,
        explain: "28 times 28 is 784, one value per pixel. A color version would need 3 times 784, or 2,352.",
      },
      {
        id: "u1q2",
        prompt: "A vertical-edge kernel gives its largest output where:",
        choices: [
          "The pixels to the left and right of a cell differ a lot",
          "Every pixel in the region is white",
          "Every pixel in the region is black",
          "The image has been rotated 90 degrees",
        ],
        answer: 0,
        explain:
          "The kernel subtracts the left column from the right column. Flat regions, whether all white or all black, cancel out to zero.",
      },
      {
        id: "u1q3",
        prompt: "In a convolutional neural network, the kernel weights are:",
        choices: [
          "Typed in by the programmer for every layer",
          "Always the Sobel kernel",
          "Learned from training data",
          "Random and never updated",
        ],
        answer: 2,
        explain:
          "Training adjusts the weights so the network's predictions get better. Hand-designed kernels like Sobel came first; learned kernels replaced them.",
      },
    ],
    standards: ["AI4K12 Big Idea 1", "CSTA 3A-DA-12"],
    discussion:
      "Phone cameras run filters on every photo before you see it. What decisions is the software making for you, and could any of them change how a person looks?",
  },
  {
    slug: "search-and-planning",
    number: 2,
    title: "Search and planning",
    bigIdea: "Representation & Reasoning",
    grades: "9-10",
    minutes: 50,
    summary:
      "Model a map as a graph, then race breadth-first search against A* to find a shortest route.",
    objectives: [
      "Represent a route-finding problem as states and actions.",
      "Trace breadth-first search on a small grid.",
      "Explain why a good heuristic lets A* explore fewer cells.",
    ],
    reading: [
      {
        heading: "Problems as graphs",
        body: [
          "Many AI problems can be written as a graph: states connected by actions. A map app treats intersections as states and road segments as actions. A chess program treats each board position as a state and each legal move as an action.",
          "Once a problem is a graph, solving it means searching for a path from the start state to a goal state.",
        ],
      },
      {
        heading: "Breadth-first search",
        body: [
          "Breadth-first search (BFS) looks at every state one step from the start, then every state two steps away, and so on. When every move costs the same, the first time it reaches the goal it has found a shortest path.",
          "The cost is effort. BFS has no idea which direction the goal is, so it spreads out evenly and can explore most of the map.",
        ],
      },
      {
        heading: "A* search",
        body: [
          "A* adds a heuristic: an estimate of the distance still left. It always expands the cell with the lowest total of steps taken plus estimated steps remaining.",
          "On a grid with up, down, left, and right moves, Manhattan distance (columns apart plus rows apart) never overestimates. A heuristic with that property is called admissible, and it guarantees A* still returns a shortest path. Peter Hart, Nils Nilsson, and Bertram Raphael published A* in 1968 while working on the Shakey robot at SRI.",
        ],
      },
    ],
    lab: {
      title: "Race BFS and A*",
      steps: [
        "Click or drag on the grid to add and remove walls.",
        "Run BFS, then run A* on the same map.",
        "Compare cells explored. Path length should match.",
      ],
    },
    questions: [
      {
        id: "u2q1",
        prompt: "On a grid where every step costs 1, breadth-first search returns:",
        choices: ["A shortest path", "The longest path", "A random path", "A path only if there are no walls"],
        answer: 0,
        explain: "BFS reaches cells in order of distance from the start, so the goal is first reached by a shortest route.",
      },
      {
        id: "u2q2",
        prompt: "A heuristic for A* is admissible when it:",
        choices: [
          "Is always zero",
          "Never overestimates the true remaining cost",
          "Is always larger than the true cost",
          "Is computed by running BFS first",
        ],
        answer: 1,
        explain:
          "An admissible heuristic can be too low but never too high. Zero is technically admissible, but then A* behaves like plain uniform-cost search.",
      },
      {
        id: "u2q3",
        prompt: "Why does A* usually explore fewer cells than BFS?",
        choices: [
          "It can move diagonally",
          "It ignores walls",
          "It expands cells that look closer to the goal first",
          "It stops before finding a full path",
        ],
        answer: 2,
        explain: "The heuristic pulls the search toward the goal instead of spreading out in every direction.",
      },
    ],
    standards: ["AI4K12 Big Idea 2", "CSTA 3B-AP-09"],
    discussion:
      "A delivery app picks the fastest route for drivers. What else, besides time, could a route planner be asked to minimize, and who decides?",
  },
  {
    slug: "learning-from-examples",
    number: 3,
    title: "Learning from examples",
    bigIdea: "Learning",
    grades: "10-11",
    minutes: 55,
    summary:
      "Place labeled points, train a k-nearest neighbors classifier, and watch the decision boundary change with k.",
    objectives: [
      "Describe supervised learning in terms of inputs, labels, and predictions.",
      "Classify a new point by hand using k-nearest neighbors.",
      "Explain overfitting and why k should be chosen with validation data.",
    ],
    reading: [
      {
        heading: "Supervised learning",
        body: [
          "In supervised learning you give a program examples with the correct answer attached, called labels. The program builds a rule that maps inputs to labels. The real test is how well that rule works on examples it has never seen.",
        ],
      },
      {
        heading: "k-nearest neighbors",
        body: [
          "To classify a new point, k-nearest neighbors (kNN) finds the k training points closest to it and takes a majority vote of their labels. There is no training step beyond storing the data.",
          "Thomas Cover and Peter Hart analyzed the nearest neighbor rule in 1967. It is still a common baseline because it is easy to explain and needs no tuning beyond k and a distance measure.",
        ],
      },
      {
        heading: "Choosing k",
        body: [
          "With k = 1 the boundary bends around every training point, including mislabeled ones. The model memorizes noise. This is overfitting.",
          "A large k gives smooth boundaries but can outvote small groups that are real. This is underfitting. With two classes, use an odd k so votes cannot tie, and pick k by measuring accuracy on data held out from training.",
        ],
      },
    ],
    lab: {
      title: "Train a kNN classifier",
      steps: [
        "Pick class A or class B, then click the plot to add points.",
        "Move the k slider and watch the shaded regions.",
        "Drop one class B point deep inside class A. Compare k = 1 with k = 7.",
      ],
    },
    questions: [
      {
        id: "u3q1",
        prompt: "You use k = 1 and test the model on the same points you trained on. You will most likely see:",
        choices: [
          "A perfect score that says little about new data",
          "A score near 50 percent",
          "An error, because kNN cannot test on training data",
          "The same score as on new data",
        ],
        answer: 0,
        explain: "Each point's nearest neighbor is itself, so it is always right. That tells you nothing about unseen points.",
      },
      {
        id: "u3q2",
        prompt: "With two classes, why is an odd k usually preferred?",
        choices: ["It runs faster", "Votes cannot end in a tie", "It prevents overfitting", "Even k is not allowed"],
        answer: 1,
        explain: "With k = 4, a 2 to 2 vote has no winner. An odd k always produces a majority between two classes.",
      },
      {
        id: "u3q3",
        prompt: "What is the best way to choose k?",
        choices: [
          "Always use k = 1",
          "Use the largest k the computer can handle",
          "Compare accuracy on validation data not used for training",
          "Pick the k with the highest training accuracy",
        ],
        answer: 2,
        explain: "Training accuracy rewards memorizing. Held-out validation data estimates performance on new examples.",
      },
    ],
    standards: ["AI4K12 Big Idea 3", "CSTA 3A-DA-12", "CSTA 3B-AP-08"],
    discussion:
      "A school wants to predict which students need tutoring using last year's grades. What labels would it train on, and what could go wrong with them?",
  },
  {
    slug: "language-models",
    number: 4,
    title: "How language models predict text",
    bigIdea: "Natural Interaction",
    grades: "11-12",
    minutes: 55,
    summary:
      "Build a bigram model from a short text, then generate sentences one word at a time and adjust temperature.",
    objectives: [
      "Explain tokens and next-token prediction.",
      "Compute a bigram probability from word counts.",
      "Describe how temperature changes sampled output.",
    ],
    reading: [
      {
        heading: "Text becomes tokens",
        body: [
          "Language models split text into tokens: whole words, pieces of words, or punctuation. Models in the GPT family use subword tokenizers, so a rare word like \"photosynthesis\" may be split into several tokens. This lab uses whole words to keep the tables readable.",
        ],
      },
      {
        heading: "Predicting the next token",
        body: [
          "A bigram model counts how often each word follows each other word in its training text and turns the counts into probabilities. If \"the\" is followed by \"river\" 3 times and \"hill\" 1 time, then P(river | the) = 3 / 4 = 0.75.",
          "Large language models also output a probability for every possible next token. The difference is how they compute it: a transformer neural network that looks at thousands of previous tokens, not just the last one.",
        ],
      },
      {
        heading: "Sampling and temperature",
        body: [
          "To generate text, the model picks a next token from the distribution, appends it, and repeats. Temperature reshapes the distribution first. Below 1 it sharpens toward the most likely token. Above 1 it flattens, so unlikely tokens show up more.",
          "A model writes text that is likely given its training data. Likely is not the same as true. Check claims against a source before you use them.",
        ],
      },
    ],
    lab: {
      title: "Generate with a bigram model",
      steps: [
        "Read the training text, or replace it with your own.",
        "Click a candidate word to add it, or let the model sample.",
        "Raise the temperature and sample again. Watch the probabilities flatten.",
      ],
    },
    questions: [
      {
        id: "u4q1",
        prompt:
          "In the training text, \"the\" is followed by \"river\" 6 times and \"hill\" 2 times, and by nothing else. What is P(river | the)?",
        choices: ["0.25", "0.60", "0.75", "6"],
        answer: 2,
        explain: "6 out of 8 occurrences: 6 / 8 = 0.75.",
      },
      {
        id: "u4q2",
        prompt: "Raising the sampling temperature above 1 makes the model:",
        choices: [
          "Always pick the most likely word",
          "Pick less likely words more often",
          "Learn from new data",
          "Run on more tokens of context",
        ],
        answer: 1,
        explain: "Higher temperature flattens the distribution. It changes sampling only; the model's counts or weights stay the same.",
      },
      {
        id: "u4q3",
        prompt: "A language model gives a fluent, confident answer. That tells you the answer is:",
        choices: [
          "Verified against sources",
          "Likely given the training data, but not necessarily true",
          "Copied from one website",
          "Correct if the temperature was low",
        ],
        answer: 1,
        explain: "Fluency comes from predicting likely text. Facts still have to be checked.",
      },
    ],
    standards: ["AI4K12 Big Idea 4", "CSTA 3B-AP-08", "CSTA 3A-IC-24"],
    discussion:
      "Your school allows AI chat tools for brainstorming but not for final drafts. Using what you know about next-token prediction, argue for or against that line.",
  },
  {
    slug: "fairness-audit",
    number: 5,
    title: "Auditing a model for fairness",
    bigIdea: "Societal Impact",
    grades: "11-12",
    minutes: 60,
    summary:
      "Set approval thresholds for two groups of simulated loan applicants and measure who the model helps and who it misses.",
    objectives: [
      "Compute true positive rate and false positive rate from outcomes.",
      "Show how one threshold can treat two groups differently.",
      "Explain why fairness metrics can conflict and who should decide.",
    ],
    reading: [
      {
        heading: "Errors are not spread evenly",
        body: [
          "A model can be 90 percent accurate overall and much worse for one group. In the 2018 Gender Shades study, Joy Buolamwini and Timnit Gebru tested commercial gender classifiers. Error rates reached 34.7 percent for darker-skinned women and were at most 0.8 percent for lighter-skinned men.",
        ],
      },
      {
        heading: "Scores, thresholds, and rates",
        body: [
          "Many models output a score. A threshold turns the score into a decision, such as approve if the score is 60 or higher.",
          "True positive rate (TPR) is the share of qualified people who get approved. False positive rate (FPR) is the share of unqualified people who get approved. An audit computes these for each group separately.",
        ],
      },
      {
        heading: "Trade-offs you cannot avoid",
        body: [
          "When groups have different base rates, you generally cannot make every fairness metric equal at once. Kleinberg, Mullainathan, and Raghavan proved a version of this in 2016, and Chouldechova showed a related result the same year.",
          "Equalizing TPR across groups is called equal opportunity (Hardt, Price, and Srebro, 2016). Choosing which metric matters is a value judgment. It should be made openly, with input from the people affected, not left to a default setting.",
        ],
      },
    ],
    lab: {
      title: "Audit a loan model",
      steps: [
        "The data is simulated: 200 applicants per group, with Group B's qualified scores shifted lower.",
        "Move each group's threshold and read the rates in the table.",
        "Try to equalize TPR. Then check what happened to FPR.",
      ],
    },
    questions: [
      {
        id: "u5q1",
        prompt: "True positive rate for a group is:",
        choices: [
          "Approved people divided by all people",
          "Qualified people approved divided by all qualified people",
          "Unqualified people approved divided by all unqualified people",
          "Qualified people divided by all people",
        ],
        answer: 1,
        explain: "TPR asks: of everyone who should be approved, how many were?",
      },
      {
        id: "u5q2",
        prompt: "What did the Gender Shades study find?",
        choices: [
          "All tested systems had the same error rate for every group",
          "Error rates differed sharply across gender and skin type",
          "The systems could not detect faces at all",
          "Accuracy was highest for darker-skinned women",
        ],
        answer: 1,
        explain: "The highest error rates were for darker-skinned women and the lowest for lighter-skinned men.",
      },
      {
        id: "u5q3",
        prompt: "Setting thresholds so qualified people in every group are approved at the same rate is called:",
        choices: ["Demographic parity", "Equal opportunity", "Calibration", "Overfitting"],
        answer: 1,
        explain: "Equal opportunity equalizes TPR. Demographic parity equalizes approval rates regardless of qualification.",
      },
    ],
    standards: ["AI4K12 Big Idea 5", "CSTA 3A-IC-24", "CSTA 3B-IC-25"],
    discussion:
      "Using separate thresholds per group equalized one rate but treats applicants with the same score differently. Is that fair? Who should get to decide?",
  },
];

export function getUnit(slug: string) {
  return units.find((u) => u.slug === slug);
}

export const allQuestions = units.flatMap((u) =>
  u.questions.map((q) => ({ ...q, unit: u.number, unitTitle: u.title }))
);
