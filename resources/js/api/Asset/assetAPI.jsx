import Cookies from 'js-cookie';

import axiosClient from '../axiosClient';
const token = Cookies.get('SESSION-TOKEN');
const assetAPI = {
  async getlistAsset(params) {
    const response = await axiosClient
      .get('/assets', {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((respo) => {
        return respo;
      })
      .catch((error) => {
        return error.message;
      });
    if (response.status === 401) {
      return 401;
    }
    if (response.status === 'success') {
      return response;
    }
  },
  async getDetailAsset(params) {
    const response = await axiosClient
      .get(`/api/assets/${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((respo) => {
        return respo;
      })
      .catch((error) => {
        return error.message;
      });
    if (response.status === 401) {
      return 401;
    }
    if (response.status === 'success') {
      return response;
    }
  },
};
export default assetAPI;
