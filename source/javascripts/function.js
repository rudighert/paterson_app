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
		$('.bottom_nav').addClass('active')
		
		init_slider(3)
		$('.area_value').bind('change','value_item',function(){set_result()})
		
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
	$('.bottom_nav').removeClass('active')
}

function mass_balance(){
	var solid_tonnage  =$('#slider-1').val()
	var concent_solid  =$('#slider-2').val()
	var specific_weight=$('#slider-3').val()

	$('.value_1').val(solid_tonnage)
	$('.value_2').val(concent_solid)
	$('.value_3').val(specific_weight)
}

function set_result(){
	var solid_tonnage  = parseInt($('.value_1').val())
	var concent_solid  = parseInt($('.value_2').val())
	var specific_weight= parseInt($('.value_3').val())

	var form_1 = (solid_tonnage/24) * ( ( (100/concent_solid) + (1/specific_weight) )-1)
	$('.result.slurry_rate').html(form_1.toFixed(2))

	var form_2 = (solid_tonnage/24) * ( ( 1-(concent_solid/100) )/(concent_solid/100) )
	$('.result.water_rate').html(form_2.toFixed(2))

	var form_3 = specific_weight/(concent_solid/100 + (1-concent_solid/100)*3)
	$('.result.density').html(form_3.toFixed(2))

	var form_4 = ((form_3/1000 - 1)/(specific_weight-1))*100
	$('.result.vol_concent').html(form_4.toFixed(2))
}

function init_slider(max){
	for(i=1; i<=max; i++){
		$( "#slider-"+i ).bind( "change", function() {mass_balance()});	
	}
}