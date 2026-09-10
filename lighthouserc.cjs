module.exports = {
  ci: {
    collect: {
      startServerCommand: "pnpm start --port 3104",
      startServerReadyPattern: "Ready in|Local:",
      url: [
        "http://127.0.0.1:3104/",
        "http://127.0.0.1:3104/essays",
        "http://127.0.0.1:3104/notes",
        "http://127.0.0.1:3104/journey",
        "http://127.0.0.1:3104/about",
      ],
      numberOfRuns: 3,
      settings: {
        chromeFlags: "--headless --no-sandbox",
        preset: "desktop",
      },
    },
    assert: {
      aggregationMethod: "median-run",
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
