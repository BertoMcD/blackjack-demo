# Pre-configured Grunt commands

## Local development
For local development run the following command and open a web browser at http://localhost:8000.

`grunt local`

This will compile the SASS, autoprefix the CSS, create a sourcemap, compile the Twig templates, start up a local web server, and start the Grunt Watch task.

## Production build
To create a production build run the following command:

`grunt build` or just the default `grunt` command.

This will compile the SASS without a source map and minify and autoprefix the resulting CSS, and compile the Twig templates.

## Production build with local server
To test the production build on your local machine run this command and open a web browser at http://localhost:8000.

`grunt serve`

Same as above but also starts a Grunt web server.