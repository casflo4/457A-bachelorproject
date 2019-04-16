//used some help from stackoverflow so I could write data to a file rather than repeated api calls

/*d3.json("data/updatedcontestantdata.json",function(data1){
  var newdata = [];
  data2 = data1.filter(function(d){
    if (d.LatLng!=null){
      return false;
    }
    else{
      return true;
    }
  });
console.log(data2);

  data2.forEach(function(d,i){

    var http = new XMLHttpRequest();
      var newcity = d.City.replace(/ /g, '+');
      var newstate= d.State.replace(/ /g, '+');
      console.log(newcity,newstate)
      var url='https://api.opencagedata.com/geocode/v1/json?q='+newcity+'%2C'+newstate+'&key=9a95c6ab647c456b83e82d164be305e8';
      http.open("GET", url);
      http.send();
      http.onreadystatechange=function(){
        if (this.readyState==4 && this.status==200){
          parsed = JSON.parse(http.responseText);
            if (parsed.results.length>0){
              //console.log(d.LatLng);
              d.LatLng = new L.LatLng(parsed.results[0].geometry.lat,
                  parsed.results[0].geometry.lng);
              if (i==(data2.length-1)){
                  download(JSON.stringify(data2),'updatedcontestantdata.json','application/json');
              }
          }
        }
      }
    });

       download(JSON.stringify(data2),'updatedfile.json','application/json');
          function download(data, filename, type) {
              var file = new Blob([data], {type: type});
              if (window.navigator.msSaveOrOpenBlob) // IE10+
                  window.navigator.msSaveOrOpenBlob(file, filename);
              else { // Others
                  var a = document.createElement("a"),
                          url = URL.createObjectURL(file);
                  a.href = url;
                  a.download = filename;
                  document.body.appendChild(a);
                  a.click();
                  setTimeout(function() {
                      document.body.removeChild(a);
                      window.URL.revokeObjectURL(url);
                  }, 0);
              }
          }
})*/
