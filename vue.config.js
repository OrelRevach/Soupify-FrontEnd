module.exports = {
  transpileDependencies: ["vuetify"],
  publicPath:
    process.env.NODE_ENV === "production"
      ? "/webenv-assignment3-client-dist/"
      : "/"
};
