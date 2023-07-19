import {
  call, take, fork, put, select,
} from 'redux-saga/effects';

import { eventChannel, END } from 'redux-saga';
import { actions } from '@app/shared/store/index';
import { actions as mainActions } from '@app/containers/Main/store/index';
import { setSystemState } from '@app/shared/store/actions';

import { EpochesStateType } from '@app/containers/Main/interfaces';
import { TxsEvent } from '@core/types';

import Utils from '@core/utils.js';
import { SharedStateType } from '../interface';
import store from '../../../index';

export function remoteEventChannel() {
  return eventChannel((emitter) => {
    Utils.initialize(
      {
        appname: 'BEAM DAO Voting app',
        min_api_version: '6.2',
        headless: false,
        apiResultHandler: (error, result, full) => {
          if (!result.error) {
            emitter(full);
          }
        },
      },
      (err) => {
        // eslint-disable-next-line
        console.error(err);
        Utils.download('./votingAppShader.wasm', (downloadError, bytes) => {
          Utils.callApi('ev_subunsub', { ev_txs_changed: true, ev_system_state: true }, (error, result) => {
            if (result) {
              store.dispatch(mainActions.loadAppParams.request(bytes));
            }
          });
        });
      },
    );

    const unsubscribe = () => {
      emitter(END);
    };

    return unsubscribe;
  });
}

export function* handleTransactions(payload: TxsEvent) {
  yield put(actions.setTransactions(payload.txs));
}

function* sharedSaga() {
  const remoteChannel = yield call(remoteEventChannel);

  while (true) {
    try {
      const payload: any = yield take(remoteChannel);
      switch (payload.id) {
        case 'ev_system_state': {
          const appParams = (yield select()) as { main: EpochesStateType; shared: SharedStateType };
          store.dispatch(setSystemState(payload.result));

          if (appParams.shared.isLoaded) {
            store.dispatch(mainActions.loadAppParams.request(null));
          }

          break;
        }
        case 'ev_txs_changed': {
          yield fork(handleTransactions, payload.result);
          break;
        }
        default:
          break;
      }
    } catch (err) {
      remoteChannel.close();
    }
  }
}

export default sharedSaga;
