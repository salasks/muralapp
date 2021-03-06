(function(m){
  m.Details = function(options) {
    var _options = $.extend({
      detailTarget: '.detail-container',
      detailHeader: '.detail-header'
    }, options),
    _id;

    function _refreshDetail(id) {
        var $container = $('div[data-url*="details.html?id='+id+'"]'),
            $detailTarget = $(_options.detailTarget, $container).html('Loading...');
        
        $.ajax({
            url: 'http://x.iriscouch.com/murals/_design/assets/_list/asset/assetid?key='+id,
            crossDomain: true,
            dataType: 'jsonp',
            success: function (mural, textStatus, jqXHR) {
                // Set the page title
                $(_options.detailHeader, $container).html(mural.Title);
                
                var detailsHtml = imageHtml = '';
                detailsHtml += '<div class="details_title">'+mural.Title+'</div>';
                
                // This whole image handling code seems clunky
                if(mural.mediaIds.length > 0) {
                    detailsHtml += '<img src="http://www.muralfarm.org/MuralFarm/MediaStream.ashx?mediaID='+mural.mediaIds[0]+'&.jpg" />';
                    if(mural.mediaIds.length > 1) {
                        for(var i=1; i < mural.mediaIds.length; i++) {
                            imageHtml += '<img src="http://www.muralfarm.org/MuralFarm/MediaStream.ashx?mediaID='+mural.mediaIds[i]+'&.jpg" />';
                        }
                    }
                }
                detailsHtml += '<ul>';
                $.each(mural, function(i, n) {
                    // HACK - the following if could be done more gracefully
                    if(n != '' && i != 'assetId' && i != 'geometry' && i != 'Title' && i != '_id' && i != '_rev' && i != 'mediaIds') {
                        detailsHtml += '<li><strong>'+i+'</strong>'+n+'</li>';
                    }
                });
                detailsHtml += '<ul>';
                detailsHtml += imageHtml;
                detailsHtml = '<div class="details_wrapper">'+detailsHtml+'</div>';
                $detailTarget.html(detailsHtml);
                //$detailTarget.html($('description', $detail).text());
                
            },
            error: function(xhr, status, error) {
                console.log('server-side failure with status code ' + status);
            }
        });
    };
    
    //http://stackoverflow.com/questions/901115/get-querystring-values-in-javascript
    function _getParameterByName( name )
    {
      name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
      var regexS = "[\\?&]"+name+"=([^&#]*)";
      var regex = new RegExp( regexS );
      var results = regex.exec( window.location.href );
      if( results == null )
        return "";
      else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    
    //http://stackoverflow.com/questions/27928/how-do-i-calculate-distance-between-two-latitude-longitude-points
    function _calcDistance(point1, point2) {
        var R = 6371; // Radius of the earth in km
        var dLat = (point2[0]-point1[0]).toRad();  // Javascript functions in radians
        var dLon = (point2[1]-point1[1]).toRad(); 
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(point1[0].toRad()) * Math.cos(point2[0].toRad()) * 
                Math.sin(dLon/2) * Math.sin(dLon/2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        
        return d;
    }
    
    
    //Init the app
    (function init() {
       //Get the id from the url
       _id = _getParameterByName('id');
       _refreshDetail(_id);
    })();
  };
})(Mural);

//Go go go go go!!
$('.detail-page').live('pageshow',function(event){
    Mural.Details();
});