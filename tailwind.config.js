/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{vue,js,ts,jsx,tsx}'
    ],
    darkMode: 'selector',
    theme: {
        extend: {
            colors: {
            }
        },
    },
    plugins: [
        require('tailwind-scrollbar')
    ]
}