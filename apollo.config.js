module.exports = {
  client: {
    includes: [
      "./src/**/*.{tsx,ts}",
      "./pages/**/*.{tsx,ts}",
      "./components/**/*.{tsx,ts}",
    ],
    tagName: "gql",
    service: {
      name: "one-pick-backend",
      url: "http://localhost:4000/",
    },
  },
};
