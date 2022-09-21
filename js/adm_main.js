getProduct();

//Tạo biến productNames là mảng dùng để chứa tên của các sản phẩm dùng để cho việc validate tên sản phẩm ko trùng nhau trước khi add
// và biến productNameEdits là mảng dùng để chứa tên sản phẩm dùng cho validate tên sản phẩm ko trùng nhau trước khi update
let productNames = [];
let productNameEdits = [];

//Viết hàm getProduct request API để lấy data về
function getProduct() {
  apiGetProduct()
    .then((response) => {
      let products = response.data;

      //Gán tên các phẩm vào mảng productNames
      productNames = products.map((product) => {
        return product.name;
      });

      //Gọi hàm display để hiển thị ra bảng
      display(products);
    })
    .catch((error) => {
      console.log(error);
    });
}

//Viết hàm addProduct request API để add thêm sản phẩm vào
function addProduct(product) {
  //Kiểm tra xem thông tin điền vào form có hợp lệ hay ko, nếu ko thì dừng hàm
  let form = validateForm();
  if (!form) {
    return;
  }

  apiAddProduct(product)
    .then(() => {
      //Gọi hàm getProduct() để hiển thị lại sản phẩm sau khi thêm sản phẩm mới ra bảng
      getProduct();
    })
    .catch((error) => {
      console.log(error);
    });
}

//Viết hàm deleteProduct request API để xóa sản phẩm
function deleteProduct(productId) {
  apiDeleteProduct(productId)
    .then(() => {
      //Gọi lại hàm getProduct để hiển thị lại danh sách sản phẩm sau khi xóa
      getProduct();
    })
    .catch((error) => {
      console.log(error);
    });
}

//Viết hàm updateProduct request API để cập nhập sản phẩm
function updateProduct(productId, product) {
  //Kiểm tra xem thông tin điền vào form có hợp lệ hay ko, nếu ko thì dừng hàm
  let form = validateFormEdit();
  if (!form) {
    return;
  }

  apiUpdateProduct(productId, product)
    .then(() => {
      //Gọi lại hàm getProduct() để hiển thị lại danh sách sản phẩm sau khi cập nhật ra bảng
      getProduct();
    })
    .catch((error) => {
      console.log(error);
    });
}

//=============================================================================================

//Hàm display để hiển thị sản phẩm lên bảng
function display(products) {
  let html = products.reduce((result, product, index) => {
    let stt = index + 1;
    return (
      result +
      `
        <tr>
            <td>${stt}</td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td><img src="${product.img}" width="50px" height="50px" /></td>
            <td>${product.desc}</td>
            <td>
                <button class="btn btn-primary" data-id="${product.id}" data-type="edit" data-toggle="modal"
                data-target="#myModal">Sửa</button>

                <button class="btn btn-danger" data-id="${product.id}" data-type="delete">Xóa</button>
            </td>           
        </tr>
        `
    );
  }, "");

  dom("#tblDanhSachSP").innerHTML = html;
}

//Hàm DOM
function dom(selector) {
  return document.querySelector(selector);
}

//Hàm resetForm dùng để reset inputs về lại ô trống
function resetForm() {
  dom("#TenSP").value = "";
  dom("#GiaSP").value = "";
  dom("#ManHinhSP").value = "";
  dom("#CameraSau").value = "";
  dom("#CameraTruoc").value = "";
  dom("#HinhSP").value = "";
  dom("#MoTaSP").value = "";
  dom("#loaiSP").value = "";
}

//=============================================================================================

//Lắng nghe sự kiện click vào nút Thêm Mới
dom("#btnThemSP").addEventListener("click", () => {
  //Sửa lại title cho modal pop up khi nhấn nút Thêm Mới
  dom(".modal-title").innerHTML = "Thêm sản phẩm";

  //Thêm nút Thêm Sản Phẩm và Hủy cuối modal pop up khi nhấn nút Thêm mới
  dom(".modal-footer").innerHTML = `
    <button class="btn btn-success" data-type="add">Thêm sản phẩm</button>
    <button class="btn btn-secondary" data-dismiss="modal">Đóng</button>
    `;

  //Sửa lại input "Tên sản phẩm" để thay đổi thuộc tính oninput thành validateTenSP()
  dom("#divTenSP").innerHTML = `
  <label>Tên Sản Phẩm</label>
  <input
    id="TenSP"
    class="form-control"
    placeholder="Nhập vào tên sản phẩm"
    oninput="validateTenSP()"
  />
  <span id="spanTenSP"></span>
  `;

  //Reset form
  resetForm();
});

//Lắng nghe sự kiện click vào nút ở modal-footer (nút Thêm sản phẩm và nút Cập nhật)
dom(".modal-footer").addEventListener("click", (evt) => {
  //Lấy thuộc tính data-type của nút vừa nhấn gán vào elType
  let elType = evt.target.getAttribute("data-type");

  //DOM lấy các giá trị của inputs
  let id = dom("#MaSP").value;
  let name = dom("#TenSP").value;
  let price = dom("#GiaSP").value;
  let screen = dom("#ManHinhSP").value;
  let backCamera = dom("#CameraSau").value;
  let frontCamera = dom("#CameraTruoc").value;
  let img = dom("#HinhSP").value;
  let desc = dom("#MoTaSP").value;
  let type = dom("#loaiSP").value;

  //Tạo object product bằng lớp đối tượng Product
  let product = new Product(
    null,
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    img,
    desc,
    type
  );

  //Nếu thuộc tính đó là "add" (nút Thêm sản phẩm):
  if (elType === "add") {
    //Gọi hàm addProduct để truyền vào object product mới vừa tạo
    addProduct(product);
    alert("Đã thêm thành công")

    //Gọi hàm resetForm để reset lại inputs về ô trống
    resetForm();
  } else if (elType === "update") {
    //Gọi hàm updateProduct để truyền vào id và object product
    updateProduct(id, product);
  }
});

//Lắng nghe sự kiện khi click vào bảng danh sách sản phẩm (nút Sửa và nút Xóa)
dom("#tblDanhSachSP").addEventListener("click", (evt) => {
  //Lấy thuộc tính data-type của nút vừa nhấn gán vào elType và data-id gán vào id
  let elType = evt.target.getAttribute("data-type");
  let id = evt.target.getAttribute("data-id");

  //Nếu là nút Xóa:
  if (elType === "delete") {
    //Truyền id của sản phẩm vào hàm deleteProduct
    deleteProduct(id);
  }

  //Nếu là nút Sửa:
  if (elType === "edit") {
    //Sửa lại title cho modal pop up khi nhấn nút Sửa
    dom(".modal-title").innerHTML = "Cập nhật sản phẩm";

    //Sửa lại input "Tên sản phẩm" để thay đổi thuộc tính oninput thành validateTenSPEdit()
    dom("#divTenSP").innerHTML = `
    <label>Tên Sản Phẩm</label>
    <input
      id="TenSP"
      class="form-control"
      placeholder="Nhập vào tên sản phẩm"
      oninput="validateTenSPEdit()"
    />
    <span id="spanTenSP"></span>
    `;

    //Thêm nút Thêm Sản Phẩm và Hủy cuối modal pop up khi nhấn nút Thêm mới
    dom(".modal-footer").innerHTML = `
    <button class="btn btn-success" data-type="update">Cập nhật</button>
    <button class="btn btn-secondary" data-dismiss="modal">Đóng</button>
    `;

    //Call API để lấy thông tin của sản phẩm và điền vào inputs thông qua id của sản phẩm
    apiGetProductById(id)
      .then((reponse) => {
        let product = reponse.data;

        //Fill thông tin của sản phẩm vừa tìm dc lên inputs
        dom("#MaSP").value = product.id; //input ẩn
        dom("#TenSP").value = product.name;
        dom("#GiaSP").value = product.price;
        dom("#ManHinhSP").value = product.screen;
        dom("#CameraSau").value = product.backCamera;
        dom("#CameraTruoc").value = product.frontCamera;
        dom("#HinhSP").value = product.img;
        dom("#MoTaSP").value = product.desc;
        dom("#loaiSP").value = product.type;

        //Gán mảng producNameEdits bằng mảng productNames bỏ đi tên của sản phẩm đang sửa để validate tên sản phẩm trước khi update
        productNameEdits = productNames.filter((productName) => {
          return productName !== product.name;
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
});

//==============================================================================================
//Validation

//Hàm kiểm tra Tên sản phẩm có hợp lệ hay ko trước khi add sản phẩm
function validateTenSP() {
  //DOM
  let tenSP = dom("#TenSP").value;
  let spanEl = dom("#spanTenSP");
  spanEl.style.color = "red";
  //Xét trường hợp tên sản phẩm có để trống hay ko
  if (!tenSP) {
    spanEl.innerHTML = "Tên sản phẩm không được để trống";
    return false;
  }

  //Kiểm tra xem tên sản phẩm có trùng nhau không
  for (let i = 0; i < productNames.length; i++) {
    if (tenSP === productNames[i]) {
      spanEl.innerHTML = "Tên sản phẩm không được trùng";
      return false;
    }
  }

  spanEl.innerHTML = "";
  return true;
}

//Hàm kiểm tra Tên sản phẩm có hợp lệ hay ko trước khi cập nhật sản phẩm
function validateTenSPEdit() {
  //DOM
  let tenSP = dom("#TenSP").value;
  let spanEl = dom("#spanTenSP");
  spanEl.style.color = "red";
  //Xét trường hợp tên sản phẩm có để trống hay ko
  if (!tenSP) {
    spanEl.innerHTML = "Tên sản phẩm không được để trống";
    return false;
  }

  //Kiểm tra xem tên sản phẩm có trùng nhau không
  for (let i = 0; i < productNameEdits.length; i++) {
    if (tenSP === productNameEdits[i]) {
      spanEl.innerHTML = "Tên sản phẩm không được trùng";
      return false;
    }
  }

  spanEl.innerHTML = "";
  return true;
}

//Hàm kiểm tra Giá sản phẩm có hợp lệ hay ko
function validateGiaSP() {
  //DOM
  let giaSP = dom("#GiaSP").value;
  let spanEl = dom("#spanGiaSP");
  spanEl.style.color = "red";

  //Xét trường hợp Giá sản phẩm có để trống hay ko
  if (!giaSP) {
    spanEl.innerHTML = "Giá sản phẩm không được để trống";
    return false;
  }

  //Giá sản phẩm chỉ gồm ký số:
  let regex = /^\d+$/;
  if (!regex.test(giaSP)) {
    spanEl.innerHTML = "Giá sản phẩm chỉ bao gồm số";
    return false;
  }

  spanEl.innerHTML = "";
  return true;
}

//Hàm kiểm tra Màn hình sản phẩm có hợp lệ hay ko
function validateManHinhSP() {
  //DOM
  let manHinhSP = dom("#ManHinhSP").value;
  let spanEl = dom("#spanManHinhSP");
  spanEl.style.color = "red";

  //Xét trường hợp Màn hình sản phẩm có để trống hay ko
  if (!manHinhSP) {
    spanEl.innerHTML = "Màn hình sản phẩm không được để trống";
    return false;
  }

  spanEl.innerHTML = "";
  return true;
}

//Hàm kiểm tra Camera sau sản phẩm có hợp lệ hay ko
function validateCameraSau() {
  //DOM
  let cameraSau = dom("#CameraSau").value;
  let spanEl = dom("#spanCameraSau");
  spanEl.style.color = "red";

  //Xét trường hợp Camera sau sản phẩm có để trống hay ko
  if (!cameraSau) {
    spanEl.innerHTML = "Camera sau không được để trống";
    return false;
  }

  spanEl.innerHTML = "";
  return true;
}

//Hàm kiểm tra Camera trước sản phẩm có hợp lệ hay ko
function validateCameraTruoc() {
  //DOM
  let cameraTruoc = dom("#CameraTruoc").value;
  let spanEl = dom("#spanCameraTruoc");
  spanEl.style.color = "red";

  //Xét trường hợp Camera trước sản phẩm có để trống hay ko
  if (!cameraTruoc) {
    spanEl.innerHTML = "Camera trước không được để trống";
    return false;
  }

  spanEl.innerHTML = "";
  return true;
}

//Hàm kiểm tra Hình ảnh sản phẩm có hợp lệ hay ko
function validateHinhSP() {
  //DOM
  let hinhSP = dom("#HinhSP").value;
  let spanEl = dom("#spanHinhSP");
  spanEl.style.color = "red";

  //Xét trường hợp Hình ảnh sản phẩm có để trống hay ko
  if (!hinhSP) {
    spanEl.innerHTML = "Hình ảnh sản phẩm không được để trống";
    return false;
  }

  spanEl.innerHTML = "";
  return true;
}

//Hàm kiểm tra Mô tả sản phẩm có hợp lệ hay ko
function validateMoTaSP() {
  //DOM
  let moTaSP = dom("#MoTaSP").value;
  let spanEl = dom("#spanMoTaSP");
  spanEl.style.color = "red";

  //Xét trường hợp Mô tả sản phẩm có để trống hay ko
  if (!moTaSP) {
    spanEl.innerHTML = "Mô tả sản phẩm không được để trống";
    return false;
  }

  spanEl.innerHTML = "";
  return true;
}

//Hàm kiểm tra Loại sản phẩm có hợp lệ hay ko
function validateLoaiSP() {
  //DOM
  let loaiSP = dom("#loaiSP").value;
  let spanEl = dom("#spanLoaiSP");
  spanEl.style.color = "red";

  //Xét trường hợp Loại sản phẩm đã chọn hay chưa
  if (!loaiSP) {
    spanEl.innerHTML = "Hãy chọn loại sản phẩm";
    return false;
  }

  spanEl.innerHTML = "";
  return true;
}

//Hàm kiểm tra form input có hợp lệ hay ko trước khi add sản phẩm
function validateForm() {
  let form = true;
  form =
    validateTenSP() &
    validateGiaSP() &
    validateManHinhSP() &
    validateCameraSau() &
    validateCameraTruoc() &
    validateHinhSP() &
    validateMoTaSP() &
    validateLoaiSP();

  if (!form) {
    alert("Thông tin không hợp lệ");
    return false;
  }

  return true;
}

//Hàm kiểm tra form input có hợp lệ hay ko trước khi update sản phẩm
function validateFormEdit() {
  let form = true;
  form =
    validateTenSPEdit() &
    validateGiaSP() &
    validateManHinhSP() &
    validateCameraSau() &
    validateCameraTruoc() &
    validateHinhSP() &
    validateMoTaSP() &
    validateLoaiSP();

  if (!form) {
    alert("Thông tin không hợp lệ");
    return false;
  }

  return true;
}
