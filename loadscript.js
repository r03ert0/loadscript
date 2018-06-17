var LoadScript = (function () {
    var me = {
        index: 0,
        /**
         * @function tryLoad
         * @desc Tries to load the script at url. Rejects the promise on failure.
         * @param {string} url URL to script, either a local path or a url.
         * @param {string} fileType Either 'script' or 'style'
         * @returns {object} A promise fulfilled when the script is loaded
         */
        tryLoad: function tryLoad(url, fileType) {
            switch(fileType) {
                case 'script':
                    return me.tryScript(url);
                case 'style':
                    return me.tryStyle(url);
            }
        },
        /**
         * @function tryScript
         * @desc Tries to load the script at url. Rejects the promise on failure.
         * @param {string} url URL to script, either a local path or a url.
         * @returns {object} A promise fulfilled when the script is loaded
         */
        tryScript: function tryScript(url) {
            return new Promise(function (resolve, reject) {
                var s = document.createElement("script");
                s.src = url;
                s.id = `loadScript_${me.index}`;
                s.onload=function () {
                    document.getElementById(`loadScript_${me.index}`).removeAttribute('id');
                    resolve();
                };
                s.onerror=function() {
                    document.getElementById(`loadScript_${me.index}`).remove();
                    reject(`The script #${me.index} did not load`);
                };
                document.body.appendChild(s);
            });
        },
        /**
         * @function tryStyle
         * @desc Tries to load the style at url. Rejects the promise on failure.
         * @param {string} url URL to script, either a local path or a url.
         * @returns {object} A promise fulfilled when the style is loaded
         */
        tryStyle: function tryStyle(url) {
            return new Promise(function (resolve, reject) {
                var link = document.createElement( "link" );
                link.href = url;
                link.id = `loadStyle_${me.index}`;
                link.type = "text/css";
                link.rel = "stylesheet";
                link.onload=function() {
                    resolve();
                };
                link.onerror=function() {
                    reject(`The style #${me.index} did not load`);
                };
                document.getElementsByTagName( "head" )[0].appendChild( link );
            });
        },
        /**
         * @function load
         * @desc Loads script from pathObj if test is not fulfilled. It tries all the paths in pathObj until one works.
         * @param {string|array} path Path to script, either a local path or a url. If array, paths listed first are preferred.
         * @param {string} fileType Either 'script' or 'style'
         * @param {function} testScriptPresent Function to test if the script is already present. If undefined, the script will be loaded.
         * @returns {object} A promise fulfilled when the script is loaded
         */
        load: function load(pathObj, fileType, testScriptPresent) {
            let pathArray;
            if(Object.prototype.toString.call(pathObj) === '[object String]') {
                pathArray = [pathObj];
            } else {
                pathArray = pathObj;
            }
            return new Promise(function (resolve, reject) {
                me.tryLoad(pathArray[me.index], fileType)
                .then(resolve)
                .catch((err)=>{
                    me.index ++;
                    if(me.index < pathArray.length) {
                        me.load(pathArray, fileType)
                        .then(resolve)
                        .catch((err)=>console.error);
                    } else {
                        reject("None of the paths worked.");
                    }
                });
            });
        },
        loadScript: function loadScript(pathObj, testScriptPresent) {
            return me.load(pathObj, 'script', testScriptPresent);
        },
        loadStyle: function loadStyle(pathObj) {
            return me.load(pathObj, 'style');
        }
    };
    return me;
})();
