import { createStore, getStore, removeStore } from "../dist";
import { expect } from "chai";

describe("getStore", function() {
  it("getStore()", function() {
    createStore({
      name: "testStore3",
      state: {
        list: []
      },
      reducers: {},
      effects: {}
    });
    const store = getStore("testStore3");
    expect(store).to.have.ownProperty("list");
    const status = removeStore("testStore3");
    expect(status).to.be.true;
  });
});
