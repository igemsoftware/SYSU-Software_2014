Web interfaces
==============

Biobrick
--------

* ``GET /biobrick/<type>``

  Get a list of all available biobricks of some type.
  ``<type>`` can be one of ``input``, ``output``, ``receptor``, ``promoter``.

  Example:

  .. code-block:: javascript

    {
      "result": [
        {"type": "input", "name": "Input XXX", "id": 1234},
        {"type": "input", "name": "Input YYY", "id": 5687},
        ...]
    }


* ``GET /biobrick/<type>?id=XXX``

  Get the information of a biobrick specified by ``<type>`` and ID.

  Example:

  .. code-block:: javascript

    {
      "result": {"type": "input", "name": "Input XXX", "id": 1234}
    }


* ``GET /biobrick/suggest/promoters?input_id=XXX``

  Get the suggested promoters according to the chosen input.

  Example:

  .. code-block:: javascript

    {
      "result": [
        {"type": "promoter", "name": "Promoter XXX", "id": 1234},
        {"type": "promoter", "name": "Promoter YYY", "id": 5687},
        ...]
    }


* ``GET /biobrick/suggest/receptors?input_id=XXX&promoter_id=YYY``

  Get the suggested receptors according to the chosen input and promoter.

  Example:

  .. code-block:: javascript

    {
      "result": [
        {"type": "receptor", "name": "Receptor XXX", "id": 1234},
        {"type": "receptor", "name": "Receptor YYY", "id": 5687},
        ...]
    }


Circuit Design
--------------

* ``POST /circuit/schemes``

  Design a circuit according to a given truth table. Only the design frames that can be interpreted as
  boolean logic gates would be used.

  Example of request:

  .. code-block:: javascript

    {
      "inputs": [
        { "receptor_id": 1, "id": 1, "promoter_id": 17 }, 
        { "receptor_id": 3, "id": 2, "promoter_id": 23 }
      ], 
      "truth_table": [
        { "inputs": [ true, true ], "outputs": [ true, true ] }, 
        { "inputs": [ false, true ], "outputs": [ false, true ] }, 
        { "inputs": [ true, false ], "outputs": [ false, true ] }, 
        { "inputs": [ false, false ], "outputs": [ false, false ] }
      ], 
      "outputs": [ 2, 4 ]
    }

  *Notice: The truth table provided can be uncompleted. In such cases, schemes that satisfy all rows of the
  truth table will be return.*

  Example of response:

  .. code-block:: javascript

    {
      "inputs": [
        [{/* input */}, {/* receptor */}],
        [{/* input */}, {/* receptor */}]
      ],
      "logics": [
        [{/* candidate for output 1 */}, {/* candidate for output 1 */}],
        [{/* candidate for output 2 */}, {/* candidate for output 2 */}]
      ]
    }


* ``POST /circuit/details``

  Get the detailed information of a user-designed circuit.

  Example of request:

  .. code-block:: javascript

    {
      "inputs": [
        { "receptor_id": 12, "id": 8, "promoter_id": 1 }, 
        { "receptor_id": 13, "id": 9, "promoter_id": 17 }
      ], 
      "logics": [ 23, 21 ], 
      "outputs": [ 1, 2 ]
    }

  Example of response:

  .. code-block:: javascript

    {
      "inputs": [
        [{/* input */}, {/* receptor */}],
        [{/* input */}, {/* receptor */}]
      ],
      "logics": [
        {/* logic for output 1 */},
        {/* logic for output 2 */}
      ],
      "dna": [
        [ "BBa_K346002", "promoter", "TTCCATATCGCTTGACTCCGTACATGAGTACGGA..." ], 
        [ "", "biobrick_scar", "TACTAGAG" ], 
        [ "BBa_B0034", "RBS", "AAAGAGGAGAAA" ], 
        /* ... */
      ],
      "dna_export": "TTCCATATCGCTTGACTCCGTACATGAGTACGGAAGTAAGG........"
    }


Simulation
----------

* ``POST /simulation/preprocess``

  Preprocess the circuit design for simulation. Preprocessing is required before simulation because
  the regulary relationships and some other necessary information need to be retrieved from the design.

  The request is the same as that of ``POST /circuit/details``.

  Example of response:

  .. code-block:: javascript

    {
      "inputs": [ "Mercury ions" ], 
      "output_RBS": { "BBa_E1010": "BBa_B0034" }, 
      "outputs": [ "BBa_E1010" ], 
      "reactants": [ "BBa_E1010", "Mercury ions" ], 
      "relationships": [
        {
          "K": 0.0021, 
          "from": "Mercury ions", 
          "gamma": 0.122, 
          "n": 1.2, 
          "to": "BBa_E1010", 
          "type": "BIREPRESS"
        }
      ]
    }

  The ``output_RBS`` of the preprocessing result can be change before simulation. The changes of RBS will
  result in the changes of the values of ``alpha`` in the simulation.


* ``POST /simulation/simulate/static``

  Static simulation. The concentration of one of the input will be constant and the concentration of
  the other input will vary.

  Example of request:

  .. code-block:: javascript

    {
      "output_RBS": {/* ... */},
      "reactants": [/* ... */],
      "relationships": [/* ... */],
      "c_static": 1.0, /* The concentration of the static input */
      "t": 200  /* Time of reaction */
    }

  Example of response:

  .. code-block:: javascript

    {
      "c_input": [
        0.0001, 0.000316227766017, 0.001, 0.00316227766017, 
        0.01, 0.0316227766017, 0.1, 0.316227766017, 1.0
      ], 
      "c_output": [
        {
          "variable": "Mercury ions",
          "c": {
            "BBa_E1010": [
              0.30411990073366146, 
              1.1259746535556292, 
              3.5056683139687936, 
              7.472784059484611, 
              10.440528797897906, 
              11.59745840267149, 
              11.929511156553845, 
              12.015928637653683, 
              12.037832830968352
            ]
          }
        }
      ]
    }


* ``POST /simulation/simulate/dynamic``

  Dynamic simulation. Give a initial concentrations of all reactant and observe how the concentrations
  change over time.

  Example of request:

  .. code-block:: javascript

    {
      "output_RBS": {/* ... */},
      "reactants": [/* ... */],
      "relationships": [/* ... */],
      "x0": {  /* Initial concentrations */
        "Arsenic ions": 0.003, "aTc": 0.001, "Zinc ions": 0.01, "PAI": 0.004
      },
      "t": 200  /* Time of reaction */
    }

  Example of response:

  .. code-block:: javascript

    {
      "t": [
        0.0, 5.0, 10.0, 15.0, 20.0, 25.0, 30.0, 35.0, 40.0, 45.0, 
        50.0, 55.0, 60.0, 65.0, 70.0, 75.0, 80.0, 85.0, 90.0, 95.0, 100.0
      ],
      "c": {
        "BBa_E1010": [
          0.0, 3.5471085416412245, 5.889406992324342, 7.436121010414228, 
          8.457478469975687, 9.13192179697643, 9.577283724437871, 9.871374589156435, 
          10.065573879777089, 10.193812488166891, 10.278493174372407, 
          10.334411396488303, 10.371336552680521, 10.395719787844786, 
          10.411821064545714, 10.422453415407007, 10.429474404297356, 
          10.434110658841762, 10.437172172901423, 10.439193819523224, 
          10.440528797897906
        ]
      }
    }
