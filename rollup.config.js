const path=require('path')
const ts =require('rollup-plugin-typescript2')
const {dts} = require('rollup-plugin-dts')

module.exports=[
    {
        input:'./src/core/index.ts',
        output:[
            {
                file:path.resolve(__dirname,'dist/index.esm.js'),
                format:'es',
            },
            {
                file:path.resolve(__dirname,'dist/index.cjs.js'),
                format:'cjs',
            },
            {
                file:path.resolve(__dirname,'dist/index.js'),
                format:'umd',
                name:'Maniter'
            },
        ],
        plugins:[
            ts()
        ]
    },
    {
        input:'./src/core/index.ts',
        output:{
            file:path.resolve(__dirname,'dist/index.d.ts'),
            format:'es'
        },
        plugins:[
            dts()
        ]
    }
]