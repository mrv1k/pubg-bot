module.exports = {
    "extends": "google",
    "env": {
        "node": true
    },
    "parserOptions": {
        "ecmaVersion": 8
    },
    "rules": {
        'max-len': [2, {
            ignorePattern: 'console\.log',
            "code": 100,
          }],
          "linebreak-style": 0
    }
};