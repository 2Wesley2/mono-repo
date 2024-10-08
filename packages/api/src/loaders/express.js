import express from 'express';
import cors from 'cors';

export default {
  init(app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
  },
};
