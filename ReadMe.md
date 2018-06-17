#loadscript.js
Roberto Toro, June 2018

A utility to load scripts where multiple alternative sources are available. For example, the first alternative can be an online CDN, and the 2nd alternative a local version of the same code (useful for offline development). The calling function also provides place for a test function to check if the script has already been loaded. If that is the case, it will not be loaded again.

Example usage is demonstrated in `index.html`:

```
<html>
<script src="loadscript.js"></script>
<script>
LoadScript.loadScript([
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js',
    'http://localhost/libs/jquery/3.1.1/jquery.min.js'
])
.then(()=>{
    console.log("It worked!");
})
.catch((err)=>console.error);
</script>
</html>
```

First, we load `loadscript.js`. Next, we try to load `jQuery` first from cloudflare, and if that doesn't work, from localhost (The function supposes that a version of `jQuery` has been downloaded to the local served).