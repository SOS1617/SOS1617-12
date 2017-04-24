exports.config = {
    seleniumAddress : 'http://localhost:9515',
    specs : ['T01-LoadResources.js', 'T02-AddResource.js'],
    capabilties: {
        'browserName' : 'phantomjs'
    }
};