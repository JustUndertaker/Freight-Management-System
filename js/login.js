
$(document).ready(function () {
    $('input[name=login_identity]').change(function () {
        var identity = $("input[name=login_identity]:checked").val()
        $("#login_form").attr('action',identity+'.html')
    })
})