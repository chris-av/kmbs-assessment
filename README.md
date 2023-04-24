# Dots Game


## Installation

Make sure to install the dependencies

```bash
# cd into project directory
npm install 
```


Then, for the client side, open the html file in your browser, or alternatively `cd` into the client directory and run :

```node
node server.js
```

The above command will run a simple http server to server the `html` files and the accompanying `css`, and `js` files.

## External libraries

I used Exrpess as the node/backend framework to build an http server. Based on the instuctions, the http server itself did not need many routes. It just needs a few routes. Express is a full dependency, whereas jest is a development dependency. You may run my tests by running the command `npm run dev`.

## Notes on Approach

I decided to make a class that would both describe and manage the state of the game itself. The client will make a request to the backend server, and the backend server itself uses an instantiated `Game` object to manage the game as it progresses. I have methods in the class so that the proper payload is rendered as the requests come in. 

Here are a few conclusions I made, based on my reflections upon the logic of the game: 

* I should have extended the Object Oriented approach further to create a data structure for each individial node
* might make more sense to use a LinkedList to easily detect the head and tail of the line
* for sake of time, I chose to write my project to successfully describe a 4x4 grid, though I am sure with a little tinkering, my code could be made more generalizable for an nxn grid.
* It is necessary to track each and every node that has already been used, so as to prevent any intersection.
* given the nature of the grid, I only need to track which nodes have been used. I do not need to rely on algebraic equations to determine if an intersection between segments have occurred. Therefore, I defined a simple, flat array of `past_moves` with no sense of direction among the nodes.
* I used booleans where I could to keep track of whether the turn belongs to Player 1 or Player 2. I tried to have the variable names reflect the data type it describes.
* I defined a `describePath` method that would calculate each and every node between a start and end point [inclusive]. I question whether this was a necessary strategy on my part, though it was the only way to ensure that segments do not cross each other, at least in my head.
* I also questioned whether it was efficient to calculate, at any given moment in the game, all valid start paths (which should only be the available nodes between the start and end points). 
* My testing likely fails to capture more obscure edge cases; also, I believe I could be more efficient in testing a class with shared state between tests


## Notes

* I need to keep track of all the nodes that have been used
    Do I need to keep track of which direction each move has gone?
* How do I know at any given moment which nodes are the "begin" / "end" nodes?
    track for every move which nodes are available?
        when that length is zero, the game is over
* lines must be octilinear (meaning by 45deg or more). By its very nature, octilinear segments require that we can only pass through points we may possibly have already visited. (i.e., there is no possible way to intersect a previous segment in between nodes. Our segments can only ever intersect nodes).




