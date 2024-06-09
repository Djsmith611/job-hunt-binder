import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';

import rootReducer from './reducers/_root.reducer';
import rootSaga from './sagas/_root.saga';
import uploadMiddleware from './middleware/uploadMiddleware';

const sagaMiddleware = createSagaMiddleware();

const middlewareList = process.env.NODE_ENV === 'development' ?
  [sagaMiddleware, logger, uploadMiddleware] :
  [sagaMiddleware, uploadMiddleware];

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: false,
        serializableCheck: {
          ignoredActions: ['UPLOAD_DOCUMENT_REQUEST'],
          ignoredPaths: ['payload.document'],
        },
      }).concat(middlewareList),
  });

sagaMiddleware.run(rootSaga);

export default store;
