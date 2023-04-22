# Dots Game

## Notes

* I need to keep track of all the nodes that have been used
    Do I need to keep track of which direction each move has gone?
* How do I know at any given moment which nodes are the "begin" / "end" nodes?
    track for every move which nodes are available?
        when that length is zero, the game is over
* lines must be octilinear (meaning by 45deg or more). By its very nature, octilinear segments require that we can only pass through points we may possibly have already visited. (i.e., there is no possible way to intersect a previous segment in between nodes. Our segments can only ever intersect nodes).




