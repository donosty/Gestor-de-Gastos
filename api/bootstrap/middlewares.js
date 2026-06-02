import express from 'express';

function registerMiddlewares(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
}

export { registerMiddlewares };