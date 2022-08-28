/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ['./lib/**/*.tsx', './src/**/*.tsx'],
    theme: {
        extend: {},
        container: {
            screens: {
                '2xl': '1280px',
                'xl': '1280px'
            }
        }
    },
    plugins: [],
};
