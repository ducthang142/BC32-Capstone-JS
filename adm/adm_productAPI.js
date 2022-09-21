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

function apiAddProduct(product) {
  return axios({
    url: "https://62f5093c535c0c50e768484e.mockapi.io/capstoneProducts",
    method: "POST",
    data: product,
  });
}

function apiDeleteProduct(productId) {
  return axios({
    url: `https://62f5093c535c0c50e768484e.mockapi.io/capstoneProducts/${productId}`,
    method: "delete",
  });
}

function apiGetProductById(productId) {
  return axios({
    url: `https://62f5093c535c0c50e768484e.mockapi.io/capstoneProducts/${productId}`,
    method: "GET",
  });
}

function apiUpdateProduct(productId, product) {
  return axios({
    url: `https://62f5093c535c0c50e768484e.mockapi.io/capstoneProducts/${productId}`,
    method: "PUT",
    data: product,
  });
}
