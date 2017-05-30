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
});