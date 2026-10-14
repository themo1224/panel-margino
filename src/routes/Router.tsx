// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { lazy } from 'react';
import { Navigate, createBrowserRouter } from 'react-router';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import RequireAuth from '../components/auth/RequireAuth';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

const HomePage = Loadable(lazy(() => import('../views/home')));
const ProductsPage = Loadable(lazy(() => import('../views/products')));
const CostsPage = Loadable(lazy(() => import('../views/costs')));
const ReportsPage = Loadable(lazy(() => import('../views/reports')));
const ApiKeysPage = Loadable(lazy(() => import('../views/api-keys')));
const AlertsPage = Loadable(lazy(() => import('../views/alerts')));
const UserProfilePage = Loadable(lazy(() => import('../views/pages/user-profile')));

const Error = Loadable(lazy(() => import('../views/auth/error')));

const Login2 = Loadable(lazy(() => import('../views/auth/auth2/login')));
const Register2 = Loadable(lazy(() => import('../views/auth/auth2/register')));
const ForgotPassword2 = Loadable(lazy(() => import('../views/auth/auth2/forgot-password')));
const TwoSteps2 = Loadable(lazy(() => import('../views/auth/auth2/two-steps')));
const Maintainance = Loadable(lazy(() => import('../views/auth/maintenance')));

const Router = [
  {
    path: '/',
    element: (
      <RequireAuth>
        <FullLayout />
      </RequireAuth>
    ),
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/products', element: <ProductsPage /> },
      { path: '/costs', element: <CostsPage /> },
      { path: '/reports', element: <ReportsPage /> },
      { path: '/api-keys', element: <ApiKeysPage /> },
      { path: '/alerts', element: <AlertsPage /> },
      { path: '/pages/user-profile', element: <UserProfilePage /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '/auth/auth2/login', element: <Login2 /> },
      { path: '/auth/auth2/register', element: <Register2 /> },
      { path: '/auth/auth2/forgot-password', element: <ForgotPassword2 /> },
      { path: '/auth/auth2/two-steps', element: <TwoSteps2 /> },
      { path: '/auth/maintenance', element: <Maintainance /> },
      { path: '404', element: <Error /> },
      { path: '/auth/404', element: <Error /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

const router = createBrowserRouter(Router);

export default router;
