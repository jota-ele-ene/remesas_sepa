# REMESAS SEPA EN FORMATO ISO 20022
Utilidad para crear un fichero XML con las Órdenes en formato ISO 20022 para emisión de adeudos directos SEPA en euros (Esquema básico). Para más detalles, consultar la [guia de implantación definida por AEB, CECA y UNACC](https://github.com/jota-ele-ene/remesas_sepa/raw/main/files/GuiaSEPA.pdf). 

Como funciona
-------------

1. Selecciona el fichero Excel con la información necesaria para tu remesa (datos del emisor, datos de la remesa, adeudos, etc.). Puedes descargarte el fichero de ejemplo desde [este enlace](https://github.com/jota-ele-ene/remesas_sepa/raw/main/files/remesas.xlsx). **EL FICHERO NUNCA SUBE A NINGÚN SERVIDOR. LA INFORMACIÓN SE PROCESA EXCLUSIVAMENTE EN EL NAVEGADOR DE TU EQUIPO**.

2. Revisa la información procesada al seleccionar el fichero. Además de los mensajes que aparezcan en la página, se marcarán en amarillo los campos leidos con errores.

3. Si es necesario modifica le fichero Excel y repite los pasos 1 y 2 hasta que no tengas errores o sean esperables. 

4. Una vez que todos los datos sean correcto, descarga tu remesa en el formato XML SEPA valido para mandar a tu banco

Hipotesis
---------

Por defecto, la página funciona con una plantilla muy simple que funciona para adeudos a particulares (tipo CORE) y personalizando sólo los campos básicos que permiten procesar la remesa. Si pulsas en el icono "i" de la esquina superior derecha de la página, obtendrás inforamción detallada del funcionamiento y podrás descargarte la plantilla utilizada. Comprobarás que aparece un único adeudo. Las variables que luego son susituidas por los valores del fichero Excel aparecen entre llaves. Por ejemplo _{SeqTp}_.

Si necesitas ampliar la plantilla o hacer congigurables otros parámetros, puedes usar tu propia plantilla en la sección "_Configuración avanzada_". Las variables que añadas en la plantilla entre llaves tendrás que incluirlas luego en el fichero Excel. 

## Licencia

This repo is licensed under the **MIT** license.

Esta página incluye además código previo de otros proyectos accesibles en Internet, por lo que quiero agradecer a:
* Los autores de [SheetJS](https://sheetjs.com/), una libreria Javascript para leer y procesar ficheros Excel
* [Nick Braver](https://www.nickbraver.com), autor del componente [Pure CSS Classy Footer](https://codepen.io/nickbraver/pen/DGeMWQ)
* [Amit Kamble](https://github.com/amyth91), autor del proyecto [Beautiful Aurora Footer Lights](https://codepen.io/amyth91/pen/DzYGaK)

## Autor

José Luis Núñez [https://joseluisnuñez.es](https://joseluisnuñez.es)

Si te es de alguna utilidad, me alegro y me dejo invitar a un café ☕️.

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/U7U27W8VV)

¡Gracias! ❤️
