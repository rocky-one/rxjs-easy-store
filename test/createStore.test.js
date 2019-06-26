import { createStore } from "../dist";
import { expect } from "chai";

describe("createStore", function() {
  it("createStore()", function() {
    const store = createStore({
      name: "testStore",
      state: {
        list: []
      },
      reducers: {
        getList: (action, state) => {
          state.list = action.payload.data;
          return state;
        }
      },
      effect: {
        getList: params => {
          dispatch({
            name: "testStore",
            type: "getList",
            payload: {
              data: [{ name: "x", id: 1 }]
            }
          });
        }
      }
    });
    expect(store).to.have.ownProperty("state$");
    expect(store).to.have.ownProperty("effects");
  });
});
