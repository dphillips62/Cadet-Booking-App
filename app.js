var favMovies = new Firebase('https://moviefire62.firebaseio.com/movies');



function saveToList(event) {
  if (event.which == 13 || event.keyCode == 13) { // as the user presses the enter key, we will attempt to save the data
    var movieName = document.getElementById('movieName').value.trim();
    if (movieName.length > 0) {
      saveToFB(movieName);
    }
    document.getElementById('movieName').value = '';
    return false;
  }
};

function saveToFB(movieName) {
  // this will save data to Firebase
 
  favMovies.push({
    name: movieName,
    room:"W6",
    gear:"Would love 20 compasses"
  });
};

function refreshUI(list) {
  var lis = '';
  for (var i = 0; i < list.length; i++) {
    lis += '<li data-key="' + list[i].key + '">' + list[i].data.name + ' [' + genLinks(list[i].key, list[i].data.name) + ']</li>';
  };
  document.getElementById('favMovies').innerHTML = lis;
};

function genLinks(key, mvName) {
  var links = '';
  links += '<a href="javascript:edit(\'' + key + '\',\'' + mvName + '\')">Edit</a> | ';
  links += '<a href="javascript:del(\'' + key + '\',\'' + mvName + '\')">Delete</a>';
  return links;
};

function edit(key, mvName) {
  var movieName = prompt("Update the movie name", mvName); // to keep things simple and old skool :D
  if (movieName && movieName.length > 0) {
    // build the FB endpoint to the item in movies collection
    var updateMovieRef = buildEndPoint(key);
    updateMovieRef.update({
      name: movieName
    });
  }
}

function del(key, mvName) {
  var response = confirm("Are certain about removing \"" + mvName + "\" from the list?");
  if (response == true) {
    // build the FB endpoint to the item in movies collection
    var deleteMovieRef = buildEndPoint(key);
    deleteMovieRef.remove();
  }
}

function buildEndPoint (key) {
  return new Firebase('https://moviefire62.firebaseio.com/movies/' + key);
}
// this will get fired on inital load as well as when ever there is a change in the data


  favMovies.on("value", function(snapshot) {
    var data = snapshot.val();
    var list = [];
    for (var key in data) {
      console.log(data[key])
        if (data.hasOwnProperty(key)) {
            //name = data[key].name ? data[key].name : '';
            //if (name.trim().length > 0) {
                list.push({
                    data: data[key],
                    key: key
                })
            //}
        }
    }
    console.log(list)
    // refresh the UI
    refreshUI(list);
    makeTable(list);
});

  function makeTable(list) {
    var out = "<table class = \"table table-striped table-bordered table-condensed\">";
    out += "<thead><tr><th>Name</th><th>Room</th><th>Order</th></tr></thead>";
    for (var i = 0; i < list.length; i++) {
      out += "<tr><td>" + 
      list[i].data.name +
      "</td><td>" +
      list[i].data.room +
      "</td><td>" +
      list[i].data.gear +
      "</td></tr>";
    }
    out += "</table>";
    document.getElementById("example").innerHTML = out;
  };