"use strict";

const axios = require("axios");

class IslandService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  // Authentication Tests

  async authenticate(user) {
    try {
      const response = await axios.post(
        this.baseUrl + "/api/users/authenticate",
        user
      );
      axios.defaults.headers.common["Authorization"] = // we are setting an Authorization header, containing the token we have just received. This will be used on all subsequent requests.
        "Bearer " + response.data.token;
      return response.data;
    } catch (e) {
      return null;
    }
  }

  // clear the token
  async clearAuth(user) {
    axios.defaults.headers.common["Authorization"] = "";
  }

  // User Tests

  async getUsers() {
    try {
      const response = await axios.get(this.baseUrl + "/api/users");
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async getUser(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/users/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async createUser(newUser) {
    try {
      const response = await axios.post(this.baseUrl + "/api/users", newUser);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteAllUsers() {
    try {
      const response = await axios.delete(this.baseUrl + "/api/users");
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteOneUser(id) {
    try {
      const response = await axios.delete(this.baseUrl + "/api/users/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  // POI Tests

  async retrieveOneIsland(islandId) {
    try {
      const response = await axios.get(
        this.baseUrl + "/api/islands/showIslandDetails/" + islandId
      );
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async retrieveAllIslands() {
    try {
      const response = await axios.get(this.baseUrl + "/api/islands/find");
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async createIsland(newIsland) {
    try {
      const response = await axios.post(
        this.baseUrl + "/api/islands/addIsland",
        newIsland
      );
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async getAllRegions() {
    try {
      const response = await axios.get(
        this.baseUrl + "/api/regions/listRegions"
      );
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteAllIslands() {
    try {
      const response = await axios.delete(
        this.baseUrl + "/api/islands/deleteAll"
      );
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteOneIsland(id) {
    try {
      const response = await axios.delete(
        this.baseUrl + "/api/islands/deleteIsland/" + id
      );
      return response.data;
    } catch (e) {
      return null;
    }
  }
}

module.exports = IslandService;
