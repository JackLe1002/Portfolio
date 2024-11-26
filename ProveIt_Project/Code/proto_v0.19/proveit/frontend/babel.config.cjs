module.exports = {
    presets: [
        '@babel/preset-env',
        '@babel/preset-react',
        '@babel/preset-typescript',
    ],
    plugins: [
        'babel-plugin-transform-import-meta',
        ["@babel/plugin-transform-runtime", {
            "regenerator": true
        }]
    ]
};
