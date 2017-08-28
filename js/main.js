$(document).ready(function(){

	// jQuery - Авто калькулятор

	var modelSpecs,
		modelPrice,
		modelSpecsHolder,
		modelPriceHolder,
		modelPriceUSDHolder;

	modelSpecsHolder = $('#modelSpecs');
	modelPriceHolder = $('#modelPrice');
	modelPriceUSDHolder = $('#modelPriceUSD');
	
	modelPrice = 0;
	modelSpecs = '';

	// При старте страницы
	calculatePrice();
	compileSpecs();
	//=======================================================

	// После переключения радио кнопок
	$('#autoForm input').on('change', function(){
		calculatePrice();
		compileSpecs();
		calculateUSD();
	});
	//=======================================================

	// После переключения кнопок "без принта/ с принтом"
	$('#with-print').on('change', function(){
        $("#print-design").removeAttr('style')
	});

	$('#without-print').on('change', function(){
        $("#print-design").attr('style', 'display: none')
	});
	//=======================================================


	// ВЫБОР ЦВЕТА - на цену не влияет
	$('#colorsSelector .colorItem').on('click', function(){
		var imgPath = $(this).attr('data-img-path');
		$('#imgHolder #t-shirt').attr('src', imgPath);
	});
	//=======================================================

	// ВЫБОР ПРИНТА - на цену не влияет
	$('#printSelector .printItem').on('click', function(){
		var printImgPath = $(this).attr('src');
		console.log(printImgPath);
		$('#imgHolder #print-design').attr('src', printImgPath);
		var printAtributeInner = $('#print-design', '#imgHolder').attr('alt');
	});
	var printAtribute = printAtributeInner;

	//=======================================================

	function compileSpecs(){

       
		modelSpecs = $('input[name=print]:checked + label', '#autoForm').text();

		modelSpecs = modelSpecs + ', название: ' + $(printAtribute);

		modelSpecs = modelSpecs + ', ' + $('input[name=wrap]:checked + label', '#autoForm').text();
		modelSpecs = modelSpecs + ', ' + $('input[name=delivery]:checked + label', '#autoForm').text() + '.';
		
		// alert(modelSpecs);
		modelSpecsHolder.text( modelSpecs );
	};

	//=======================================================

    function calculatePrice(){
		var modelPricePrint = $('input[name=print]:checked', '#autoForm').val();
		var modelPriceWrap = $('input[name=wrap]:checked', '#autoForm').val();
		var modelPriceDelivery = $('input[name=delivery]:checked', '#autoForm').val();
		
		modelPricePrint = parseInt(modelPricePrint);
		modelPriceWrap = parseInt(modelPriceWrap);
		modelPriceDelivery = parseInt(modelPriceDelivery);
		
		modelPrice = modelPricePrint + modelPriceWrap + modelPriceDelivery;
		// alert(modelPrice);
		modelPriceHolder.text( addSpace(modelPrice) + ' рублей');
	};

	//=======================================================

	function addSpace(nStr) {
	    nStr += '';
	    x = nStr.split('.');
	    x1 = x[0];
	    x2 = x.length > 1 ? '.' + x[1] : '';
	    var rgx = /(\d+)(\d{3})/;
	    while (rgx.test(x1)) {
	        x1 = x1.replace(rgx, '$1' + ' ' + '$2');
	    }
	    return x1 + x2;
	}
	//=======================================================

	// Получаем курс валют
	var currencyUrl = 'https://query.yahooapis.com/v1/public/yql?q=select+*+from+yahoo.finance.xchange+where+pair+=+"USDRUB,EURRUB"&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
	var rurUsdRate = 0;

	$.ajax({
		url: currencyUrl,
		cache: false,
		success: function(html){
			console.log( html.query.results.rate[0].Rate );
			rurUsdRate = html.query.results.rate[0].Rate;
			calculateUSD();
		} 
	});

	function calculateUSD(){
		var modelPriceUSD = modelPrice / rurUsdRate;
		// alert(modelPriceUSD);
		modelPriceUSDHolder.text( '$ ' + addSpace( modelPriceUSD.toFixed(0) ) );
	}
	//=======================================================

});