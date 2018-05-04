// CUSTOM JS FILE //
window.addEventListener('load',init);

function init(){
    // on page load, get data and render
    getData();
}

function getData(){
    $.ajax({
        url: '/api/get',
        type: 'GET',
        failure: function(err){
            console.log ("Could not get the data");
            return alert("Something went wrong");
        },
        success: function(data) {
            console.log(data);
            var dreams = data.dreams;
            dreams.forEach(function(currentDream){
                var htmlToAppend =
                '<div class="col-md-4 card">'+
                    '<h1>'+currentDream.date+'</h1>'+
                    '<img src="'+currentDream.url+'" />'+
                    '<div class="dayHolder">'+
                    '<div class="nextTo">'+
                    '<div class="number">'+
                    '<div class="smallHead">'+
                    'Times awake'+ 
                    '</div>'+
                    '<div class="boldNumber">'+currentDream.awake+
                    '</div>'+
                    '</div>'+
                    '<div class="number">'+
                    '<div class="smallHead">'+
                    'Snore score'+ 
                    '</div>'+
                    '<div class="boldNumber">'+currentDream.snore+
                    '</div>'+
                    '</div>'+
                    '</div>'+
                    '</div>'+
                    '<div class="dayHolder">'+
                    '<div class="nextTo">'+
                    '<div class="number">'+
                    '<div class="smallHead">'+
                    'Stress'+ 
                    '</div>'+
                    '<div class="boldNumber">'+currentDream.stress+
                    '</div>'+
                    '</div>'+
                    '<div class="number">'+
                    '<div class="smallHead">'+
                    'Length'+ 
                    '</div>'+
                    '<div class="boldNumber">'+currentDream.length+
                    '</div>'+
                    '</div>'+
                    '</div>'+
                    '</div>'+
                    
                    '<div class="tagHolder">'+
                        renderTags(currentDream)+
                    '</div>'+
                    '<div class="control-panel">'+
                        '<a href="/api/delete/'+currentDream._id+'">Delete</a>'+
                        '<br/>'+
                        '<a href="/edit/'+currentDream._id+'">Edit</a>'+
                    '</div>'+
            '</div>'
                $('#dream-holder').append(htmlToAppend);
            })
        }
    });
}

function renderTags(currentDream){

    var tags = '';
    for(var i = 0; i<currentDream.tags.length; i++){
        tags = tags +'<div class="tag">'+currentDream.tags[i]+'</div>'
    }

    return tags;

}
