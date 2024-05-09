import api from "./api";

const auth = {
  userDetail: () => api.get("/api/v1/user"),
  singup: (data) => api.post("/users/social/singup", data),
  login: (data) => api.post("/users/login", data),
  updateUser: (data) => api.patch("/users", data),
};

const common = {
  generateImage: (data) => api.post("/api/v1/eikonify/check/", data),
  getListing: () => api.get("/api/v1/eikonify/request/user"),
  getDetails: (id) => api.get("/api/v1/eikonify/requestId/" + id),
  addCollection: (data) => api.post("/api/v1/collection", data),
  getCollection: (data) => api.get("/api/v1/collection", data),
  addfavorites: (id,data) => api.patch("/api/v1/eikonify/addfavorite/"+id, data),
  updatePLU: (id, data) => api.patch("/api/v1/image/"+id, data),
  GetExcelApi: (collectionid, day) =>api.get("/api/v1/excel?collectionId=" + collectionid + "&day=" + day),
  regenerateImage: (id, data) => api.post("/api/v1/eikonify/" + id, data),
  getbycollection: (id) => api.get("api/v1/bycollection/" + id),
  genrateZip: (id) => api.get("/api/v1/compress?collectionId=" + id),
  getArchive: () => api.get("/api/v1/Archives"),
};

export { auth, common };
