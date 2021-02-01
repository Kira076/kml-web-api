const e = require('express');
const Nightmare = require('nightmare');

class Crawler {
    constructor(debugMode, cacheLimit, lastestMode) {
        this.nightmare = Nightmare({ show: debugMode });
        this.cacheLimit = cacheLimit;
        this.lastestMode = lastestMode;
        this.sites = { 
            rg: {
                url: 'https://www.redgifs.com/', 
                search_bar: '.search-input',
                search_button: '.search-button',
            },
            pg: {
                url: 'https://porngifs.com/',
                search_bar: '#search'
            }
        }
    };

    async rg_search(term) {
        var searchResult;
        this.nightmare
        .goto('https://www.redgifs.com/')
        .type('.search-input', term + '\u000d')
        .evaluate((cacheLimit, latestMode, term) => {
            var jsonResults = {};
            if (document.getElementsByClassName('empty-search').length > 0) {
                jsonResults.success = false;
                jsonResults.error = "ResultsNotFound";
                return jsonResults
            }
            else {
                var searchString = latestMode ? `https://api.redgifs.com/v1/gfycats/trending?tagName=${encodeURIComponent(term)}&count=${cacheLimit}` : `https://api.redgifs.com/v1/gfycats/search?search_text=${encodeURIComponent(term)}&count=${cacheLimit}&start=0`
                (async () => {
                    try {
                        var response = await fetch(searchString);
                        jsonResults.success = true;
                        jsonResults.response = response;
                    }
                    catch(error) {
                        jsonResults.success = false;
                        jsonResults.error = error;
                    }
                })();
                return jsonResults
            }
        }, this.cacheLimit, this.lastestMode, term)
        .end()
        .then(json => {
            searchResult = json
            console.log('Success!', searchResult);
        })
        .catch(error => {
            searchResult = {success: false, error: error};
            console.error('Whoopsie!: ', error);
        });
        return searchResult
    }
}

module.exports = Crawler;