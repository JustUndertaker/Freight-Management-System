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

//get loadtype
function getLoadType(user) {
  var postdata = 'user=' + user

  $.ajax({
      type:'GET',
      url:'./api/getLoadTypeInfo.php',
      data:postdata,
      dataType:'text',
      success:function(acceptdata){
        
        var jsondata = JSON.parse(acceptdata)
        var loadtype = $("#addfreeload_loadtype")

        if (jsondata['code']==0){
          //success
          var getdata=jsondata['datalist']
          getdata.forEach(function (index) {
       
            var option = $("<option>")
            option.addClass("value")
            option.val(index['loadtypeid'])
            option.text(index['name'])
            loadtype.append(option)
          })

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
}

//load customerinfo and loadtype
$(document).ready(function() {
    
    //get user
    user = getQueryVariable('user')
    user = user.replace("+", " ")
    var postdata = 'user=' + user

    $.ajax({
      type:'GET',
      url:'./api/getCustomerInfo.php',
      data:postdata,
      dataType:'text',
      success:function(acceptdata){
        
        var jsondata = JSON.parse(acceptdata)
        
        if (jsondata['code']=="0"){
          //success
          var getdata=jsondata['datalist']
          getdata.forEach(function (index) {
       
            var customer_id=index['id']
            var customer_name=index['name']
            $("#customer_id").val(customer_id)
            $("#customer_id").text(customer_id)
            $("#customer_name").val(customer_name)
            $("#customer_name").text(customer_name)
          })
          getLoadType($("#customer_name").val())

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

//load_table_list
$('#table_list').bootstrapTable({

    url: './api/getFreeloadTable.php',
    method:'get',
    queryParams: function(params)
    {
        var paramss = {
            userid: $("#customer_id").val()
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
    }, {
        field: 'loadtype',
        title: 'Loadtype'
    }, {
        field: 'booked',
        title: 'Booked'
        }, {
        field: 'haulier',
        title: 'Haulier'
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

    var table = $("#table_list")
    table.bootstrapTable('refresh')

}



//detele freeload
function deteleFreeload() {
  var row = $("#modal_detele_value").val()
  var myModal = $("#modal_detele")
  myModal.modal('hide')

  var user_id = $("#customer_id").val()
  var freeload_id = row['id']
  var booked = row['booked']
  var haulier = row['haulier']
  var postdata = {
    "user_id": user_id,
    "freeload_id": freeload_id,
    "booked": booked,
    "haulier":haulier
  }
  $.ajax({
      type:'POST',
      url:'./api/dettelFreeload.php',
      contentType: "application/x-www-form-urlencoded",
      data:postdata,
      dataType:'json',
      success:function(acceptdata){
        var jsondata=acceptdata
        
        if (jsondata['code']=="0"){
          tableLoad()
          var msg="Delete Success!"
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


//add freeload
function addFreeload() {
  var user_id=$("#customer_id").val()
  var originationx = $('input[id=addfreeload_originationx]').val()
  var originationy = $('input[id=addfreeload_originationy]').val()
  var destinationx = $('input[id=addfreeload_destinationx]').val()
  var destinationy = $('input[id=addfreeload_destinationy]').val()
  var load_typeid=$("#addfreeload_loadtype option:selected").val()
    var postdata={
      "user_id":user_id,
      "originationx": originationx,
      "originationy": originationy,
      "destinationx": destinationx,
      "destinationy": destinationy,
      "load_typeid": load_typeid
  }
  $.ajax({
      type:'POST',
      url:'./api/addFreeload.php',
      contentType: "application/x-www-form-urlencoded",
      data:postdata,
      dataType:'json',
      success:function(acceptdata){

        var jsondata=acceptdata
        
        if (jsondata['code']=="0"){
          tableLoad()
          var msg="Submit Success!"
          sendMessage(msg)
        } else {
          var msg=jsondata['err_text']
          sendMessage(msg)
        }
      },
      error:function(err){
        console.log(err)
      }
    })
}


