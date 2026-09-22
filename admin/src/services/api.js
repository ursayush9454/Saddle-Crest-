const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

/*
|--------------------------------------------------------------------------
| TOKEN
|--------------------------------------------------------------------------
*/

export const getToken = () => {
  return localStorage.getItem(
    "adminToken"
  );
};

export const setToken = (token) => {
  localStorage.setItem(
    "adminToken",
    token
  );
};

export const removeToken = () => {
  localStorage.removeItem(
    "adminToken"
  );
};

/*
|--------------------------------------------------------------------------
| API REQUEST
|--------------------------------------------------------------------------
*/

export const apiRequest = async (
  endpoint,
  options = {}
) => {
  const token = getToken();

  const isFormData =
    options.body instanceof
    FormData;

  const headers = {
    ...(isFormData
      ? {}
      : {
          "Content-Type":
            "application/json",
        }),

    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  const data =
    await response
      .json()
      .catch(() => ({}));

  /*
  |--------------------------------------------------------------------------
  | Unauthorized
  |--------------------------------------------------------------------------
  */

  if (response.status === 401) {
    removeToken();
  }

  /*
  |--------------------------------------------------------------------------
  | API ERROR
  |--------------------------------------------------------------------------
  */

  if (!response.ok) {
    throw new Error(
      data.message ||
        data.error ||
        "Something went wrong"
    );
  }

  return data;
};

export default API_URL;