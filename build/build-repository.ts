#!/usr/bin/env ts-node

/*!
 * Script to build additional assets for portal.
 * Copyright 2020-2024 Chocolatey Software
 * Licensed under Apache License (https://github.com/chocolatey/choco-theme/blob/main/LICENSE)
 */

import * as esbuild from 'esbuild';
import { purgeCss } from './functions/purge-css';
import { repository } from './functions/determine-repository';
import { repositoryConfig } from './data/repository-config';

const init = async () => {
    console.log('🚀 Compiling and minifying repository JS...');

    let esbuildOptions: esbuild.BuildOptions = {
        entryPoints: [''],
        target: 'es2015',
        bundle: true,
        outdir: '',
        minify: true,
        outExtension: { '.js': '.min.js' }
    }

    switch (repository.name) {
        case repositoryConfig.ccm.name:
            esbuildOptions = {
                ...esbuildOptions,
                entryPoints: [
                    `${repository.js}src/views/**/*.js`
                ],
                outdir: `${repository.js}dist/`
            };
            break;
        case repositoryConfig.portal.name:
            esbuildOptions = {
                ...esbuildOptions,
                entryPoints: [`${repository.js}src/*.js`],
                outdir: repository.js
            };
            break;
    }

    await esbuild.build({
        ...esbuildOptions
    }).then(async () => {
        console.log('✅ Repository JS compiled and minified');

        // PurgeCSS
        // await purgeCss({
        //     source: `${repository.css}${repository.name}.min.css`,
        //     repository: repository
        // });
    });
};

init();
