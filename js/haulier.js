//get value
function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return("");
}


//send meesage
function sendMessage(message) {
  $("#modal_message_text").text(message)
  var myModal = $("#modal_message")
  myModal.modal('show')
}

//send warning
function sendWarning(message) {
  $("#modal_warning_text").text(message)
  var myModal = $("#modal_warning")
  myModal.modal('show')
}

//onload judgment
$(document).ready(function() {
    
    //get user
    user = getQueryVariable('user')
    user = user.replace("+", " ")
    var postdata = 'user=' + user

    $.ajax({
      type:'GET',
      url:'./api/getHaulierInfo.php',
      data:postdata,
      dataType:'text',
      success:function(acceptdata){
        
        var jsondata = JSON.parse(acceptdata)
        
        if (jsondata['code']=="0"){
          //success
          var getdata=jsondata['datalist']

          //hauilerinfo
          var hauilerinfo=getdata['hauilerinfo']
          $("#haulier_id").val(hauilerinfo['id'])
          $("#haulier_id").text(hauilerinfo['id'])
          $("#haulier_name").val(hauilerinfo['name'])
          $("#haulier_name").text(hauilerinfo['name'])
          $("#haulier_address").val(hauilerinfo['address'])
          $("#haulier_address").text(hauilerinfo['address'])
          $("#haulier_phone").val(hauilerinfo['phone'])
          $("#haulier_phone").text(hauilerinfo['phone'])
          $("#haulier_location").val(hauilerinfo['location'])
          $("#haulier_location").text(hauilerinfo['location'])
          
          //Vehicleinfo
          var vehiclelist = getdata['vehicleinfo']
          var count = 1
          var vehiclechoose=$('#vehicle_choose')
          vehiclelist.forEach(function (vehicleinfo) {
            var option = $("<option>")
            option.addClass("value")
            var optionvalue=JSON.stringify(vehicleinfo)
            option.val(optionvalue)
            option.text(vehicleinfo['name'])

            if (count == 1) {
              option.attr("selected", true)
              $("#vehicle_id").val(vehicleinfo['id'])
              $("#vehicle_id").text(vehicleinfo['id'])
              $("#vehicle_name").val(vehicleinfo['name'])
              $("#vehicle_name").text(vehicleinfo['name'])
              $("#vehicle_loadtypeid").val(vehicleinfo['loadtypeid'])
              $("#vehicle_loadtypeid").text(vehicleinfo['loadtypeid'])
              $("#vehicle_tonnage").val(vehicleinfo['tonnage'])
              $("#vehicle_tonnage").text(vehicleinfo['tonnage'])
              $("#vehicle_description").val(vehicleinfo['loadtype'])
              $("#vehicle_description").text(vehicleinfo['loadtype'])
              $("#vehicle_hazrdous").val(vehicleinfo['hazrdous'])
              $("#vehicle_hazrdous").text(vehicleinfo['hazrdous'])
            }
            vehiclechoose.append(option)
            count = count + 1
          });
          

        } else {
           //failed
           var msg=jsondata['err_text']
           sendWarning(msg)
        }

      },
      error:function(err){
        console.log(err)
    }
    })   
})

//vehicle select
$(document).ready(function(){
  $("#vehicle_choose").change(function () {
    var jsondata = $("#vehicle_choose option:selected").val()
    var vehicleinfo=JSON.parse(jsondata)
    $("#vehicle_id").val(vehicleinfo['id'])
    $("#vehicle_id").text(vehicleinfo['id'])
    $("#vehicle_name").val(vehicleinfo['name'])
    $("#vehicle_name").text(vehicleinfo['name'])
    $("#vehicle_loadtypeid").val(vehicleinfo['loadtypeid'])
    $("#vehicle_loadtypeid").text(vehicleinfo['loadtypeid'])
    $("#vehicle_tonnage").val(vehicleinfo['tonnage'])
    $("#vehicle_tonnage").text(vehicleinfo['tonnage'])
    $("#vehicle_description").val(vehicleinfo['loadtype'])
    $("#vehicle_description").text(vehicleinfo['loadtype'])
    $("#vehicle_hazrdous").val(vehicleinfo['hazrdous'])
    $("#vehicle_hazrdous").text(vehicleinfo['hazrdous'])
  })
})


//trigger
function addButton(value, row, index) {

    return '<button id="detele" class="btn btn-danger">Detele</button>'

}

window.operateEvents = {
  'click #detele': function (e, value, row, index) {

    var value = $("#modal_detele_value")
    value.val(row)
    var myModal = $("#modal_detele")
    myModal.modal('show')
    }
}

//load table_freeload
$("#table_freeload").bootstrapTable({
    url: './api/getHaulierLoadtable.php',
    method:'get',
    queryParams: function(params)
    {
        var paramss = {
            hid: $("#haulier_id").val()
        }
        return paramss;
    },
    columns: [{
      field: 'id',
      title: 'Id'
    }, {
      field: 'origination',
      title: 'Origination(x,y)'
    }, {
      field: 'destination',
      title: 'Destination(x,y)'
    },{
      field: 'loadtypeid',
      title: 'LoadtypeID'
    }, {
        field: 'loadtype',
        title: 'Loadtype'
    }, {
        field: 'loadowner',
        title: 'Loadowner'
        }, {
        field: 'accepttime',
        title: 'Accept Time'
        }, {
        field: 'operation',
        title: 'Operation',
        formatter: addButton,
        events: operateEvents
    }
    ]
})


//refresh
function tableLoad() {

  var table = $("#table_freeload")
  table.bootstrapTable('refresh')
}


//detele freeload
function deteleFreeload() {
  var row = $("#modal_detele_value").val()
  var myModal = $("#modal_detele")
  myModal.modal('hide')

  var user_id = $("#haulier_id").val()
  var freeload_id = row['id']
  
  var postdata = {
    "user_id": user_id,
    "freeload_id": freeload_id
  }
  $.ajax({
      type:'POST',
      url:'./api/detelHaulierFreeload.php',
      contentType: "application/x-www-form-urlencoded",
      data:postdata,
      dataType:'json',
      success:function(acceptdata){
        var jsondata=acceptdata
        
        if (jsondata['code']=="0"){
          tableLoad()
          var msg="Detele Success!"
          sendMessage(msg)
        } else {
          var msg=jsondata['err_text']
          sendMessage(msg)
        }
      },
      error:function(err){
        console.log(err)
        sendMessage("Failed!")
      }
  })

}

