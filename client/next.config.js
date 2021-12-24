//this is file to fix nextJS reaction to changes in the files (sometimes 
//doesn't work)

module.exports = {
    webpackDevMiddleware: config => {
        config.watchOptions.poll = 300;
        return config;
    }
}