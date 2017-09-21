// Log that the api routes file has been connected to
console.log('API Route Connected Successfully');

// Link in friends.js
var friendsData = require('../data/friends.js');

// Includes GET and POST Routes
function apiRoutes(app) {

  // A GET route with the url /api/friends. This will be used to display a JSON of all possible friends.
  app.get('/api/friends', function (req, res) {
    res.json(friendsData);
  });

  // A POST routes /api/friends. Used to handle incoming survey results. 
  // This route will also be used to handle the compatibility logic.
  app.post('/api/friends', function (req, res) {

    // Parse new friend input to get integers
    var newFriend = {
      name: req.body.name,
      photo: req.body.photo,
      scores: []
    };
    var ansArray = [];
    for(var i=0; i < req.body.scores.length; i++){
      ansArray.push( parseInt(req.body.scores[i]) )
    }
    newFriend.scores = ansArray;

    // Cross check the new friend entry with the existing ones
    var scoreComparisionArray = [];
    for(var i=0; i < friendsData.length; i++){

      // Check each friend's scores and sum difference in points
      var currentComparison = 0;
      for(var j=0; j < newFriend.scores.length; j++){

      	// Finding Absolute value so there are no issues with negatives
        currentComparison += Math.abs( newFriend.scores[j] - friendsData[i].scores[j] );
      }

      // Push each comparison between friends to array
      scoreComparisionArray.push(currentComparison);
    }

    // Determine the best match using the postion of best match in the friendsData array
    var bestMatchPosition = 0; // assume its the first person
    for(var i=1; i < scoreComparisionArray.length; i++){
      
      // Lower number in comparison difference means better match
      if(scoreComparisionArray[i] <= scoreComparisionArray[bestMatchPosition]){
        bestMatchPosition = i;
      }
    }

    // If the 2 friends have the same comparison, then the NEWEST entry in the array is chosen
    var bestFriendMatch = friendsData[bestMatchPosition];

    // Reply with the best match
    res.json(bestFriendMatch);

    // Push the new friend to the friends data array for storage
    friendsData.push(newFriend);
  });
}

// Export for use in main server.js file
module.exports = apiRoutes;