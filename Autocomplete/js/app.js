$( document ).ready(function() {

var dataCount;//общее количество элементов в массиве
var count;//найденное количество элементов

$('#autocomplete').autocomplete({
    delay: 500,
    minLength: 1,
    autoFocus: true,
    source: function (request, response) {

        var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( request.term ), "i" );
        //запрос
        $.ajax({
            url: 'kladr.json',
            dataType: 'json',
            cache: false,
            //обработка успешного
            success: function (data) {
                dataCount = data.length;
                //приведем полученные данные к необходимому формату и передадим в
                // предоставленную функцию response
                response($.map(data, function (item) {
                    if (matcher.test(item.City)) {
                        return {
                            label: item.Id,
                            value: item.City
                        }
                    }
                }));
            },
            error: function() {
                if (!$("#icon-text").hasClass("icon-notification")) {  //проверка на наличие класса
                    $("#icon-text").removeClass();
                    $("#icon-text").addClass("icon icon-notification");
                }
                if (!$("div").is(".text-404")) { //проверка на наличие элемента
                    $("#icon-text").after('<div class="text-404">Что-то пошло не так. Проверте соединение с интернетом и повторите.</div>');
                    $(this).addClass("message-error");
                }
            }
        });

    },
    //срабатывает всегда по завершению поиска
    response: function (event, ui) {
        count = ui.content.length;//количество найденного
        if (!ui.content.length) {
            var noResult = { value:"",label:"" };//пустой
            ui.content.push(noResult);
            }
        },
// Срабатывает когда меню открыто или обновлено, берет
//     значение из response  через count
    open: function (event, ui) {
        if (count) { //если найдено
            $('.ui-autocomplete').prepend($("<div class='help'>").text("Найдено " + count
        + " из " + dataCount));
            } else {
            $('.ui-autocomplete').append($("<div class='noResult'>").text("Не найдено"));
        }
    },
//Потеря фокуса
    change: function( event, ui ) {
        input_temp=this.value;
        if (!ui.item) { //если нет элемента
            if (!$("#icon-text").hasClass("icon-notification")) {  //проверка на наличие класса
                $("#icon-text").removeClass();
                $("#icon-text").addClass("icon icon-notification");
            }
           if (!$("div").is(".text-error")) { //проверка на наличие элемента
               $("#icon-text").after('<div class="text-error">Выберите значение из списка</div>');
               $(this).addClass("message-error");
           }
        } else {
            if ($("div").is(".text-error")) {
            $(".text-error").remove();
            $(this).removeClass("message-error");
        }
        }
    },
    // Выбор элемента меню
    select: function( event, ui ) {
        if (!$("#icon-text").hasClass("icon-checkmark")) {
            $("#icon-text").removeClass();
            $("#icon-text").addClass("icon icon-checkmark");
        }
        if ($("div").is(".text-error")) {
            $(".text-error").remove();
            $(this).removeClass("message-error");
        }
    }
});
    var input_temp;
    $(function(){
        $("#autocomplete").focus(function(){    // получение фокуса текстовым полем
            input_temp=this.value;
            if (this.value.length) { //если есть текст
                $(this).select();
                if (!$("#icon-text").hasClass("icon-search")) {
                    $("#icon-text").removeClass();
                    $("#icon-text").addClass("icon icon-search");
                }
            }
        })
    });
});