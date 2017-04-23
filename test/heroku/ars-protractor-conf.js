exports.config = {
    seleniumAddress : 'http://localhost:9515',
    specs : ['arsT01-loadData.js'],
    capabilties: {
        'browserName' : 'phantomjs'
    }
};