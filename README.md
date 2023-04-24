# Dots Game


## Installation

Make sure to install the dependencies

```bash
# cd into project directory
npm install     # install dependencies
npm run dev     # run a server that will implement game logic
npm run test     # run a server that will implement game logic
```


Then, for the client side, open the html file in your browser, or alternatively `cd` into the client directory and run :

```node
node server.js
```

The above command will run a simple http server to server the `html` files and the accompanying `css`, and `js` files.

## External libraries

I used Exrpess as the node/backend framework to build an http server. Based on the instuctions, the http server itself did not need many routes. It just needs a few routes. Express is a full dependency, whereas jest is a development dependency. 

I used Jest as my testing library. All my tests are javascript files whose name is appended with `.test.js`. You can run all tests globally using `npm run test` or you can run a sepecfic test by passing a file name as an argument to `npm run test`, for instance `npm run test generatePayload`.

## Notes on Approach

I decided to make a class that would both describe and manage the state of the game itself. The client will make a request to the backend server, and the backend server itself uses an instantiated `Game` object to manage the game as it progresses. I have methods in the class so that the proper payload is rendered as the requests come in. 

Here are a few conclusions I made, based on my reflections upon the logic of the game: 

* I contemplated using a LinkedList to easily detect the head and tail of the line. I wasn't completely sure if it was worth the effort, given that the most difficult portion of the exercise was determining when line segments intersect.
* It is necessary to track each and every node that has already been used, so as to prevent those nodes from being used erroneaously. I store the already-traversed nodes in a flat array, though I could've also represented this same state in a two dimensional array of booleans.
* I used booleans where I could to keep track of whether the turn belongs to Player 1 or Player 2. I tried to have the variable names reflect the data type it describes. 
* I defined a `describePath` method that would calculate each and every node between a start and end point [inclusive]. I question whether this was a necessary strategy on my part, though it was the only way to ensure that segments do not cross each other, at least in my head.
* I also questioned whether it was efficient to calculate, at any given moment in the game, all valid start paths (which should only be the available nodes between the start and end points). I did this in the `hasAdjacentValidNodes` method.
* My testing likely fails to capture more obscure edge cases; for instance, I could not successfully implement logic that would prohbit a segment that intersects another segment diagnonally. My logic does prevent all intersections between already-traversed nodes.


