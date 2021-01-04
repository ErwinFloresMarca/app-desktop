module.exports = {
    pluginOptions: {
        electronBuilder:{
            builderOptions: {
                productName: 'Planillas Cooperativa 18 de Julio R.L.',
                "nsis": {
                    "allowElevation": false,
                    "allowToChangeInstallationDirectory": true,
                    "oneClick": false,
                    "perMachine": true
                }
            }
        }
    },
    publicPath: '/app-desktop/'
}