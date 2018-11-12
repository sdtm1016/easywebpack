'use strict';
module.exports = class WebpackOptimize {
  constructor(ctx) {
    this.ctx = ctx;
    this.optimization = ctx.utils.cloneDeep(ctx.config.optimization || {});
  }

  getCommonsChunk() {
    const commonsChunks = [];
    const optimization = this.getWebOptimization();
    const { runtimeChunk = {}, splitChunks = {} } = optimization;
    const { cacheGroups = {} } = splitChunks;
    if (runtimeChunk.name) {
      commonsChunks.push(runtimeChunk.name);
    }
    Object.keys(cacheGroups).forEach(key => {
      const group = cacheGroups[key];
      const name = group.name || key;
      if (!commonsChunks.includes(name)) {
        commonsChunks.push(name);
      }
    });
    return commonsChunks;
  }

  getCacheVendors() {
    const { lib } = this.ctx.config;
    const strRegex = Array.isArray(lib) ? lib.join('|') : '.*';
    const test = new RegExp(`node_modules/(${strRegex})\\.js`);
    return {
      name: 'common',
      chunks: 'initial',
      minChunks: 2,
      test
    };
  }

  getCacheStyles() {
    return {
      name: 'common',
      chunks: 'initial',
      minChunks: 2,
      test: /\.(css|less|scss|stylus)$/
    };
  }

  normalizeMinimizer() {
    if (!this.ctx.prod && this.optimization.minimizer) {
      delete this.optimization.minimizer;
    }
    return this.optimization;
  }

  getOptimization() {
    const { runtimeChunk, splitChunks } = this.optimization;
    if (runtimeChunk) {
      delete this.optimization.runtimeChunk;
    }
    if (splitChunks) {
      delete this.optimization.splitChunks;
    }
    return this.normalizeMinimizer();
  }

  getWebOptimization() {
    const optimization = this.normalizeMinimizer();
    return this.ctx.merge({
      runtimeChunk: {
        name: 'runtime'
      },
      splitChunks: {
        chunks: 'initial',
        minSize: 30000,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        name: false,
        cacheGroups: {
          vendors: this.getCacheVendors(),
          styles: this.getCacheStyles()
        }
      }
    }, optimization);
  }

  getNodeOptimization() {
    return this.getOptimization();
  }
};