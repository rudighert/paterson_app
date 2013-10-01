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
		init_slider(4)
		if(path=='/views/mass_balance'){
			$('.area_value').bind('change','value_item',function(){set_result_mass_balance()})
		}
		if(path=='/views/water_pipe'){
			$('.area_value').bind('change','value_item',function(){set_result_water_pipe()})
		}

		if(path=='/views/yield_stress'){
			$('.area_value').bind('change','value_item',function(){set_result_yield_stress()})
		}
		
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



function set_result_mass_balance(){
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

function set_result_water_pipe(){
	var flow_rate       = parseInt($('.value_1').val())
	var pipe_diameter   = parseInt($('.value_2').val())
	var pipe_thickness  = parseInt($('.value_3').val())
	var pipe_roughness  = parseInt($('.value_4').val())

	var form_1 = (pipe_diameter - 2*(pipe_thickness))
	$('.inside_diamter').html(form_1)

	var form_2 = (Math.PI/4)*Math.pow((form_1/1000),2)
	$('.flow_velocity').html(form_2.toFixed(6))

	var form_3 = (0.33125/Math.pow(Math.log((form_4/(3.7*form_1)) + 5.74/(Math.pow(pipe_roughness,0.9)))),2)
	$('.friction_factor').html(form_3)

	var form_4 = ((2*form_3)/(9.81))*(Math.pow(form_2,2)/form_1)
	$('.head_loss').html(form_4)

	var form_5 = (form_2*(form_1/1000)/1*Math.pow(10,-6))
	$('.reynolds_number').html(form_5.toFixed(6))

}

function set_result_yield_stress(){
	var cylinder_height  = parseInt($('.value_1').val())
	var measured_slump  = parseInt($('.value_2').val())
	var slurry_density= parseInt($('.value_3').val())

	var form_1 = cylinder_height+measured_slump+slurry_density
	$('.result.yield_stress').html(form_1.toFixed(2))

}

function init_slider(max){
	for(i=1; i<=max; i++){
		$( "#slider-"+i ).bind( "change", function() {set_items()});	
	}
}

function set_items(){
	$('.value_1').val($('#slider-1').val())
	$('.value_2').val($('#slider-2').val())
	$('.value_3').val($('#slider-3').val())
	$('.value_4').val($('#slider-4').val())
}

