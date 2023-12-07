module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(csv)$/,
      use: {
        loader: 'csv-loader',
        options: {
          dynamicTyping: true,
          header: true,
          skipEmptyLines: true,
        },
      },
    });
    return config;
  },
};
