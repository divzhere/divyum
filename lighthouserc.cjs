module.exports = {
  ci: {
    collect: {
      startServerCommand: "pnpm start --port 3104",
      startServerReadyPattern: "Ready in|Local:",
      url: [
        "http://127.0.0.1:3104/",
        "http://127.0.0.1:3104/essays",
        "http://127.0.0.1:3104/frameworks",
        "http://127.0.0.1:3104/frameworks/eisenhower-matrix",
        "http://127.0.0.1:3104/frameworks/signal-vs-noise",
        "http://127.0.0.1:3104/frameworks/knowledge-tree",
        "http://127.0.0.1:3104/frameworks/tat-tvam-asi",
        "http://127.0.0.1:3104/frameworks/vision-to-leverage",
        "http://127.0.0.1:3104/frameworks/eight-limbs",
        "http://127.0.0.1:3104/library",
        "http://127.0.0.1:3104/notes",
        "http://127.0.0.1:3104/journey",
        "http://127.0.0.1:3104/journey?thread=technology",
        "http://127.0.0.1:3104/experience",
        "http://127.0.0.1:3104/about",
      ],
      numberOfRuns: 3,
      settings: {
        chromeFlags: "--headless --no-sandbox",
        preset: "desktop",
      },
    },
    assert: {
      // Use each metric's median; median-run accepts the best category score.
      aggregationMethod: "median",
      assertions: {
        "categories:performance": ["error", { minScore: 0.95 }],
        "categories:accessibility": ["error", { minScore: 1 }],
        "categories:best-practices": ["error", { minScore: 0.95 }],
        "categories:seo": ["error", { minScore: 0.95 }],
        "resource-summary:script:size": ["error", { maxNumericValue: 236700 }],
      },
    },
    upload: { target: "filesystem", outputDir: ".lighthouseci" },
  },
};
