import { useReducer } from 'react';
import Dashboard from './components/Dashboard';
import { seedGuests } from './data/guests';
import { seedBandit, seedContext, seedMetrics } from './data/context';
import { advance, buildIntervention } from './lib/simulation';
import type { AppState, OverrideReason } from './types';

function initialState(): AppState {
  return {
    clockMinutesOffset: 0,
    selectedGuestId: seedGuests[0].id,
    guests: seedGuests.map((g) => ({ ...g })),
    arrivedIds: [],
    bandit: seedBandit.map((b) => ({ ...b })),
    context: seedContext.map((c) => ({ ...c })),
    metrics: { ...seedMetrics },
    interventions: [],
    overrideModalGuestId: null,
  };
}

type Action =
  | { type: 'SELECT_GUEST'; id: string }
  | { type: 'OPEN_OVERRIDE'; id: string }
  | { type: 'CLOSE_OVERRIDE' }
  | { type: 'SUBMIT_OVERRIDE'; id: string; reason: OverrideReason }
  | { type: 'ADVANCE_15' }
  | { type: 'RESET' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SELECT_GUEST':
      return { ...state, selectedGuestId: action.id };
    case 'OPEN_OVERRIDE':
      return { ...state, overrideModalGuestId: action.id };
    case 'CLOSE_OVERRIDE':
      return { ...state, overrideModalGuestId: null };
    case 'SUBMIT_OVERRIDE': {
      const guest = state.guests.find((g) => g.id === action.id);
      if (!guest) return state;
      const intervention = buildIntervention(
        guest,
        action.reason,
        state.clockMinutesOffset,
      );
      return {
        ...state,
        overrideModalGuestId: null,
        guests: state.guests.map((g) =>
          g.id === guest.id ? { ...g, override: action.reason } : g,
        ),
        interventions: [intervention, ...state.interventions],
      };
    }
    case 'ADVANCE_15':
      return advance(state, 15);
    case 'RESET':
      return initialState();
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  return (
    <Dashboard
      state={state}
      onSelectGuest={(id) => dispatch({ type: 'SELECT_GUEST', id })}
      onOpenOverride={(id) => dispatch({ type: 'OPEN_OVERRIDE', id })}
      onCloseOverride={() => dispatch({ type: 'CLOSE_OVERRIDE' })}
      onSubmitOverride={(id, reason) =>
        dispatch({ type: 'SUBMIT_OVERRIDE', id, reason })
      }
      onAdvance={() => dispatch({ type: 'ADVANCE_15' })}
      onReset={() => dispatch({ type: 'RESET' })}
    />
  );
}
