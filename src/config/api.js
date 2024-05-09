import Axios from "axios";

// export const baseURL = process.env.REACT_APP_API_URL;
// export const baseURL ='https://2a9b-2405-201-201c-88b2-2405-28d9-fa1d-f111.ngrok-free.app';
export const baseURL = `http://localhost:3000`;

const api = Axios.create({ baseURL });

api.interceptors.request.use(async (request) => {
  // request.headers["Authorization"] = "Bearer " + localStorage.getItem("token");
  request.headers["Authorization"] = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMzLCJpYXQiOjE3MTUxNDQ4MjZ9.G2qbjGaxY2XhksbVac1VkILvjPW8IIfl5fo_n8zBXMw"
  return request;
});

api.interceptors.response.use(
  async (response) => {
    if (response?.status === 201 || response?.status === 200) {
      return response;
    } else if (response?.status === 204) {
      return Promise.reject("");
    } else {
      return Promise.reject(response?.data ?? "Something Went Wrong");
    }
  },
  async (error) => {
    if (error?.response?.status === 401) {
      return Promise.reject(error?.response?.data || "Authorization Error");
    }
    if (error?.response?.status > 400) {
      return Promise.reject("Authorization Error");
    }

    return Promise.reject(
      error?.response?.data?.message ??
        error?.toString() ??
        "Something Went Wrong"
    );
  }
);

export default api;
