"use strict";

const axios = require("axios");

class IslandService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

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
}

module.exports = IslandService;
