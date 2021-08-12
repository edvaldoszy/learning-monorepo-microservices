import { Route } from '~/routes';

import controllers from './controllers';

const routes: Route[] = [
  {
    method: 'post',
    path: '/taks',
    handlers: [
      controllers.create,
    ],
  },
  // {
  //   public: true,
  //   method: 'post',
  //   path: '/users/login',
  //   handlers: [
  //     controllers.login,
  //   ],
  // },
  // {
  //   method: 'put',
  //   path: '/users/login',
  //   handlers: [
  //     controllers.refresh,
  //   ],
  // },
];

export default routes;
