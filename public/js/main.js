/**** MAIN.JS ***/

function togglePanels(uid,event){
   
    $(".mpanel").each(function(){
        
        $(this).removeClass("pan-visible").addClass('pan-invisible');
    });
   
    $("#" + uid).addClass("pan-visible").removeClass('pan-invisible');
    
    this.event.preventDefault();
    return false;
}
