import React, {Component} from 'react';
import './App.css';
import Spotify from 'spotify-web-api-js'

//Defines the api wrapper
const spotifyWebApi = new Spotify({
  client_id: '39efc2e0e04641d9a440b4117e1cb2a1',
client_secret: 'f476a0de090e41a7879c5b6435d44b4d',
redirect_uri: 'http://localhost:8888/callback'
})

//initialises elements and access token
class App extends Component {
    constructor(){
    super();
    const params = this.getHashParams();
    this.state = {
      loggedIn: params.access_token ? true: false,
      display : {
        name: 'Not Loaded',
        image: ''
      }
    }
    if (params.access_token){
      spotifyWebApi.setAccessToken(params.access_token)
      
    }
  }

  //Gets the hash parameters
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

//retrieves the current song and assigns it to the display
getNowPlaying(){
  try{
  spotifyWebApi.getMyCurrentPlaybackState().then((response) =>
  {this.playSong()
    if(response.context != null){this.setState({
    display: {
      name: "Now Playing: " +response.item.name,
      image: response.item.album.images[0].url
    },
  })}
    else{
      this.playSong()
      this.getNowPlaying()
    }}
  )
  }
catch(err){
  console.log('Nothing Playing or Something went wrong!', err);
}
}

//retrieves the user's top artist and assigns it to the display
getArtists(){
  spotifyWebApi.getMyTopArtists().then((response) =>
  {let topArtists = response;
    console.log(topArtists);
    this.setState({
    display:{
      name: "Your Top Artist: " + topArtists.items[0].name,
      image: topArtists.items[0].images[2].url
    }
  })})
}

//follows the specified playlist
followPlaylist(){
  spotifyWebApi.followPlaylist('4rRDxmCkGNlDBSOblRYdvv'
  ).then(function(data) {
     console.log('Playlist successfully followed');
  }, function(err) {
    console.log('Something went wrong!', err);
  });
  this.playSong()
  this.getPlayList()
}

//resunmes playback of the current song
playSong(){
  spotifyWebApi.play({context_url:'spotify:playlist:4rRDxmCkGNlDBSOblRYdvv' }).then(function() {
    console.log('Playback started');
  }, function(err) {
    //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
    console.log('Something went wrong with playing!', err);
  });
}

//retrieves the specified playlist data and assigns it data
getPlayList(){
  spotifyWebApi.getPlaylist('4rRDxmCkGNlDBSOblRYdvv', "")
  .then((data) => {
    this.setState({
    display:{
      name: "Check Your Playlists!",
      image: data.images[0].url
    }
  })})
}


render(){
  return (
    <div className="App">
      <body>
      <div >
          <text class= "title"> Expand.
          </text>
          
        </div>
        <div>
        <text  class="subtitle">“The only truth is music.”</text>
          </div>
          <div>
          <a href = 'http://localhost:8888'>
            <button class="spotify">Login With Spotify</button>
          </a>
        </div>
        <div class="menu">
        <div>
     
            <button onClick = {() => this.getNowPlaying()} class="random">Check Current/Resume</button>

        </div>
        <div>
            <button onClick = {() => this.getArtists()} class="playlist">My Top Artist</button>
        </div>
        <div>
        <button onClick = {() => this.followPlaylist()} class="playlist">Follow Recommended Playlist</button>
        </div>
        </div>
        <div>
          <img src={this.state.display.image} class = "cover"/>
          <text class="displayText">{this.state.display.name}</text>
        </div>
      </body>
    </div>
  );
}
}
export default App;
