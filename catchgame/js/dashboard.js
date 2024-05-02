//function call api with get method to display result
function ShowScore(){
    $.ajax({
        url: "http://localhost:3000/listScore",
        type: "GET",
        headers: {
            'Content-Type': 'application/json',
            'X-CUSTOM-HEADER': '123',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
            'authorization': 'secretpassword'
          },
        success: function (data) {
          for(let i=0;i<data.length;i++){
            $("#scorelist").append("<tr><td>"+data[i].name+"</td><td>"+data[i].scoreMark+"</td></tr>");
          }
        }
      });

}