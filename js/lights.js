_d_.lights = function () {
  $('.loading-bar').width(500)

  setTimeout(function (){
    $('#progressAnchor').empty();
    $('#vizrow').fadeTo("slow", 1);
    $('#controlrow').fadeTo("slow", 1);

  }, 800);
}

