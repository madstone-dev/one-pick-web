module.exports = {
  client: {
    includes: ["./src/**/*.{tsx,ts}"],
    tagName: "gql",
    service: {
      name: "one-pick-backend",
      url: "http://localhost:4000/",
    },
  },
};
