var LoadScript = (function () {
    var me = {
        index: 0,
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
                    resolve(true);
                };
                s.onerror=function() {
                    document.getElementById(`loadScript_${me.index}`).remove();
                    reject(`The script #${me.index} did not load`));
                };
                document.body.appendChild(s);
            });
        },
        /**
         * @function loadScript
         * @desc Loads script from pathObj if test is not fulfilled. It tries all the paths in pathObj until one works.
         * @param {string|array} path Path to script, either a local path or a url. If array, paths listed first are preferred.
         * @param {function} testScriptPresent Function to test if the script is already present. If undefined, the script will be loaded.
         * @returns {object} A promise fulfilled when the script is loaded
         */
        loadScript: function loadScript(pathObj, testScriptPresent) {
            let pathArray;
            if(Object.prototype.toString.call(pathObj) === '[object String]') {
                pathArray = [pathObj];
            } else {
                pathArray = pathObj;
            }
            return new Promise(function (resolve, reject) {
                me.tryScript(pathArray[me.index])
                .then(resolve)
                .catch((err)=>{
                    me.index ++;
                    if(me.index < pathArray.length) {
                        me.loadScript(pathArray)
                        .then(resolve)
                        .catch((err)=>console.error);
                    } else {
                        reject("None of the paths worked.");
                    }
                });
            });
        }
    };
    return me;
})();
