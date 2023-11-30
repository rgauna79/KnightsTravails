// function isValidMove(x, y) {
//     return x >= 0 && x < 8 && y >= 0 && y < 8;
// }

// function moves(square) {
//     const [x, y] = square;
//     const possible_moves = [
//         [x + 2, y + 1],
//         [x + 2, y - 1],
//         [x - 2, y + 1],
//         [x - 2, y - 1],
//         [x + 1, y + 2],
//         [x + 1, y - 2],
//         [x - 1, y + 2],
//         [x - 1, y - 2],
//     ];
//     return possible_moves.filter(([nx, ny]) => isValidMove(nx, ny));
// }

// function knightMoves(start, end) {
//     const visited = new Set();
//     const queue = [[start, [start]]];
// //     
//     while (queue.length > 0) {
//         const [current_square, path] = queue.shift();
       
//         if (current_square[0] === end[0] && current_square[1] === end[1]) {
//             console.log(`You made it in ${path.length - 1} moves! Here's your path:`);
//             path.forEach(square => console.log(square));
//             return path.length - 1;
//         }
//         if (!visited.has(JSON.stringify(current_square))) {
//             visited.add(JSON.stringify(current_square));
//             const neighbors = moves(current_square);
//             neighbors.forEach(neighbor => {
//                 if (!visited.has(JSON.stringify(neighbor))) {
//                     queue.push([neighbor, [...path, neighbor]]);
//                 }
//             });
//         }
//     }

//     return "No valid path found.";
// }


// // Examples
// knightMoves([0, 0], [1, 2]);
// //knightMoves([0, 0], [3, 3]);
// //knightMoves([3, 3], [0, 0]);
// //knightMoves([0, 0], [7, 7]);

//Knights - Travails new method

// Constants for knight moves
const MOVE_TOP_RIGHT = 0;
const MOVE_RIGHT_TOP = 1;
const MOVE_RIGHT_BOTTOM = 2;
const MOVE_BOTTOM_RIGHT = 3;
const MOVE_BOTTOM_LEFT = 4;
const MOVE_LEFT_BOTTOM = 5;
const MOVE_LEFT_TOP = 6;
const MOVE_TOP_LEFT = 7;

//Build game board array
function buildBoard() {
    let board = [];
    for (let j = 0; j < 8; j++){
        for (let i = 0; i < 8; i++){
            board.push([j,i]);
        }
    }
    return board;
}

// Return the index of a target spot in a array
function findIndex(arr, target) {
    for (let i = 0; i < arr.length; i++){
        if (arr[i][0] === target[0] && arr[i][1] === target[1]) {
            return i;
        }
    }
}

// Build array of objects with the info of each board square
function buildInfoArr(boardArr, startIndex) {
    let newArr = [];
    for (let i = 0; i < boardArr.length; i++){
        newArr[i] = {
            distance: null,
            predecessor: null
        }
    }
    newArr[startIndex].distance = 0;
    return newArr;
}

// Calculate next potential move for knight
function findNextMove(index, x, y){
    switch (index) {
        case MOVE_TOP_RIGHT:
            return [x + 2, y + 1];
        case MOVE_RIGHT_TOP:
            return [x + 1, y + 2];
        case MOVE_RIGHT_BOTTOM:
            return [x-1, y+2];
        case MOVE_BOTTOM_RIGHT:
            return [x-2, y+1];
        case MOVE_BOTTOM_LEFT:
            return [x-2, y-1];
        case MOVE_LEFT_BOTTOM:
            return [x-1, y-2];
        case MOVE_LEFT_TOP:
            return [x+1, y-2];
        case MOVE_TOP_LEFT:
            return [x+2, y-1];   
        }
}

// Check if target spot is contained within array
function containsSpot(arr, target) {
    return arr.some(element => element[0] === target[0] && element[1] === target[1]);
}

// Build adjency list from chess board array
function buildAdjList(board) {
    let adjList = [];
    for (let i = 0; i < board.length; i++) {
        let neighbors = [];
        for (let j = 0; j < 8; j++) {
            let neighbor = findNextMove(j, board[i][0], board[i][1]);
            if (containsSpot(board, neighbor)) {
                neighbors.push(findIndex(board, neighbor))
            }
        }
        adjList[i] = neighbors;
    }
    return adjList;
}

// Construct a path by tracing predecessor of each square object
function constructPath(board, infoArr, item, index, newArr) {
    //if (item.predecessor === null) return;
    if (item.predecessor != null) {
        newArr.push(board[index]);
        constructPath(board, infoArr, infoArr[item.predecessor], item.predecessor, newArr);
    }
}

function knightMoves(start,end){
    let board = buildBoard();
    let startIndex = findIndex(board, start);
    let endIndex = findIndex(board, end);
    let bfsInfo = buildInfoArr(board, startIndex);
    let adjList = buildAdjList(board);
    let queue = [startIndex];
    let u;
    
    while (u != endIndex) {
        // Set first element of queue equal to u variable
        u = queue.shift();

        //Iterate through each neighbor v of u
        for (let i=0; i < adjList[u].length; i++) {
            let vIndex = adjList[u][i];
            // If the neighbor index is the end square, build & return path
            if (vIndex === endIndex) {
                bfsInfo[vIndex].predecessor = u;
                let path = [];               
                constructPath(board, bfsInfo, bfsInfo[vIndex], vIndex, path);
                path.reverse().unshift(start);
                console.log(`You made it in ${path.length - 1} moves! Here's your path:`);
                return path;
            } else {
                // Update info for neighbor square & enqueue it
                if (bfsInfo[vIndex].distance == null) {
                    bfsInfo[vIndex].distance = bfsInfo[u].distance + 1;
                    bfsInfo[vIndex].predecessor = u;
                    queue.push(vIndex);
                }
            }
        }
    }   

}

let result = knightMoves([0, 0], [3, 3]);
console.log(result);
