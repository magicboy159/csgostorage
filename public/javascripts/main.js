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

});