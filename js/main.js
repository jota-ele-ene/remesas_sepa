
const excel_file = document.getElementById('excel_file');

excel_file.addEventListener('change', (event) => {

    document.getElementById('excel_data').innerHTML = '';

    if(!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(event.target.files[0].type))
    {
        document.getElementById('excel_data').innerHTML = '<div class="alert alert-danger">Solo se procesan ficheros .xlsx o .xls</div>';

        excel_file.value = '';

        return false;
    }

    var reader = new FileReader();

    var file_to_read = event.target.files[0];
	
    reader.readAsArrayBuffer(file_to_read);

    reader.onload = function(event){

        var data = new Uint8Array(reader.result);

        var work_book = XLSX.read(data, {type:'array'});

        var sheet_name = work_book.SheetNames;
		
		if ( sheet_name.indexOf("Adeudos") < 0 ) 
		{
		    document.getElementById('excel_data').innerHTML = '<div class="alert alert-danger">No se encuentra la hoja "Adeudos" en el fichero .xlsx</div>';

			excel_file.value = '';

			return false;
		}

		if ( sheet_name.indexOf("Información del pago") < 0 ) 
		{
		    document.getElementById('excel_data').innerHTML = '<div class="alert alert-danger">No se encuentra la hoja "Información del pago" en el fichero .xlsx</div>';

			excel_file.value = '';

			return false;
		}


        var sheet_config = XLSX.utils.sheet_to_json(work_book.Sheets["Información del pago"], {header:1});
		
        var table_params_keys = '<tr>';
        var table_params_values = '<tr>';

		if(sheet_config.length > 0)
        {
			
            for(var cell = 0; cell < sheet_config[0].length; cell++)
            {

                table_params_keys += '<th>'+sheet_config[0][cell]+'</th>';
				params[sheet_config[0][cell]] = sheet_config[1][cell];

                if (validateField(sheet_config[0][cell],sheet_config[1][cell]))
				{				
					table_params_values += '<td>'+sheet_config[1][cell]+'</td>';
				}
				else 
				{
					table_params_values += '<td style="background-color: yellow;">'+sheet_config[1][cell]+'</td>';
				}
			}
			
        }
		
        table_params_keys += '</tr>';
        table_params_values += '</tr>';

		// Si ha habido algún error sacamos un mensaje de warning para revisar
		
		if (  table_params_values.indexOf("background-color: yellow") > -1 ) 
		{
		
		    document.getElementById('excel_data').innerHTML = '<div class="alert alert-warning">Revisa los valores de la hoja "Información del pago" en el fichero .xlsx</div>';
		
		}

		document.getElementById('excel_data').innerHTML += '<table class="table table-striped table-bordered">'+table_params_keys+table_params_values+'</table>';
		
		var sheet_data = XLSX.utils.sheet_to_json(work_book.Sheets["Adeudos"], {header:1});

        if(sheet_data.length > 0)
        {
            var table_output = '<table class="table table-striped table-bordered">';
			
			var rowsInvalid = [];

            for(var row = 0; row < sheet_data.length; row++)
            {
			
				var thisEntry = {};
				
				var validRow = true;

                table_output += '<tr>';

                for(var cell = 0; cell < sheet_data[row].length; cell++)
                {

                    if(row == 0)
                    {

                        table_output += '<th>'+sheet_data[row][cell]+'</th>';
						fields[cell] = sheet_data[row][cell];

                    }
                    else
                    {

                        if (validateField(sheet_data[0][cell],sheet_data[row][cell]))
						
							table_output += '<td>'+sheet_data[row][cell]+'</td>';
						
						else {
						
							table_output += '<td style="background-color: yellow;"><a name="'+row+'">'+sheet_data[row][cell]+'</a></td>';
							validRow = false;
						}
						
						thisEntry[fields[cell]] = sheet_data[row][cell];

                    }
					
                }

                table_output += '</tr>';
				
				if (!validRow) rowsInvalid.push('<a href="#'+row+'">'+thisEntry.EndToEndId+'</a>');
								
				if ( (fields.indexOf("InstdAmt")<0) && row > 0) 
				{
					if (params["InstdAmt"]) 
					{
						thisEntry["InstdAmt"] = ""+(Math.floor(parseFloat(parseFloat(params["InstdAmt"].replace(/,/g, '.')).toString(10))* 100) / 100).toFixed(2);
					}
					else 
					{
						document.getElementById('excel_data').innerHTML = '<div class="alert alert-danger">Si no incluyes una cantidad para cada adeudo, debes incluirla como parámetro <i>InstdAmt</i> en la hoja "Información del pago" en el fichero .xlsx. Ese valor se aplicará at todos los adeudos igual.</div>';

						excel_file.value = '';

						return false;
					}
				}


				if ( (fields.indexOf("RmtInf")<0) && row > 0) 
				{
					if (params["RmtInf"]) thisEntry["RmtInf"] = params["RmtInf"];
					else 
					{
						document.getElementById('excel_data').innerHTML = '<div class="alert alert-danger">Si no incluyes un concepto para cada adeudo, debes incluir el parámetro <i>RmtInf</i> en la hoja "Información del pago" en el fichero .xlsx. Ese valor se aplicará a todos los adeudos igual.</div>';

						excel_file.value = '';

						return false;
					}
				}
				
				if (row > 0)
				{
					entries[row-1] = thisEntry;
					CtrlSum += parseFloat(thisEntry["InstdAmt"]);
				}
				
            }

            table_output += '</table>';
			
			NumRows = entries.length;

			//CtrlSum = (parseFloat(SeqAmnt) * NumRows).toFixed(2);

			var result =  'Procesadas ' + NumRows + ' entradas; CtrlSum: ' + CtrlSum + '<br>Desde el ID ' + entries[0].EndToEndId + ' hasta el ' + entries[entries.length-1].EndToEndId;

			var warning = '';
			
			if (rowsInvalid.length) warning = '<div class="alert alert-warning">Formatos inválidos en las filas: ' + rowsInvalid.toString() + '</div>';

			if (!fields["InstdAmt"]) fields.push("InstdAmt");

			if (!fields["RmtInf"]) fields.push("RmtInf");
			
            document.getElementById('excel_data').innerHTML += '<br><div class="alert alert-info">' + result + '</div>' + warning + '<br>'+table_output;

        }

		if(!params["RemesaID"])
		{
			let filename = file_to_read.name.substring(file_to_read.name.lastIndexOf("\\")+1,file_to_read.name.lastIndexOf("."));
			let root = filename.toUpperCase().replace(/[^0-9a-z]/gi, '');
			params["RemesaID"] = root.substring(0, Math.min(13,root.length));
		}
	
		MessageID = "PRE" + nowString + params["RemesaID"].padStart(13, '0').toUpperCase();

		if(!params["ReqdColltnDt"])
		{
			var date = new Date(); // Now
			date.setDate(date.getDate() + 5); // A falta de parámetro establecemos la fehca de cargo en 5 días
			params["ReqdColltnDt"] = date.getFullYear()+"-"+(date.getMonth()+1).toString(10).padStart(2,"0")+"-"+date.getDate().toString(10).padStart(2,"0");
		}

		if(!params["InitgPtyNm"])
		{
			document.getElementById('excel_data').innerHTML = '<div class="alert alert-danger">Incluye el parámetro <i>InitgPtyNm</i> en la hoja de Información de pago</div>';

			excel_file.value = '';

			return false;
		}

		if(!params["InitgPtyId"])
		{
			document.getElementById('excel_data').innerHTML = '<div class="alert alert-danger">Incluye el parámetro <i>InitgPtyId</i> en la hoja de Información de pago</div>';

			excel_file.value = '';

			return false;
		}
		
		params["PmtInfId"] = params["InitgPtyId"].substr(7,9) + params["ReqdColltnDt"].substr(0,4) + params["ReqdColltnDt"].substr(5,2) + params["ReqdColltnDt"].substr(8,2) + nowString.substring(0,14) + Math.round((Math.random() * 9999)).toString(10).padStart(4,"0");

		if(!params["PmtInfId"])
		{
			document.getElementById('excel_data').innerHTML = '<div class="alert alert-danger">Incluye el parámetro <i>PmtInfId</i> en la hoja de Información de pago</div>';

			excel_file.value = '';

			return false;
		}

		if(!params["CdtrAcct"])
		{
			document.getElementById('excel_data').innerHTML = '<div class="alert alert-danger">Incluye el parámetro <i>CdtrAcct</i> en la hoja de Información de pago</div>';

			excel_file.value = '';

			return false;
		}

		if(!params["CdtrAgtBIC"])
		{
			document.getElementById('excel_data').innerHTML = '<div class="alert alert-danger">Incluye el parámetro <i>CdtrAgtBIC</i> en la hoja de Información de pago</div>';

			excel_file.value = '';

			return false;
		}

		if(!params["SeqTp"])
		{
			document.getElementById('excel_data').innerHTML = '<div class="alert alert-danger">Incluye el parámetro <i>SeqTp</i> en la hoja de Información de pago</div>';

			excel_file.value = '';

			return false;
		}

		if(NumRows==0)
		{
			document.getElementById('excel_data').innerHTML = '<div class="alert alert-danger">Incluye algún adeudo en la hoja de Adeudos</div>';

			excel_file.value = '';

			return false;
		}

    }

});

document.getElementById("btn").addEventListener("click", function () {
		
	content = header;
	
	content = content.replace(/{MessageId}/g, "PRE" + nowString + params["RemesaID"].padStart(13, '0').toUpperCase() );
	content = content.replace(/{CreationDate}/g, CreationDate);
	content = content.replace(/{PmtInfId}/g, params["PmtInfId"]);
	content = content.replace(/{SeqTp}/g, params["SeqTp"]);
	content = content.replace(/{SeqDate}/g, params["ReqdColltnDt"]);
	content = content.replace(/{InitgPtyNm}/g, params["InitgPtyNm"]); 
	content = content.replace(/{InitgPtyId}/g, params["InitgPtyId"]); 
	content = content.replace(/{CdtrAcct}/g, params["CdtrAcct"]);
	content = content.replace(/{CdtrAgtBIC}/g, params["CdtrAgtBIC"]);
	content = content.replace(/{CtrlSum}/g, CtrlSum); 
	content = content.replace(/{NumRows}/g, NumRows); 

	var thisEntry = {};
	
	for(var i = 0; i < entries.length; i++)
	{
		content = content.replace("{DrctDbtTxInf}", row + "{DrctDbtTxInf}");
		
		thisEntry = entries[i];
				
		const f = fields.entries();

		for (let x of f) 
		{
			var regexstring = "{"+x[1]+"}";
			var regexp = new RegExp(regexstring, "gi");
			content = content.replace(regexp, thisEntry[x[1]]); 
		}	
		
	}

    content = content.replace("{DrctDbtTxInf}", "");
	
    var element = document.createElement('a');
	
    element.setAttribute('href','data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    
	element.setAttribute('download', params["RemesaID"] + "_" + NumRows + ".xml");
    
	document.body.appendChild(element);
    
	element.click();
    
	document.body.removeChild(element);

}, false);

document.getElementById("template").addEventListener("click", function () {
		
	content = header;
	
	content = content.replace("{DrctDbtTxInf}", row);

    var element = document.createElement('a');
	
    element.setAttribute('href','data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    
	element.setAttribute('download', "templateSEPABasico.xml");
    
	document.body.appendChild(element);
    
	element.click();
    
	document.body.removeChild(element);

}, false);

const template_file = document.getElementById('template_file');

template_file.addEventListener('change', (event) => {

  var archivo = event.target.files[0];

  var lector = new FileReader();

  lector.onload = function(e) {

    var contenido = e.target.result;
	
	var indexAdeudo = contenido.indexOf("<DrctDbtTxInf>");
	var indexFinAdeudo = contenido.indexOf("</DrctDbtTxInf>");
	
	console.log (indexAdeudo);
	header = contenido.substring(0,indexAdeudo) + '{DrctDbtTxInf}' + contenido.substring(indexFinAdeudo+15);
	alert (indexAdeudo);
	alert (indexFinAdeudo);
	alert (indexFinAdeudo+15-indexAdeudo);
	row = contenido.substring(indexAdeudo,indexFinAdeudo+15);
	
	console.log (header);
	console.log(row);

  };
  
  lector.readAsText(archivo);
  
},false);
	
document.getElementById("collapsible").addEventListener("click", function() {
    this.classList.toggle("active");
    var content = document.getElementById("avzconf");
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
});

var elements = document.getElementsByClassName("panel-action");

var flip = function() {
	var elements = document.getElementsByClassName("panel-action");
	for (var i = 0; i < elements.length; i++) {
		elements[i].classList.toggle('active-action');
	}
	var block = document.querySelector('.block');
	block.classList.toggle('is-flipped');
};

for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener('click', flip, false);
}
	
