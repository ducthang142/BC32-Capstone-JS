//=================== Biến Global =====================================================
//Tạo mảng carts, giỏ hàng
let carts = [];

//Tạo đối tưởng cartItem
let cartItem = {};

//Tạo mảng productLists dùng để chứa sản phẩm lấy từ API về
let productLists = [];

//========================================= Gọi hàm ==============================================================================

getProduct();

//Hàm init sẽ dc thực thi khi chương trình dc khởi chạy
init();

//==============================================================================================================================

//Hàm init dùng để thực thi khi trương trình khởi chạy, lấy mảng carts lưu trữ trong local storage xuất ra màn hình
function init() {
  // lấy dữ liệu từ localStorage
  carts = JSON.parse(localStorage.getItem("carts")) || [];

  //Hiển thị ra giỏ hàng bằng hàm renderCart
  renderCart(carts);
}

//Hàm getProduct request API để lấy dữ liệu xuống và xuất ra bảng
function getProduct(typeFilter) {
  apiGetProduct(typeFilter)
    .then((response) => {
      productLists = [...response.data];
      display(productLists);
    })

    .catch((error) => {
      console.log(error);
    });
}

//Hàm filterProduct để lọc sản phẩm hiển thị theo loại Samsung hoặc Iphone
function filterProduct() {
  //DOM
  let typeFilter = dom("#filter").value;
  console.log(typeFilter);

  //Nếu giá trị của select không phải rỗng thì sẽ gọi hàm getProduct(typeFilter) để truyền vào giá trị type, nếu gái trị của select là rỗng thì gọi hàm getProduct như bình thường
  if (typeFilter !== "") {
    getProduct(typeFilter);
  } else {
    getProduct();
  }
}

//Hàm display để hiển thị sản phẩm ra ngoài
function display(products) {
  let output = products.reduce((result, product) => {
    return (
      result +
      `     
            <div class="card col-5 col-md-3">
                <img  src="${product.img}" width="200px" height="200px">
                <div class="card-body bg-dark text-light">
                  <h4 class="card-title">${product.name}</h4>
                  <p class="card-text">${product.desc}</p>
                  <div class="price">
                    <p class="card-text">$${product.price}</p>
                    <button class="btn btn-success" data-id="${product.id}" data-type="addToCart">ADD</button>
                  </div>
                </div>
                
            </div> 
               
        `
    );
  }, "");

  dom(".row").innerHTML = output;
}

//============================================ Helper ============================================================================

//Hàm DOM
function dom(selector) {
  return document.querySelector(selector);
}

//

//============================================== CART ================================================================================

//Lắng nghe sự kiện click vào nút ADD TO CART
dom(".row").addEventListener("click", (evt) => {
  let id = evt.target.getAttribute("data-id");
  let elementType = evt.target.getAttribute("data-type");

  if (elementType === "addToCart") {
    //Tìm index của sản phẩm có id trên trong mảng productLists
    let index = productLists.findIndex((product) => {
      return product.id === id;
    });

    //Gán đối tượng productLists[index] cùng với quantity: "1" vào object cartItem
    cartItem = { ...productLists[index], quantity: 1 };

    //Nếu carts là mảng rỗng thì push cartItem vào mảng, còn carts ko phải mảng rỗng thì xem nếu product đã tồn tại trong mảng thì tăng quantity lên 1, còn nếu chưa có trong mảng carts thì push vào
    if (carts.length === 0) {
      //Nếu carts là mảng rỗng thì push cartItem thẳng vào mảng carts
      carts.push(cartItem);
    } else if (carts.length !== 0) {
      //Tạo mảng cartProductIds chỉ chứa Id trong mảng carts
      let cartProductIds = carts.map((product) => {
        return product.id;
      });

      //Duyệt mảng cartProductIds nếu có phần tử trùng với id thì quantity + 1, còn nếu ko trùng thì sẽ push cartItem và mảng carts
      for (let i = 0; i < cartProductIds.length; i++) {
        if (cartProductIds[i] === id) {
          carts = carts.map((product) => {
            if (product.id === id) {
              return { ...product, quantity: product.quantity + 1 };
            }
            return product;
          });

          // Hiển thị giỏ hàng ra màn hình và lưu mảng carts vào local storage
          renderCart();
          localStorage.setItem("carts", JSON.stringify(carts));
          return; //Dừng lại ko thực hiện các lệnh ở dưới nữa
        }
      }

      //Nếu trường hợp product chưa có trong giỏ thì sẽ push vào mảng carts
      carts.push(cartItem);
    }

    // Hiển thị giỏ hàng ra màn hình và lưu mảng carts vào local storage
    renderCart();
    localStorage.setItem("carts", JSON.stringify(carts));
  }
});

//Viết hàm renderCart để in giỏ hàng ra màn hình
function renderCart() {
  //Lọc mảng carts chỉ giữ lại các phần tử có quantity > 0
  carts = carts.filter((product) => {
    return product.quantity > 0;
  });

  //Hiển thị carts ra màn hình
  let html = carts.reduce((result, product) => {
    //Gọi price là biến tính tiền theo số lượng của từng product
    let price = product.price * product.quantity;

    //Hiển thị ra HTML
    return (
      result +
      `
    <tr>
      <td>
        <img src="${product.img}" width="50px" height="50px"/>
      </td>
      <td>${product.name}</td>
      <td>
      <button class="btn btn-primary" data-id="${product.id}" data-type="sub"><</button>
      ${product.quantity}
      <button class="btn btn-primary" data-id="${product.id}" data-type="add">></button>
      </td>
      <td>$${price}</td>
      <td>
        <button class="btn btn-danger" data-id="${product.id}" data-type="remove">Bỏ</button>
      </td>
    </tr>
    `
    );
  }, "");

  //Tính tổng tiền phải trả
  let totalPrice = carts.reduce((total, product) => {
    return total + product.price * product.quantity;
  }, 0);

  //Tính tổng số sản phẩm có trong cart
  let totalQuantity = carts.reduce((total, product) => {
    return total + product.quantity;
  }, 0);

  //DOM để hiển thị giỏ hàng ra html
  dom("#tblCart").innerHTML = html;
  dom("#cartPrice").innerHTML = `Tổng tiền: $${totalPrice}`;
  dom(".total-quantity").innerHTML = totalQuantity;
}

//Lắng nghe sự kiện click trong thẻ tbody có id="tblCart"
dom("#tblCart").addEventListener("click", (evt) => {
  let id = evt.target.getAttribute("data-id");
  let elementType = evt.target.getAttribute("data-type");

  //Khi nhấn vào nút giảm số lượng
  if (elementType === "sub") {
    //Tạo mảng cartProductIds chỉ chứa Id trong mảng carts
    let cartProductIds = carts.map((product) => {
      return product.id;
    });

    //Duyệt mảng cartProductIds nếu có phần tử trùng với id thì quantity - 1
    for (let i = 0; i < cartProductIds.length; i++) {
      if (cartProductIds[i] === id) {
        carts = carts.map((product) => {
          if (product.id === id) {
            return { ...product, quantity: product.quantity - 1 };
          }
          return product;
        });
      }
    }

    // Hiển thị giỏ hàng ra màn hình và lưu mảng carts vào local storage
    renderCart();
    localStorage.setItem("carts", JSON.stringify(carts));
  }

  //Khi nhấn vào nút tăng số lượng
  if (elementType === "add") {
    //Tạo mảng cartProductIds chỉ chứa Id trong mảng carts
    let cartProductIds = carts.map((product) => {
      return product.id;
    });

    //Duyệt mảng cartProductIds nếu có phần tử trùng với id thì quantity - 1
    for (let i = 0; i < cartProductIds.length; i++) {
      if (cartProductIds[i] === id) {
        carts = carts.map((product) => {
          if (product.id === id) {
            return { ...product, quantity: product.quantity + 1 };
          }
          return product;
        });
      }
    }

    // Hiển thị giỏ hàng ra màn hình và lưu mảng carts vào local storage
    renderCart();
    localStorage.setItem("carts", JSON.stringify(carts));
  }

  //Khi nhấn vào nút bỏ sản phẩm
  if (elementType === "remove") {
    //Tìm index của sản phẩm có id trên trong mảng carts
    let index = carts.findIndex((product) => {
      return product.id === id;
    });

    //Dùng hàm slice và index vừa tìm dc để xóa phần tử trong mảng carts
    carts.splice(index, 1);

    // Hiển thị giỏ hàng ra màn hình và lưu mảng carts vào local storage
    renderCart();
    localStorage.setItem("carts", JSON.stringify(carts));
  }
});

//Lắng nghe sự kiện click vào nút Thanh toán
dom("#purchase").addEventListener("click", () => {
  if (carts.length === 0) {
    //Nếu giỏ hàng rỗng:
    alert("Không có gì để thanh toán!")
  } else {
  //Xuất ra lời cảm ơn đã mua hàng
  alert("Cảm ơn quý khách đã mua hàng");
  }
  //Set mảng carts về rỗng
  carts = [];

  // Hiển thị giỏ hàng ra màn hình và lưu mảng carts vào local storage
  renderCart();
  localStorage.setItem("carts", JSON.stringify(carts));
});

//Lắng nghe sự kiện click vào nút Clear giỏ hàng
dom("#clear").addEventListener("click", () => {
  //Set mảng carts về rỗng
  carts = [];

  // Hiển thị giỏ hàng ra màn hình và lưu mảng carts vào local storage
  renderCart();
  localStorage.setItem("carts", JSON.stringify(carts));
});
