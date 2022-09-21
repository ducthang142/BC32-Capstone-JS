function apiGetProduct(typeFilter) {
  return axios({
    url: "https://62f5093c535c0c50e768484e.mockapi.io/capstoneProducts",
    method: "GET",
    //Những giá trị dc định nghĩa trong object params sẽ dc thêm vào url: ?key=value
    params: {
      type: typeFilter,
    },
  });
}
