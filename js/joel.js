$(" .module").each(
    function(){
        var a=$(this),
        e=a.find("img").attr("data-pdf"),
        t=e.split(".");
        
        "pdf"==t[1]&&(a.find("img").wrap('<a href="'+e+'"></a>'),
        
        a.css("background","none"));var i=a.attr("data-vid"),
        
        l=a.attr("data-vid").split("m/");
        
        if(""!==i){var o=l[1];
            
            a.find("img").remove(),
        
                a.find(".i-w").append('<div class="translayer"></div><iframe class="vimeo" src="https://player.vimeo.com/video/'+o+'?autoplay=1&loop=1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>')

        }
    
        var r=a.attr("data-text");
        
        ""!==r&&(a.find("img").remove(),
        
        a.find(".i-w").append("<p>"+r+"</p>"))}),
        
        ""!==$(".module:nth-child(2)").attr("data-vid") && $("header").css("color","gray"),
        
        $(".i-w p ").each(function(){var a=anchorme($(this).text());$(this).html(a)}),$("p a").parent().prepend('<img src="assets/img/link.jpg">'),$(".module ul li").click(function(){var a=$(this),e=a.text();a.parent().children().css("color","blue"),a.css("color","red"),a.parent().parent().attr("class","module boxshadow "+e)}),$("body").keydown(function(a){88===a.which&&($(".module ul").toggle(),$(".module").toggleClass("boxshadow"),$(".dot").toggle())});