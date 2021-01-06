/*
The info variable is a global object that will hold the json object, nomination count, 
a list of movie ids for managing nomminations, 
and a list of nomination strings to use as the 
output for the nomination list
*/
let info = {obj:{}, count: 0, id:[], cell:[]};


/**
 * This function requests search data from the OMDB API and outputs search results
 */
function loadDoc() {
  var xhttp = new XMLHttpRequest();
    let search = document.getElementById("searchbar").value;
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
	   //object holds the the json reluts of search
	   let movies = JSON.parse(this.responseText);
        info.obj = movies;
        //variable to hold the inner button text
        let buttoninner = "";
        //variable to hold output of movie info to the webpage
        let output = "";
        if(movies.Response === "False"){
            output = "No matches found for:" + " " + search;
        }
        else{
            //loops through object and outputs list of movies with title and year and nominate button
            for(let i = 0; i < movies.Search.length; i++){
                //condition statement changes the nominate button to say added if already nominated 
                if(checkForAdded(i)){
                   buttoninner = "Added";
                   }
                else{
                    buttoninner = "Nominate"
                }

                output += 
                    '<div class="results">' + 
                    '<ul>' +
                    '<li>'+movies.Search[i].Title+'</li>' +
                    '<li>'+movies.Search[i].Year+'</li>' +
                    '</ul>' +
                    '<button class="whitebutton" id="'+i+'">'+buttoninner+'</button>' +
                    '</div>';
                console.log(output);

            }
        }
        //displays movie results in rusults area 
        document.getElementById("resultlist").innerHTML = output;
        console.log(info.obj);
    }
  };
		//requests the search data from api
		
  xhttp.open("GET", "https://www.omdbapi.com/?s="+search+"&type="+"movie"+"&apikey=fc8f612b", true);
  xhttp.send();
}

/**
 * This function adds a movie to the nomination list
 * using the event target of the button click
 * @param  {Object} obj   The json object
 * @param  {Object} Event The global DOM event object
 */
const addToNom = (obj, Event) => {
    let output = document.getElementById("list").innerHTML;
    let curmovie = "";
    let index = parseInt(event.target.id);
    if(event.target.tagName === "BUTTON" && info.count < 5 
       && event.target.innerHTML != "Added"){
    event.target.innerHTML = "Added";
    curmovie ='<div class="results">' + 
                '<ul>' +
                '<li>'+obj.Search[index].Title+'</li>' +
                '<li>'+obj.Search[index].Year+'</li>' +
                '</ul>' +
                '<button class="whitebutton" id="'+obj.Search[index].imdbID+'">Remove</button>' +
                '</div>';
        output += curmovie;
        console.log(output);
        document.getElementById("list").innerHTML = output;
        //adds the current nominated item/html to cell array
        info.cell.push(curmovie);
        //adds current nominated items imdb id to id array
        info.id.push(obj.Search[index].imdbID);
        //increment the count to monitor nomination count
        info.count++;
        //check if there are 5 nominations and diplay banner if there are 5
        displayBanner(info.count);
        
    }
}

/**
 * This function displays the banner once the nomination list reaches 5
 * @param  {Number} nomcount The nomination count saved in the info object
 */
function displayBanner(nomcount){
    let x = document.getElementById("banner");
    if(nomcount === 5){
        x.style.display = "block";
    }
    else{
        x.style.display = "none";
    }
}

/**
 * This function removes movies from the nomination list
 */
function remove(){
    let id = event.target.id;
    let output = "";
    
    if(event.target.tagName === "BUTTON"){
        info.count--;
        displayBanner(info.count);
        //check if the current reults have the removed item in the list
        //change button to nominate to reactivate
        reactivateNomButton(id);
        for(let i = 0; i < info.cell.length; i++){
            if(id === info.id[i] ){
                info.cell.splice(i, 1);
                info.id.splice(i, 1);
                if(info.cell.length != i){
                    output += info.cell[i];
                }
                if(info.count === 0){
                    output = "";
                }
           }
            //keep the elements in the output list that are not being removed
            else{
                output += info.cell[i];
            }
        }
        document.getElementById("list").innerHTML = output;
    }
}

/**
 * This function checks if a movie was already added to the nomination list
 * @param  {Number} index The index of the movie in the search list
 * @return {Boolean}      True if the movie was added or false if not added
 */
function checkForAdded(index){
    let check = false;
    console.log(info.id.length);
    
        for(let i = 0; i < info.id.length; i++){
            if(info.obj.Search[index].imdbID === info.id[i]){
                return true;   
            } 
        }
    return check;
    
}

/**
 * This function checks if the current movie search list has the movie to be removed from nomination list
 * and reactivates the nomination button
 * @param  {String} movieid The id of the movie selected to be removed from the nomination list
 */
function reactivateNomButton(movieid){
    if(info.obj.Response != "False"){
        for(let i = 0; i < info.obj.Search.length; i++){
            if(info.obj.Search[i].imdbID === movieid){
                document.getElementById(i.toString()).innerHTML = "Nominate";

           }
        }
    }
}
//main area for function calls and event listeners

//event listener begins the search automatically on keyup
document.getElementById("searchbar").addEventListener("keyup", loadDoc);
//add event listener to reulsts area here
let x = document.getElementById("resultsarea");
x.addEventListener("click", function(){ addToNom(info.obj, Event); })
document.getElementById("list").addEventListener("click", remove);