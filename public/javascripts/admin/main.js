$(document).ready(function() {
    $('#delmodal').on('show.bs.modal', function(e) {
        var userId = $(e.relatedTarget).data('user-id');
        var username = $(e.relatedTarget).data('user');

        $(e.currentTarget).find('#user')[0].innerText = username;
        $(e.currentTarget).find('#deleteuser').attr('href', '/admin/action/deleteuser/' + userId);
    });

    $('#editmodal').on('show.bs.modal', function(e) {
        var user = $(e.relatedTarget).data('user');
        
        var userId = user.id;
        var username = user.username;
        var email = user.email;
        var tradeUrl = user.tradeUrl;
        var credits = user.credits;
        var isAdmin = user.isAdmin;

        
        $(e.currentTarget).find('form').attr('action', '/admin/action/edituser/' + userId);
        $(e.currentTarget).find('#user')[0].innerText = username;
        $(e.currentTarget).find('#usernameField').val(username);
        $(e.currentTarget).find('#emailField').val(email);
        $(e.currentTarget).find('#tradeUrlField').val(tradeUrl);
        $(e.currentTarget).find('#creditsField').val(credits);
        $(e.currentTarget).find('#isAdminField').prop('checked', isAdmin);
    });

    $('#tradeUrlModal').on('show.bs.modal', function(e) {
        var user = $(e.relatedTarget).data('user');
        var username = user.username;
        var tradeUrl = user.tradeUrl;

        $(e.currentTarget).find('#user')[0].innerText = username;
        $(e.currentTarget).find('#tradeUrl').val(tradeUrl);
    });

    $('#editskin').on('show.bs.modal', function(e) {
        var skin = $(e.relatedTarget).data('skin');
        var skinid = skin._id;
        var skinName = skin.itemName;
        var exterior = skin.exterior;
        var price = skin.price;
        var picUrl = skin.picUrl;

        $(e.currentTarget).find('form').attr('action', '/admin/action/updateskin/'+skinid);
        $(e.currentTarget).find('#skinName').val(skinName);
        $('select option:contains("'+exterior+'")').prop('selected', true);
        console.log($('select option:contains("'+exterior+'")'));
        $(e.currentTarget).find('#price').val(price);
        $(e.currentTarget).find('#skinPreview').attr('src', picUrl);


    });

    $('#searchUsers').on('keyup', function(e) {
        var input = $(e.currentTarget);
        var filter = input.val().toUpperCase();
        var table = $('table');
        var tr = $('tr');
        var td;

        for(var i = 0; i < tr.length; i++) {
            var td = $(tr[i]).find('td')[0];
            if(td) {
                if(td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    });

    $('#searchSkins').on('keyup', function(e) {
        var input = $(e.currentTarget);
        var filter = input.val().toUpperCase();
        var table = $('table');
        var tr = $('tr');
        var td;

        for(var i = 0; i < tr.length; i++) {
            var td = $(tr[i]).find('td')[0];
            if(td) {
                if(td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    });


    $('#skinImage').on('change', function() {
        readURL(this);
    });

    function readURL(input) {

    if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#skinPreview').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }
});