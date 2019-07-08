import { createStore, dispatch } from "../src";
import { expect } from "chai";

describe("dispatch", function() {
  it("dispatch()", function() {
    const testStore = createStore({
      name: "testStore1",
      state: {
        list: []
      },
      reducers: {
        getList: (action, state) => {
          state.list = action.payload.data;
          return state;
        }
      },
      effects: {
        getList: params => {
          setTimeout(() => {
            dispatch({
              name: "testStore1",
              type: "getList",
              payload: {
                data: [1, 2, 3]
              }
            });
          });
        }
      }
    });

    dispatch({
      name: "testStore1",
      type: "getList",
      payload: {
        params: null
      }
    });

    testStore.state$.subscribe(state => {
      expect(state.list).to.be.an("array");
        expect([1, 2, 3]).to.eql(state.list);
    });
  });
});
