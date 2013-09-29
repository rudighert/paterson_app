$(document).ready(function(){
	$('.button_area').on('click', 'button',function(){
		var path = $(this).data('path')
		var title = $(this).data('title')
		set_action_show(path, title)
	})
	$('.bottom_nav').on('click', 'li',function(){
		var action = $(this).data('action')
		switch(action){
			case 'back':
				empty_app()
				break;
		}
	})
})

function set_action_show(path, title){
	$.get(path+'.html', function(data) {
		$('.insert_action').html(data)
		$('.subtitle_nav').html(title)
		$('.subtitle_nav').addClass('active')
		$('.show_actions').addClass('active')
	})
	  .fail(function() {
	    alert( "error" );
	  })	
}

function empty_app(){
	$('.insert_action').html('')
	$('.subtitle_nav').html('Basic Tool')
	$('.subtitle_nav').removeClass('active')
	$('.show_actions').removeClass('active')
}