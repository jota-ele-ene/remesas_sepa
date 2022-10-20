# remesas_sepa
Utilidad para crear un fichero XML para procesar una remesa SEMA

Como funciona
-------------

1.- Descarga el ZIP con el repositorio y descomprimelo

2.- Edita el fichero config.js y configura los datos del EMISOR (Nombre, ID suministrado por el banco, IBAN y BIC)

3.- Ves al directorio del repositorio descomprimos

4.- Carga la página html en tu navegador

5.- Rellena el formulario, carga un fichero excel con una fila para cada recibo

6.- Descarg atu remesa en el formato XML de SEPA

Hipotesis
---------

1.- En el fichero template.js existen variables con las cabeceras del fichero XML de remesas y la plantilla para cada recibo.

2.- Al ejecutarse, se rellenan en la cabcera las variables entre llaves (e.g. {InitgPtyNm} con el contenido de la variable del mismo nombre en el fichero config.js

3.- Las veriables declaradas en template.js se sobreescriben con los scripts incluidos en la página HTML

4.- Para cada recibo se sobreescriben las variables entre llaves por el valor de la celda de cada fila en la columna con el mismo nombre que la variable. El fichero xlsx incluido en el repositorio es un ejemplo

5.- Si se quieren añadir más variables (por ejemplo la cantidad de cada recibo) basta con añadir una columna más con el nombre de la variable a sustituir

6.- Revisa los scripts de la página HTML y asegurate que el comportamiento para construir campos como Message ID o las fechas se ajustan a tus necesidades

TODO
----

1.- Validar los IBAN y los NIF y marcarlo en la tabla como alertas
