import { Router } from 'express';
import { HomeRoutes } from '../modules/home/home.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/',
    routes: HomeRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.routes));

export default router;
