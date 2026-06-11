import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Overview from './pages/Overview';
import Map from './pages/Map';
import Traffic from './pages/Traffic';
import Pipeline from './pages/Pipeline';
import Environment from './pages/Environment';
import Events from './pages/Events';
import Report from './pages/Report';
import Login from './pages/Login';
import Handover from './pages/Handover';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Overview />,
      },
      {
        path: 'map',
        element: <Map />,
      },
      {
        path: 'traffic',
        element: <Traffic />,
      },
      {
        path: 'pipeline',
        element: <Pipeline />,
      },
      {
        path: 'environment',
        element: <Environment />,
      },
      {
        path: 'events',
        element: <Events />,
      },
      {
        path: 'report',
        element: <Report />,
      },
      {
        path: 'handover',
        element: <Handover />,
      },
    ],
  },
]);

export default router;
