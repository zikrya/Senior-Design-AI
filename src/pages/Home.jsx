import React from 'react';

const Home = () => {
    return (
        <>
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                <title>Tailwind Starter Template - App Landing Page Template: Tailwind Toolbox</title>
                <meta name="description" content="" />
                <meta name="keywords" content="" />

                <link rel="stylesheet" href="https://unpkg.com/tailwindcss@2.2.19/dist/tailwind.min.css" />

                <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700" rel="stylesheet" />

                <style>
                    /* Your animation styles here */
                </style>
            </head>

            <body className="leading-normal tracking-normal text-gray-900" style={{ fontFamily: "'Source Sans Pro', sans-serif" }}>
                <div className="h-screen pb-14 bg-right bg-cover" style={{ backgroundImage: "url('bg.svg')" }}>
                    <div className="container pt-24 md:pt-48 px-6 mx-auto flex flex-wrap flex-col md:flex-row items-center">
                        <div className="flex flex-col w-full xl:w-2/5 justify-center lg:items-start overflow-y-hidden">
                            <h1 className="my-4 text-3xl md:text-5xl text-purple-800 font-bold leading-tight text-center md:text-left slide-in-bottom-h1">Coding Simplified.
Learn, Practice, Succeed.</h1>
                            <p className="leading-normal text-base md:text-2xl mb-8 text-center md:text-left slide-in-bottom-subtitle">Are you a Computer Science major?</p>
                            <p className="text-blue-400 font-bold pb-8 lg:pb-6 text-center md:text-left fade-in">Test your Knowledge with TutorTech AI! </p>
                        </div>
                        <div className="w-full pt-16 pb-6 text-sm text-center md:text-left fade-in">
                            <a className="text-gray-500 no-underline hover:no-underline" href="#">&copy; TutorTech AI 2023</a>
                        </div>
                    </div>
                </div>
            </body>
        </>
    );
}

export default Home;