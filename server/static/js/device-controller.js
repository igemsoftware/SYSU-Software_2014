var data =
{
    "circuits": [
    {
        "inputs": [
        {
            "id": 1, //在Circuit或Device中时，"id": null表示无输入只有promoter(s)
            "type": "input",
            "name": "Input XXX",
            //以下字段仅在Circuit或Device中存在
            "receptor": {
                "id": 1,
                "type": "receptor",
                "name": "Receptor XXX",
                //以下字段仅在Circuit或Device中存在
                "eid": "87z53h6uw2zq3pe4aw8tjk6ozj4xiqss",
            },
            "promoters": [
            {
                "id": 1,
                "type": "promoter",
                "name": "Promoter XXX",
                //以下字段仅在Circuit或Device中存在
                "eid": "ljdw4eb1dgycygxb53bzj8cndf5zlcb7",
            },
            {
                "id": 1,
                "type": "promoter",
                "name": "Promoter XXX",
                //以下字段仅在Circuit或Device中存在
                "eid": "fnqbfwmhnfninvp3s7t2w8blenvbgwkg",
            }],
            "eid": "ug913e44yic9jdmjejecve8rycajpdlr",
        },
        {
            "id": 1, //在Circuit或Device中时，"id": null表示无输入只有promoter(s)
            "type": "input",
            "name": "Input XXX",
            //以下字段仅在Circuit或Device中存在
            "receptor": {
                "id": 1,
                "type": "receptor",
                "name": "Receptor XXX",
                //以下字段仅在Circuit或Device中存在
                "eid": "pv8et3xa8axgv32lmere5iyh1kfay215",
            },
            "promoters": [
            {
                "id": 1,
                "type": "promoter",
                "name": "Promoter XXX",
                //以下字段仅在Circuit或Device中存在
                "eid": "d7bzz136aw9bbnss1mdxwrd7pjjsv7if",
            },
            {
                "id": 1,
                "type": "promoter",
                "name": "Promoter XXX",
                //以下字段仅在Circuit或Device中存在
                "eid": "zjq575w95fbd8i6ba6nlqcaverm1vm9a",
            }],
            "eid": "g2c1vsvl6dd1dtqh3m5i78s7z5j9gieg",
        }],
        "outputs": [
        {
            "id": 1,
            "type": "output",
            "name": "Output XXX",
            //以下字段仅在Circuit或Device中存在
            "eid": "oxpjvcudkb11ntj89rcnajo9yrc78gu1",
        },
        {
            "id": 1,
            "type": "output",
            "name": "Output XXX",
            //以下字段仅在Circuit或Device中存在
            "eid": "4qorz4jsxvtgp7cv3y3dr7o5mw3ta9da",
        }],
        //如果是简单通路，则"logic": null
        //circuit的inputs和outputs，与logic中的inputs和outputs按顺序一一对应
        "logic":
        {
            "id": 1,
            "type": "logic",
            "name": "And Gate XXX",
            "truth_table": "FFFT",
            "intermedia": ["XXX", "YYY"],
            //以下两个字段在Circuit或Device中能被替换
            "inputs": [
            {
                "RBS": {/* An RBS object */},
                "output": {/* An output object */}
            },
            {
                "RBS": {/* An RBS object */},
                "output": {/* An output object */}
            },
            ],
            "outputs": [
            {
                "promoter": {/* An promoter object */},
                "RBS": {/* An RBS object */},
            },
            ],
            //以下字段仅在Circuit或Device中存在
            "eid": "o3pxziho8to314qn4cdehfy1ymzocoan",
        },
    },
    {
        "inputs": [
        {
            "id": 1, //在Circuit或Device中时，"id": null表示无输入只有promoter(s)
            "type": "input",
            "name": "Input XXX",
            //以下字段仅在Circuit或Device中存在
            "receptor": {
                "id": 1,
                "type": "receptor",
                "name": "Receptor XXX",
                //以下字段仅在Circuit或Device中存在
                "eid": "c243mpr84qi8x9oe21fdns5r47htwsvy",
            },
            "promoters": [
            {
                "id": 1,
                "type": "promoter",
                "name": "Promoter XXX",
                //以下字段仅在Circuit或Device中存在
                "eid": "ezuvlqfdf1xu7maq5a29osyfj8c3q6v8",
            },
            {
                "id": 1,
                "type": "promoter",
                "name": "Promoter XXX",
                //以下字段仅在Circuit或Device中存在
                "eid": "v24g3evw3ayzeyuhcpnmpuo5vmprnqgq",
            }
            ],
                "eid": "czdbi5txn9tc4yk26xjoa1byflzy9jw1",
        },
        {
            "id": 1, //在Circuit或Device中时，"id": null表示无输入只有promoter(s)
            "type": "input",
            "name": "Input XXX",
            //以下字段仅在Circuit或Device中存在
            "receptor": {
                "id": 1,
                "type": "receptor",
                "name": "Receptor XXX",
                //以下字段仅在Circuit或Device中存在
                "eid": "hev5u5bjast3sqqx2bsfcmor6zswgz7k",
            },
            "promoters": [
            {
                "id": 1,
                "type": "promoter",
                "name": "Promoter XXX",
                //以下字段仅在Circuit或Device中存在
                "eid": "hh7wwph7xz3ee7f4qf21rqrfqihe6i8n",
            },
            {
                "id": 1,
                "type": "promoter",
                "name": "Promoter XXX",
                //以下字段仅在Circuit或Device中存在
                "eid": "i6c3h9mo9wb6cswehnm3krcoanyvn1hc",
            }],
            "eid": "us47e3ep5b7ykhga2f9tqci2uq7p2jul",
        }],
        "outputs": [
        {
            "id": 1,
            "type": "output",
            "name": "Output XXX",
            //以下字段仅在Circuit或Device中存在
            "eid": "zabcyod2vi4ggeqmw1g5nce4lm1e8vyv",
        },
        {
            "id": 1,
            "type": "output",
            "name": "Output XXX",
            //以下字段仅在Circuit或Device中存在
            "eid": "gtrvvu3gioni5tpl4rcz7xbnwes214fs",
        }],
        //如果是简单通路，则"logic": null
        //circuit的inputs和outputs，与logic中的inputs和outputs按顺序一一对应
        "logic":
        {
            "id": 1,
            "type": "logic",
            "name": "And Gate XXX",
            "truth_table": "FFFT",
            "intermedia": ["XXX", "YYY"],
            //以下两个字段在Circuit或Device中能被替换
            "inputs": [
            {
                "RBS": {/* An RBS object */},
                "output": {/* An output object */}
            },
            {
                "RBS": {/* An RBS object */},
                "output": {/* An output object */}
            },
            ],
            "outputs": [
            {
                "promoter": {/* An promoter object */},
                "RBS": {/* An RBS object */},
            },
            ],
            //以下字段仅在Circuit或Device中存在
            "eid": "mjk2x79gj1wg6tc7qpd85vqd6mvee1iu",
        },
    },
    {
        "inputs": [
        {
            "id": 1, //在Circuit或Device中时，"id": null表示无输入只有promoter(s)
            "type": "input",
            "name": "Input XXX",
            //以下字段仅在Circuit或Device中存在
            "receptor": {
                "id": 1,
                "type": "receptor",
                "name": "Receptor XXX",
                //以下字段仅在Circuit或Device中存在
                "eid": "fjxddpihcnoj6ho3wtipld47fi42zpms",
            },
            "promoters": [
            {
                "id": 1,
                "type": "promoter",
                "name": "Promoter XXX",
                //以下字段仅在Circuit或Device中存在
                "eid": "zqxivoc28d7sxdv2cqhqew2fj398oxsz",
            },
            {
                "id": 1,
                "type": "promoter",
                "name": "Promoter XXX",
                //以下字段仅在Circuit或Device中存在
                "eid": "qv1zb27xkkku2flpt5pcwj2c2wcpe3nm",
            }],
                "eid": "ic1luiy3zco46qhzldty5fxx54xz9c23",
        },
        {
            "id": 1, //在Circuit或Device中时，"id": null表示无输入只有promoter(s)
            "type": "input",
            "name": "Input XXX",
            //以下字段仅在Circuit或Device中存在
            "receptor": {
                "id": 1,
                "type": "receptor",
                "name": "Receptor XXX",
                //以下字段仅在Circuit或Device中存在
                "eid": "su4t5hv97lcqcsd8hm4oz151utrcqoz5",
            },
            "promoters": [
            {
                "id": 1,
                "type": "promoter",
                "name": "Promoter XXX",
                //以下字段仅在Circuit或Device中存在
                "eid": "zf216ptf3fa5444iivih8vgphntsnc25",
            },
            {
                "id": 1,
                "type": "promoter",
                "name": "Promoter XXX",
                //以下字段仅在Circuit或Device中存在
                "eid": "sgbjt37vsvcjg54hk4rjkowrpxrbkrjh",
            }],
            "eid": "e3dk9gch9t2ozaj1kv6gouaqdak8bpn6",
        }],
        "outputs": [
        {
            "id": 1,
            "type": "output",
            "name": "Output XXX",
            //以下字段仅在Circuit或Device中存在
            "eid": "dinffwby34yehfz4lm8iuw5iuya8uqpk",
        },
        {
            "id": 1,
            "type": "output",
            "name": "Output XXX",
            //以下字段仅在Circuit或Device中存在
            "eid": "s9117uhtvdvapwhnx4p3qff5u7ijjw19",
        }],
        //如果是简单通路，则"logic": null
        //circuit的inputs和outputs，与logic中的inputs和outputs按顺序一一对应
        "logic":
        {
            "id": 1,
            "type": "logic",
            "name": "And Gate XXX",
            "truth_table": "FFFT",
            "intermedia": ["XXX", "YYY"],
            //以下两个字段在Circuit或Device中能被替换
            "inputs": [
            {
                "RBS": {/* An RBS object */},
                "output": {/* An output object */}
            },
            {
                "RBS": {/* An RBS object */},
                "output": {/* An output object */}
            },
            ],
            "outputs": [
            {
                "promoter": {/* An promoter object */},
                "RBS": {/* An RBS object */},
            },
            ],
            //以下字段仅在Circuit或Device中存在
            "eid": "f55ezaqjwf3g6ctnz5sy18oxkbmer68p",
        },
    }],
    "relationships": [
    {
        "from": "58d44e82aa1c4ca0bf3983583fedc556",
        "to": "c5820968a77f4c278093a048fe60e28a",
        "type": "promote",
    },
    {
        "from": "02d32d2742a2494f98a641b3c535d0fe",
        "to": "418d4ad9ebf04655a4815799af23a915",
        "type": "repress",
    }]
};

var controller = new g.Application("canvas");
