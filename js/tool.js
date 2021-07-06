//send meesage
function sendMessage(message) {
    $("#modal_message_text").text(message)
    var myModal = $("#modal_message")
    myModal.modal('show')
}
  

//refresh
function tableLoad() {

    var table = $("#table_freeload_list")
    table.bootstrapTable('refresh')
}

//trigger
function addChooseButton(value, row, index) {

    if (row['accepthaulier'] == "none") {
        return '<button id="choose" class="btn btn-primary">Choose</button>'
    } else {
        return '<button id="choose" class="btn btn-secondary" disabled>Choose</button>'
    }
    
}
window.operateEvents = {

      'click #choose': function (e, value, row, index) { 
      $("#freeload_id").val(row['id'])
      $("#freeload_id").text(row['id'])
      $("#freeload_origination").val(row['origination'])
      $("#freeload_origination").text(row['origination'])
      $("#freeload_destination").val(row['destination'])
      $("#freeload_destination").text(row['destination'])
      $("#freeload_loadtype").val(row['loadtype'])
      $("#freeload_loadtype").text(row['loadtype'])
    }
}

//load table_freeload_list
$("#table_freeload_list").bootstrapTable({
    url: './api/getHaulierFreeloadList.php',
    method:'get',
      columns: [{
        field: 'id',
        title: 'Id'
      }, {
        field: 'origination',
        title: 'Origination(x,y)'
      }, {
        field: 'destination',
        title: 'Destination(x,y)'
      },  {
        field: 'loadtypeid',
        title: 'LoadtypeID'
      },{
          field: 'loadtype',
          title: 'Loadtype'
      }, {
          field: 'loadowner',
          title: 'Loadowner'
          },{
          field: 'accepthaulier',
          title: 'Accept Haulier'
          }, {
          field: 'operation',
          title: 'Operation',
          formatter: addChooseButton,
          events: operateEvents
      }
      ]
})


//trigger
function addAcceptButton(value, row, index) {
    return '<button id="accept" class="btn btn-primary">Accept</button>'
}
window.operateEvents = {

      'click #accept': function (e, value, row, index) {
    
        //empty
        var id =$("#freeload_id").val()
        if (id==''){          
            var msg="You need choose one freeload First!"
            sendMessage(msg)
        } else {
            var value = $("#modal_accept_value")
            value.val(row)
            var myModal = $("#modal_accept")
            myModal.modal('show')
        }     
    }
  }

//load table_freeload_list
$("#table_haulier_list").bootstrapTable({
    url:'./api/getHaulierList.php',
    method:'get',
      columns: [{
        field: 'id',
        title: 'Id'
      }, {
        field: 'name',
        title: 'Name'
      }, {
        field: 'location',
        title: 'Location(x,y)'
      },{
          field: 'operation',
          title: 'Operation',
          formatter: addAcceptButton,
          events: operateEvents
      }
      ]
})

function acceptFreeload(){
    
    var row = $("#modal_accept_value").val()
    var myModal = $("#modal_accept")
    myModal.modal('hide')

    var freeload_id = $("#freeload_id").val()
    var haulier_id=row['id']

    var postdata = {
        "user_id": haulier_id,
        "freeload_id": freeload_id,
    }
    $.ajax({
        type:'POST',
        url:'./api/acceptFreeload.php',
        contentType: "application/x-www-form-urlencoded",
        data:postdata,
        dataType:'json',
        success:function(acceptdata){
          var jsondata=acceptdata
          
          if (jsondata['code']=="0"){
            tableLoad()
            $("#freeload_id").val('')
            $("#freeload_id").text('Choose First')
            $("#freeload_origination").val('')
            $("#freeload_origination").text('Choose First')
            $("#freeload_destination").val('')
            $("#freeload_destination").text('Choose First')
            $("#freeload_loadtype").val('')
            $("#freeload_loadtype").text('Choose First')

            var msg="Accept Success!"
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