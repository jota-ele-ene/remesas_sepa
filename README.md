# remesas_sepa
Utilidad para crear un fichero XML con las Órdenes en formato ISO 20022 para emisión de adeudos directos SEPA en euros (Esquema básico). Para más detalles, consultar la [guia de implantación definida por AEB, CECA y UNACC](https://github.com/jota-ele-ene/remesas_sepa/raw/main/GuiaSEPA.pdf). 

Como funciona
-------------

1.- Descarga el ZIP con el repositorio y descomprimelo

2.- Edita el _fichero config.js_ y configura los datos del EMISOR (Nombre, ID suministrado por el banco, IBAN y BIC)

3.- Ves al directorio del repositorio descomprimos

4.- Carga la página html en tu navegador

5.- Rellena el formulario, carga un fichero excel con una fila para cada recibo

6.- Descarg atu remesa en el formato XML SEPA valido para mandar a tu banco

Hipotesis
---------

1.- En el fichero _template.js_ existen variables con las cabeceras del fichero XML de remesas y la plantilla para cada recibo.

2.- Al ejecutarse, se rellenan en la cabecera las variables entre llaves (e.g. _{InitgPtyNm}_ con el contenido de la variable del mismo nombre en el fichero _config.js_.

3.- Las veriables declaradas en template.js se sobreescriben con los scripts incluidos en la página HTML. Campos del fichero como _MsgId_, _CreDtTm_ o _PmtInfId_ se autocalculan. Revisar si las reglas implementadas en los scripts de la página HTML para construir esos campos se ajustan a tus necesidades. Se supone que todos los recibos son iguales y también se autocalculan el número de transacciones y el importe total de la remesa (campos _NbOfTxs_ y _CtrlSum_). 

4.- Sólo se contemplan como secuencia del adeudo primer adeudo (_FRST_) o adeudo recurrente (_RCUR_). Tampoco se implementan modificaciones en los mandatos. 

5.- Para cada recibo se sobreescriben las variables entre llaves por el valor de la celda de cada fila en la columna con el mismo nombre que la variable. El fichero xlsx incluido en el repositorio es un ejemplo.

6.- Si se quieren añadir más variables (por ejemplo la cantidad de cada recibo) basta con añadir una columna más con el nombre de la variable a sustituir

