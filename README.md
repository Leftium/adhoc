# Adhoc: the Web Dev's Lil' Helper

Start a web server in that directory. This instant!
<hr />
**Main Benefits**

- Start a lightweight web server from anywhere with a single command
- No need to repeatedly press [F5] \(reload) or even start your browser!
- Instantly see changes to web pages after saving an asset (simultaneously from multiple browsers!)
- View most pertinent server log information at a glance
- Navigate to a local WIP web site from your browser


**Simple Installation:**

    npm -g install adhoc


**How to Use:**

    $ ls
    index.html style.css script.js image.png

    $ adhoc
    The adhoc server is now hosting c:/wip-site/ at http://localhost:80/
    Started live reload server on port 35729
    Hit CTRL-C to stop the servers. Launching your default browser...
    GET 200  54ms - 11.16kb /
    GET 200   9ms -  5.20kb /style.css
    GET 200  45ms - 97.63kb /script.js
    ...
    ...

*Edit index.html, script.js, style.css, or image.png...
watch all your browsers refresh automatically!*


**Usage Instructions:**

    adhoc [options] [path]

      -n, --nobrowser       supress automatic browser launch
      -v, --verbosity=NUM   server log level 0 to 4         [3]
      -p, --port=NUM        port to use [80]
      -r, --noreload        supress live reload
      -c, --cache=SECONDS   browser cache time (in seconds) [0]
      -i, --index=FILENAME  default index filename [index.html]
      -h, --help            display this help


Copyright John-Kim Murphy

Based on [http-server](https://github.com/nodeapps/http-server)
