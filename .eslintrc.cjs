module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    globals: {},
    /* 指定如何解析语法 */
    parser: 'vue-eslint-parser',
    /** 优先级低于 parse 的语法解析配置 */
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: '@typescript-eslint/parser',
        jsxPragma: 'React',
        ecmaFeatures: {
            jsx: true,
        },
    },
    /* 继承已有的规则 */
    extends: ['eslint:recommended', 'plugin:vue/vue3-essential', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
    plugins: ['vue', '@typescript-eslint'],
    overrides: [
        {
            files: ['*.ts', '*.tsx', '*.vue'],
            rules: {
                'no-undef': 0,
            },
        },
    ],
    /*
     * 'off' 或 0    ==>  关闭规则
     * 'warn' 或 1   ==>  打开的规则作为警告（不影响代码执行）
     * 'error' 或 2  ==>  规则作为一个错误（代码不能执行，界面报错）
     */
    rules: {
        // typeScript (https://typescript-eslint.io/rules)
        '@typescript-eslint/no-unused-vars': 2, // 禁止定义未使用的变量
        '@typescript-eslint/prefer-ts-expect-error': 2, // 禁止使用 @ts-ignore
        '@typescript-eslint/no-explicit-any': 0, // 禁止使用 any 类型
        '@typescript-eslint/no-non-null-assertion': 0,
        '@typescript-eslint/no-namespace': 0, // 禁止使用自定义 TypeScript 模块和命名空间。
        '@typescript-eslint/semi': 0,
        'no-prototype-builtins': 0, // 可以使用obj.hasOwnProperty()
        '@typescript-eslint/no-var-requires': 0, // 不允许在import 中使用require
        '@typescript-eslint/no-empty-function': 2, // 关闭空方法检查
        // eslint-plugin-vue (https://eslint.vuejs.org/rules/)
        'vue/multi-word-component-names': 0, // 要求组件名称始终为 “-” 链接的单词
        'vue/script-setup-uses-vars': 2, // 防止<script setup>使用的变量<template>被标记为未使用
        'vue/no-mutating-props': 0, // 不允许组件 prop的改变
        'vue/no-v-html': 0, // 禁止使用 v-html
        'vue/no-setup-props-destructure': 0, // 禁止 props 解构传递给 setup
        'vue/no-v-model-argument': 0, // 不允许添加要在 v-model 自定义组件中使用的参数
        'vue/component-definition-name-casing': [2, 'PascalCase'], // 强制使用组件定义名称的特定大小写 PascalCase | kebab-case
        'vue/attribute-hyphenation': [2, 'always', { ignore: [] }], // 对模板中的自定义组件强制实施属性命名样式
        'vue/no-dupe-keys': [2, { groups: [] }], // 不允许重复字段名称
        'vue/no-dupe-v-else-if': 2, // 不允许 / v-else-if 链中的 v-if 重复条件
        'vue/no-duplicate-attributes': 2, // 禁止属性重复
        'vue/no-ref-as-operand': 2, // 使用ref对象必须.value
        'vue/first-attribute-linebreak': [
            2,
            {
                singleline: 'ignore',
                multiline: 'below',
            },
        ], // 强制设置第一个属性的位置
​
        '@typescript-eslint/no-this-alias': [
            'warn',
            {
                allowDestructuring: false, // Disallow `const { props, state } = this`; true by default
                allowedNames: ['_this'], // this的別名可以为_this
            },
        ],
        // eslint（https://eslint.bootcss.com/docs/rules/）
        'no-unexpected-multiline': 2, // 禁止空余的多行
        'no-await-in-loop': 2, // 该规则不允许在循环体中使用 await
        'no-dupe-else-if': 2, // 禁止 if-else-if 链中的重复条件
        'no-const-assign': 2, // 禁止重新分配 const 变量
        'no-dupe-keys': 2, // 禁止对象字面量中的重复键
        'no-multiple-empty-lines': ['warn', { max: 1 }], // 不允许多个空行
        'no-unused-vars': 2, // 禁止未使用的变量
        'use-isnan': 2, // 检查 NaN 时需要调用 isNaN()
        'valid-typeof': 2, // 强制将 typeof 表达式与有效字符串进行比较
        'no-var': 2, // 要求使用 let 或 const 而不是 var
        'no-extra-semi': 2, // 禁止不必要的分号
        'no-multi-str': 2, // 禁止多行字符串
        'no-unused-labels': 2, // 禁止未使用的标签
        // 在打开数组括号之后和关闭数组括号之前强制换行
        'array-bracket-newline': [2, 'consistent'], 
        eqeqeq: [2, 'smart'], // 必须使用全等
        'arrow-spacing': 2, // 在箭头函数中的箭头前后强制执行一致的间距
        // 在函数调用的参数之间强制换行
        'function-call-argument-newline': [2, 'consistent'], 
        'no-undef': 2, // 禁止使用未声明的变量，除非在 /*global */ 注释中提及
        complexity: [2, 15],
        indent: [2, 4, { SwitchCase: 1 }],
        'valid-jsdoc': 0, //jsdoc规则
        'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        'no-useless-escape': 0, // 禁止不必要的转义字符
        '@typescript-eslint/ban-types': 0, // 允许使用function 声明函数
        'prettier/prettier': [
            2,
            {
                //在单独的箭头函数参数周围包括括号 always：(x) => x \ avoid：x => x
                arrowParens: 'always',
                // 开始标签的右尖括号是否跟随在最后一行属性末尾，默认false
                bracketSameLine: false,
                // 对象字面量的括号之间打印空格
                bracketSpacing: true,
                // 是否格式化一些文件中被嵌入的代码片段的风格(auto|off;默认auto)
                embeddedLanguageFormatting: 'auto',
                // 指定 HTML 文件的空格敏感度 (css|strict|ignore;默认css)
                htmlWhitespaceSensitivity: 'ignore',
                // 一行最多多少个字符
                printWidth: 150,
                // 超出打印宽度 (always | never | preserve )
                proseWrap: 'preserve',
                // 对象属性是否使用引号(as-needed | consistent | preserve;
                quoteProps: 'as-needed',
                // 指定要使用的解析器，不需要写文件开头的 @prettier
                requirePragma: false,
                // 不需要自动在文件开头插入 @prettier
                insertPragma: false,
                // 最后不需要引号
                semi: false,
                // 使用单引号 (true:单引号;false:双引号)
                singleQuote: true,
                // 缩进空格数，默认2个空格
                tabWidth: 4,
                // 多行时尽可能打印尾随逗号。
                trailingComma: 'es5',
                // 使用制表符而不是空格缩进行
                useTabs: false,
                // Vue文件脚本和样式标签缩进
                vueIndentScriptAndStyle: false,
                // 换行符使用 lf 结尾是 可选值"<auto|lf|crlf|cr>"
                endOfLine: 'crlf',
            },
        ],
    },
}

