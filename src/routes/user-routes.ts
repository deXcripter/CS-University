import express, { Router } from 'express';

const router = Router();

router.route('/').get().post().patch().delete();

export default router;
