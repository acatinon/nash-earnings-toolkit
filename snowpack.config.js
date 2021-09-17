module.exports = {
  mount: {
    public: '/',
    src: '/js',
  },
  optimize: {
    bundle: true,
  },
  buildOptions: {
    out: "../docs",
    metaUrlPath: `dist`,
  },
  plugins: [
    '@snowpack/plugin-svelte',
    '@snowpack/plugin-typescript',
    '@snowpack/plugin-postcss'
  ]
}