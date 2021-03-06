var global_flow_rate = 500;

$(document).ready(function(){
  $('.button_area').on('click', 'button',function(){
    var selector = $(this).data('selector')
    var title = $(this).data('title')
    show_action(selector, title)
  })

  $('.bottom_nav').on('click', 'li',function(){
    var action = $(this).data('action')
    switch(action){
      case 'back':
        empty_app()
        break;
      case 'disclaimer':
        show_action('#disclaimer', 'Disclaimer')
        break;
      case 'contact':
        show_action('#contact', 'Contact Us')
        break;
    }
  })

  $('body').on('click', 'header', function(){
    show_action('#contact', "Contact Us")
  })



  $('body').on('keyup', '.scrolling',function(){
    var selector = $(this).data('scroll')
    var val = $(this).val()
    $(selector).val(val)
  })



})

function keyAcept(keyCode){
  console.log(keyCode)
  return (keyCode==37 || keyCode==38 || keyCode==39 || keyCode==40 || keyCode==190)
}

function set_action_show(selector){

    init_slider(4)
    if(selector=='#mass_balance'){
      $('.area_value').bind('change','.value_item',function(){set_result_mass_balance()})
      $('.area_value').on('keyup','.value_item',function(e){
        if(!keyAcept(e.keyCode)){
          auto_set_number($(this), set_result_mass_balance)
        }

      })
    }


    if(selector=='#water_pipe'){
      $('.value_1').val(addThousandsSeparator(global_flow_rate))
      set_result_water_pipe()
      $('.area_value').bind('change','.value_item',function(){set_result_water_pipe()})
      $('.area_value').on('keyup','.value_item',function(e){
        if(!keyAcept(e.keyCode)){
          auto_set_number($(this), set_result_water_pipe)
        }

      })

    }



    if(selector=='#yield_stress'){
      $('.area_value').bind('change','.value_item',function(){set_result_yield_stress()})
      $('.area_value').on('keyup','.value_item',function(e){
        if(!keyAcept(e.keyCode)){
          auto_set_number($(this), set_result_yield_stress)
        }

      })
    }



}

function empty_app(){
  $('.insert_action').html('')
  $('.subtitle_nav').html('Basic Tools')
  $('.subtitle_nav').removeClass('active')
  $('.show_actions').removeClass('active')
  $('.bottom_nav').removeClass('active')
}


// ================PANTALLA 1==========================
function set_result_mass_balance(){
  var solid_tonnage  = get_values_item($('.value_1').val())
  var concent_solid  = get_values_item($('.value_2').val())
  var specific_weight= get_values_item($('.value_3').val())

  var form_1 = (solid_tonnage/24) * ( ( (100/concent_solid) + (1/specific_weight) )-1)
  $('.result.slurry_rate').html(addThousandsSeparator(parseInt(form_1)))

  var form_2 = (solid_tonnage/24) * ( ( 1-(concent_solid/100) )/(concent_solid/100) )
  $('.result.water_rate').html(addThousandsSeparator(parseInt(form_2)))
  global_flow_rate = parseInt(form_2)

  var form_3 = specific_weight/ ( concent_solid/100 + (1-concent_solid/100)*specific_weight )
  $('.result.density').html(form_3.toFixed(3))

  var form_4 = ( (form_3 - 1) / (specific_weight-1) )*100
  $('.result.vol_concent').html(form_4.toFixed(1)+'%')
}



// ================PANTALLA 2==========================
function set_result_water_pipe(){
  var flow_rate       = get_values_item($('.value_1').val())
  var pipe_diameter   = get_values_item($('.value_2').val())
  var pipe_thickness  = get_values_item($('.value_3').val())
  var pipe_roughness  = get_values_item($('.value_4').val())

  var diameter_int = (pipe_diameter - 2*(pipe_thickness))
  var diameter_int_mt=diameter_int/1000
  $('.inside_diamter').html(addThousandsSeparator(parseInt(diameter_int)))

  var area = Math.pow(diameter_int_mt,2)*(Math.PI/4)
  var velocity = flow_rate/3600/area
  $('.flow_velocity').html(velocity.toFixed(3))


  var Re = (velocity*(diameter_int_mt)/(0.0000010068))
  $('.reynolds_number').html(Re.toExponential(4))


  var A= (pipe_roughness/1000)/3.7/(diameter_int)
  var B= 5.74/Math.pow(Re,0.9)
  var C= Math.log(A+B)


  var form_3 =0.33125/Math.pow(C,2)

  $('.friction_factor').html(form_3.toFixed(5))

  var form_4 = ((2*form_3)/(9.81))*(Math.pow(velocity,2)/(diameter_int/1000))
  $('.head_loss').html(form_4.toFixed(4))


}




// ================PANTALLA 3==========================
function set_result_yield_stress(){

  var height  = get_values_item($('.value_1').val())
  var slump   = get_values_item($('.value_2').val())
  var density = get_values_item($('.value_3').val())

  $('#slider-2').attr('max', parseInt(height)-1)


  var form_1 = calculateYieldStress(density, height, slump)
  $('.result.yield_stress').html(addThousandsSeparator(form_1))

}

function init_slider(max){
  for(i=1; i<=max; i++){
    $( "#slider-"+i ).bind( "change", function() {set_items()});
  }
}

function set_items(){
  for(i=1; i<=4; i++){
    if($('#slider-'+i).length>0){
      $('.value_'+i).val(addThousandsSeparator($('#slider-'+i).val()))
    }
  }
}

function get_values_item(number){
  return parseFloat(number.replace(",",""));
}

function addThousandsSeparator(input) {
    var output = input
    if (parseFloat(input)) {
        input = new String(input); // so you can perform string operations
        var parts = input.split("."); // remove the decimal part
        parts[0] = parts[0].split("").reverse().join("").replace(/(\d{3})(?!$)/g, "$1,").split("").reverse().join("");
        output = parts.join(".");
    }

    return output;
}

function auto_set_number(input,func){
  var number = get_values_item(input.val())
  number = number || 0
  if(number!= 0){
    input.val(addThousandsSeparator(number))
    func()
  }

}

function calculateYieldStress(density, height, slump) {


    if (isNaN(density) || isNaN(height) || isNaN(slump))
        return;

    if (slump == density && density == height && height == 0)
        return '';

    if (slump > height)
        return 'The measured slump must be less than the cylinder height';
    if (density < 900)
        return 'The slurry density is too low for the slump calculation.';

    var lower = 0;
    var upper = 1000;
    var count = 0;
    var ty = 10000;

    while (Math.abs(upper - lower) >= 0.01 && count < 1000) {
        count++;
        ty = (lower + upper) / 2;
        var tvp = ty / (density * 9.81 * height / 1000);
        var rhs = 1 - 2 * tvp * (1 - Math.log(2 * tvp));
        if (rhs - slump / height > 0)
            lower = ty;
        else
            upper = ty;
    }
    if (ty < 999)
        return roundToPrecision(ty, 1);
    else
        return 'One of the entered fields makes the calculation impossible.';
}

function roundToPrecision(value, precision) {
    var multiplier = Math.pow(10, precision);
    return Math.round(value * multiplier) / multiplier;
}


function show_action(selector, title){
  var data =$(selector).html()
  $('.insert_action').html(data)
  $('.subtitle_nav').html(title)
  $('.subtitle_nav').addClass('active')
  $('.show_actions').addClass('active')
  $('.bottom_nav').addClass('active')
  set_action_show(selector)
}

var actual_background=1
var max_back=8;
window.onload = function() {
    setInterval(change_backgrounds,5000); //Then set it to run again after five minutes
}
function change_backgrounds(){

  var next_back = actual_background+1;
  next_back = next_back > max_back ? 1 : next_back
  $('body').removeClass('back_'+actual_background).addClass('back_'+next_back)
  $('.backgrounds.active').css({'opacity' : 1})
  $('.backgrounds.active').animate({'opacity': '0'}, 2000, function(){
    $(this).removeClass('active')
    $('.backgrounds.back_'+next_back).addClass('active')
    actual_background ++;
    actual_background = actual_background >max_back ? 1 : actual_background
  })
 }





