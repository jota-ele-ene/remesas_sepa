
function  validateField(field,value) {

	if (field == "InitgPtyNm") return validateAlfanumerico(field,value,70, true);

	if (field == "InitgPtyId") return validateInitgPtyId(value);

	if (field == "CdtrAcct") return validateIBAN(value);

	if (field == "CdtrAgtBIC") return validateBIC(value);

	if (field == "SeqTp") return value == "RCUR" || value == "FRST" || value == "FNAL" || value == "OOFF";

	if (field == "ReqdColltnDt") return validateDate(value);

	if (field == "RemesaID") return validateAlfanumerico(field,value,13,false);

	if (field == "RmtInf") return validateAlfanumerico(field,value,140,true);

	if (field == "InstdAmt") return validateAmmount(value);

	if (field == "EndToEndId") return validateAlfanumerico(field,value,35,false);

	if (field == "NIF") return validateNIF(value);

	if (field == "DtOfSgntr") return validateDate(value);

	if (field == "IBAN") return validateIBAN(value);

	if (field == "BIC") return validateBIC(value);
	
	if (field == "Name") return validateAlfanumerico(field,value,140,true);
	
    document.getElementById('excel_data').innerHTML = '<div class="alert alert-danger">No hemos podido validar el parámetro <i>´' + field + '</i> que aparece en el fichero</div>';

    return false;
	
}

// Validaciones de parámetros de la información del pago

function  validateInitgPtyId(value) {

	if (!value.substring(0,7).match(/^(ES\d{5})$/)) return false;
	
	return validateCIF(value.substring(7));
	
}

// Validaciones de variables del adeudo

function  validateAmmount(remesa) {

	var decimal = parseFloat(remesa.replace(/,/g, '.'));

	if (isNaN(decimal))
    {

        return false;
    }

	return true;
			
}

// Validacione comunes

// Comprueba si una cadena es alfanumérica con o sin espacios y con una longitud máxima y lanza mensajes de error correspondientes

function  validateAlfanumerico(field,value,length,space) {
		
	var pattern = /[^\w\d ]/ig;

	if (value.lenght == 0 || value.length > length)
    {

        return false;
    }

	if (pattern.test(value))
    {

        return false;
    }
	
    if ( !space && /[ ]/ig.test(value) ) 
    {

        return false;
    }

	return true;
			
}


// Comprueba si es un DNI correcto (entre 5 y 8 letras seguidas de la letra que corresponda).

// Acepta NIEs (Extranjeros con X, Y o Z al principio)

function validateNIF(dni) {
    var numero, let, letra;
    var expresion_regular_dni = /^[XYZ]?\d{5,8}[A-Z]$/;

    dni = dni.toUpperCase();

    if(expresion_regular_dni.test(dni) === true){
        numero = dni.substr(0,dni.length-1);
        numero = numero.replace('X', 0);
        numero = numero.replace('Y', 1);
        numero = numero.replace('Z', 2);
        let = dni.substr(dni.length-1, 1);
        numero = numero % 23;
        letra = 'TRWAGMYFPDXBNJZSQVHLCKET';
        letra = letra.substring(numero, numero+1);
        if (letra != let) {
            //alert('Dni erroneo, la letra del NIF no se corresponde');
            return false;
        }else{
            //alert('Dni correcto');
            return true;
        }
    }else{
        //alert('Dni erroneo, formato no válido');
        return false;
    }
}

function validateCIF(cif) {
	if (!cif || cif.length !== 9) {
		return false;
	}

	var letters = ['J', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
	var digits = cif.substr(1, cif.length - 2);
	var letter = cif.substr(0, 1);
	var control = cif.substr(cif.length - 1);
	var sum = 0;
  var i;
	var digit;

	if (!letter.match(/[A-Z]/)) {
		return false;
	}

	for (i = 0; i < digits.length; ++i) {
		digit = parseInt(digits[i]);

		if (isNaN(digit)) {
			return false;
		}

		if (i % 2 === 0) {
			digit *= 2;
			if (digit > 9) {
				digit = parseInt(digit / 10) + (digit % 10);
			}

			sum += digit;
		} else {
			sum += digit;
		}
	}

	sum %= 10;
	if (sum !== 0) {
		digit = 10 - sum;
	} else {
		digit = sum;
	}

	if (letter.match(/[ABEH]/)) {
		return String(digit) === control;
	}
	if (letter.match(/[NPQRSW]/)) {
		return letters[digit] === control;
	}

	return String(digit) === control || letters[digit] === control;
}

function validateDate(str) {
  if (!(typeof str === 'string' || str instanceof String)) return false;
  if (!str.match(/^(\d{4}-\d{2}-\d{2})$/)) return false;
  const d = new Date(str); 
  return d instanceof Date && !isNaN(d) && d.toISOString().substr(0,10)===str; // valid date 
}

function validateIBAN(IBAN) {

    //Se pasa a Mayusculas
    IBAN = IBAN.toUpperCase();
    //Se quita los blancos de principio y final.
    IBAN = IBAN.trim();
    IBAN = IBAN.replace(/\s/g, ""); //Y se quita los espacios en blanco dentro de la cadena

    var letra1,letra2,num1,num2;
    var isbanaux;
    var numeroSustitucion;
    //La longitud debe ser siempre de 24 caracteres
    if (IBAN.length != 24) {
        return false;
    }

    // Se coge las primeras dos letras y se pasan a números
    letra1 = IBAN.substring(0, 1);
    letra2 = IBAN.substring(1, 2);
    num1 = getnumIBAN(letra1);
    num2 = getnumIBAN(letra2);
    //Se sustituye las letras por números.
    isbanaux = String(num1) + String(num2) + IBAN.substring(2);
    // Se mueve los 6 primeros caracteres al final de la cadena.
    isbanaux = isbanaux.substring(6) + isbanaux.substring(0,6);

    //Se calcula el resto, llamando a la función modulo97, definida más abajo
    resto = modulo97(isbanaux);
    if (resto == 1){
        return true;
    }else{
        return false;
    }
}

function modulo97(iban) {
    var parts = Math.ceil(iban.length/7);
    var remainer = "";

    for (var i = 1; i <= parts; i++) {
        remainer = String(parseFloat(remainer+iban.substr((i-1)*7, 7))%97);
    }

    return remainer;
}

function getnumIBAN(letra) {
    ls_letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return ls_letras.search(letra) + 10;
}

function validateBIC (value)
{
	
	if (!value.match(/^([A-Z]{6}[A-Z2-9]{1}[A-NP-Z1-2]{1})(X{3}|[A-WY-Z0-9]{1}[A-Z0-9]{2})?$/)) return false;

	return true;
	
}