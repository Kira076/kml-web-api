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
        .wait('.browse-gifs-container')
        .evaluate((cacheLimit, latestMode, term) => (new Promise((res, rej) => {
            let jsonResults = {};
            if (document.getElementsByClassName('empty-search').length > 0) {
                jsonResults.success = false;
                jsonResults.error = "ResultsNotFound";
                rej(jsonResults);
            }
            else {
                var searchString = latestMode ? `https://api.redgifs.com/v1/gfycats/trending?tagName=${encodeURIComponent(term)}&count=${cacheLimit}` : `https://api.redgifs.com/v1/gfycats/search?search_text=${encodeURIComponent(term)}&count=${cacheLimit}&start=0`
                fetch(searchString)
                    .then(response => response.json())
                    .then(json => {
                        jsonResults = {success: true, response: json};
                        res(jsonResults);
                    })
                    .catch(err => {
                        jsonResults = {success: false, error: err};
                        rej(jsonResults);
                    });
            }
        })), this.cacheLimit, this.lastestMode, term)
        .end()
        .then(jRes => {
            console.log(jRes);
        })
        .catch(error => {
            searchResult = {success: false, error: error};
            console.error('Whoopsie!: ', error);
        })
    }
}

const instance = new Crawler(true, 150, true);
/*(async () => {
    try {
        debugger
        var search = await instance.rg_search('blue')
        debugger
        console.log(search)
    }
    catch(error){
        debugger
        console.log('Whoops!', error);
    }
})()*/
instance.rg_search('blue')
