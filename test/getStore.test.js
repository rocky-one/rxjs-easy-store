import { createStore, getStore } from "../src";
import { expect } from "chai";

describe("getStore", function() {
  it("getStore()", function() {
    createStore({
      name: "testStore2",
      state: {
        list: [1, 2, 3]
      },
      reducers: {},
      effects: {}
    });
    const store = getStore("testStore2");
    expect(store).to.have.ownProperty("list");
    expect([1, 2, 3]).to.eql(store.list);
  });
});
