$(document).ready(function() {

    

    $('.weapon-slot-container').on('click', function() {
        var res = $(this).toggleClass('highlighted');
        var element = $(this).find('.price');
        var isHighlighted = res.hasClass('highlighted')

        var price = 0;

        if(isHighlighted) {
            price = parseInt(element[0].innerText.substring(1));
        } else {
            price = parseInt(-element[0].innerText.substring(1));
        }

        updateSelected(price);
    });

    function updateSelected(price) {
        var selected = parseInt($('#selected')[0].innerText.slice(1, -9));
        $('#selected').text('$'+(selected+price).toFixed(2) + " Selected");

    }

    $('#withdraw-button').on('click', function(e) {
        if($('#depositbutton').data('active')) {
            if($('#withdraw-button').data('tradeurl')) {
                // Has got tradeUrl
                $('#funds-alert').removeClass('hidden');
            } else {
                // Hasn't got trade
                $('#need-tradeurl').removeClass('hidden');
            }
        }
    });
    
    $('#login-alert .close').on('click', function(e) {
        $('#login-alert').addClass('hidden');
    });

    $('#funds-alert .close').on('click', function(e) {
        $('#funds-alert').addClass('hidden');
    });

    $('#need-tradeurl .close').on('click', function(e) {
        $('#need-tradeurl').addClass('hidden');
    });

    $('#depositbutton, #redeem-gift, #withdraw-button').on('click', function(e) {
        $('#login-alert').removeClass('hidden');
    });

    $('#depositbutton').on('click', function(e) {
        var active = $(e.currentTarget).data('active');
        if(active) {
            window.location='https://steamcommunity.com/tradeoffer/new/?partner=386772266&token=4RfYUoHo';
        }
    });

});