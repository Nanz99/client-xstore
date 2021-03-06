/** @format */

import axios from "axios";
import React, { useEffect, useState } from "react";
import Meta from "../../components/Meta/Meta";
import Breadcrumb from "./../../components/Breadcrumb/Breadcrumb";
import paypal from "../../assets/images/thanh-toan/paypal.jpg";
import vnpayimg from "../../assets/images/thanh-toan/vnpay.png";
import { useDispatch, useSelector } from "react-redux";
import { formatPrice } from "./../../utils/helper";
import { createOrder } from "../../actions/orderActions";
import {
  ORDER_CREATE_RESET,
  ORDER_PAY_RESET,
} from "../../constants/orderConstants";

function Checkout(props) {
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const { order, success: successCreate } = useSelector(
    (state) => state.orderCreate
  );

  const { userInfo } = useSelector((state) => state.userSignin);

  if (!userInfo) {
    props.history.push("/dang-nhap");
  }

  // if (cartItems.length === 0) {
  //   props.history.push("/gio-hang");
  // }
  const dispatch = useDispatch();

  const totalPrice = cartItems.reduce((a, c) => a + c.price * c.amount, 0);
  const shippingFee = totalPrice > 500000 ? 0 : 25000;
  const totalOrder = totalPrice + shippingFee;

  const [province, setProvince] = useState("");
  const [provinceCode, setProvinceCode] = useState("");
  const [district, setDistrict] = useState("");
  const [districtCode, setDistrictCode] = useState("");
  const [wards, setWards] = useState("");

  //Order info
  const [fullname, setFullname] = useState("");
  const [numberPhone, setNumberPhone] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [provinceCustomer, setProvinceCustomer] = useState();
  const [districtCustomer, setDistrictCustomer] = useState();
  const [wardsCustomer, setWardsCustomer] = useState();
  const [address, setAddress] = useState("");
  const [noteOrder, setNoteOrder] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");


  useEffect(() => {
    dispatch({ type: ORDER_PAY_RESET });
  },[dispatch])
  const paymentTranferBank = () => {
    const data = {
      paymentMethod,
      fullname,
      numberPhone,
      email,
      company,
      provinceCustomer,
      districtCustomer,
      wardsCustomer,
      address,
      noteOrder,
      totalPrice,
      shippingFee,
      totalOrder,
    };
    dispatch(
      createOrder({
        ...cart,
        orderItems: cart.cartItems,
        checkoutDetails: data,
      })
    );
    if (order) {
      props.history.push(`/payment/order-complete/${order._id}`);
      dispatch({ type: ORDER_CREATE_RESET });
      dispatch({ type: ORDER_PAY_RESET });
    }
  };

  useEffect(() => {
    axios.get("https://provinces.open-api.vn/api/p").then((res) => {
      setProvince(res.data);
    });

    if (provinceCode) {
      axios
        .get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
        .then((res) => {
          setDistrict(res.data.districts);
          setProvinceCustomer(res.data.name);
        });
    }
    if (districtCode) {
      axios
        .get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
        .then((res) => {
          setWards(res.data.wards);
          setDistrictCustomer(res.data.name);
        });
    }
  }, [provinceCode, districtCode]);

  const submitHandler = (e) => {
    e.preventDefault();
    const data = {
      paymentMethod,
      fullname,
      numberPhone,
      email,
      company,
      provinceCustomer,
      districtCustomer,
      wardsCustomer,
      address,
      noteOrder,
      totalPrice,
      shippingFee,
      totalOrder,
    };
    dispatch(
      createOrder({
        ...cart,
        orderItems: cart.cartItems,
        checkoutDetails: data,
      })
    );
   
  };
  const paymentWithPaypal = () => {
    if (successCreate) {
      props.history.push(`/payment/pay-paypal/${order._id}`);
    }
  };
  const paymentWithVnpay = () => {
    if (successCreate) {
      props.history.push(`/payment/pay-vnpay/${order._id}`);
    }
  };

  return (
    <div>
      <Meta title="Thanh To??n" />
      <Breadcrumb title="Thanh To??n" />
      <form action="" onSubmit={submitHandler}>
        <div className="py-20 px-8 grid grid-cols-2">
          <div className="pr-5">
            <h2 className="text-xl font-semibold capitalize mb-5 ">
              Th??ng Tin Thanh To??n
            </h2>

            <div className="flex items-center">
              <div className="mb-5 mx-3">
                <label htmlFor="hovaten">
                  H??? v?? T??n <span className="text-red-600">*</span>
                </label>
                <input
                  className="block w-64 border mt-1 text-15 border-solid border-black p-2 rounded-none focus:outline-none focus:border-red-1 focus:placeholder-transparent"
                  type="text"
                  id="hovaten"
                  placeholder="Nh???p H??? v?? T??n"
                  value={fullname}
                  required
                  onChange={(e) => setFullname(e.target.value)}
                />
              </div>
              <div className="mb-5 mx-3">
                <label htmlFor="sodienthoai">
                  S??? ??i???n tho???i <span className="text-red-600">*</span>
                </label>
                <input
                  className="block w-64 border mt-1 text-15 border-solid border-black p-2 rounded-none focus:outline-none focus:border-red-1 focus:placeholder-transparent"
                  type="phone"
                  placeholder="Nh???p S??? ??i???n Tho???i"
                  // value={numberPhone}
                  onChange={(e) => setNumberPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center ">
              <div className="mb-5 mx-3">
                <label htmlFor="email">
                  ?????a ch??? Email <span className="text-red-600">*</span>
                </label>
                <input
                  className="block w-64 border mt-1 text-15 border-solid border-black p-2 rounded-none focus:outline-none focus:border-red-1 focus:placeholder-transparent"
                  type="email"
                  id="email"
                  placeholder="Nh???p Email"
                  // value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <div className="mb-5 mx-3">
                  <label htmlFor="company">C??ng ty (n???u c??)</label>
                  <input
                    className="block w-64 border mt-1 text-15 border-solid border-black p-2 rounded-none focus:outline-none focus:border-red-1 focus:placeholder-transparent"
                    type="text"
                    id="company"
                    placeholder="Nh???p T??n C??ng Ty"
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="mb-5 mx-3">
                <label className="block text-left">
                  <span className="text-gray-700">
                    T???nh/ th??nh ph??? <span className="text-red-600">*</span>
                  </span>
                  <select
                    className="block w-64 border mt-1 text-15 border-solid border-black p-2 rounded-none focus:outline-none focus:border-red-1 focus:placeholder-transparent "
                    onChange={(e) => setProvinceCode(e.target.value)}
                  >
                    <option value=""></option>
                    {province &&
                      province.map((x, index) => {
                        return (
                          <option key={index} value={x.code}>
                            {x.name}
                          </option>
                        );
                      })}
                  </select>
                </label>
              </div>
              {/* Qu???n Huy???n */}
              <div className="mb-5 mx-3">
                <label className="block text-left">
                  <p className="text-gray-700">
                    Qu???n huy???n <span className="text-red-600">*</span>
                  </p>
                  <select
                    className="block w-64 border mt-1 text-15 border-solid border-black p-2 rounded-none focus:outline-none focus:border-red-1 focus:placeholder-transparent"
                    onChange={(e) => setDistrictCode(e.target.value)}
                  >
                    <option value=""></option>
                    {district &&
                      district.map((x, index) => {
                        return (
                          <option key={index} value={x.code}>
                            {x.name}
                          </option>
                        );
                      })}
                  </select>
                </label>
              </div>
            </div>
            {/* Ph?????ng X?? */}
            <div className="flex items-center">
              <div className="mb-5 mx-3">
                <label className="block text-left">
                  <p className="text-gray-700">
                    Ph?????ng X?? <span className="text-red-600">*</span>
                  </p>
                  <select
                    className=" block w-64 border mt-1 text-15 border-solid border-black p-2 rounded-none focus:outline-none focus:border-red-1 focus:placeholder-transparent"
                    onClick={(e) => setWardsCustomer(e.target.value)}
                  >
                    <option value=""></option>
                    {wards &&
                      wards.map((x, index) => {
                        return (
                          <option key={index} value={x.name}>
                            {x.name}
                          </option>
                        );
                      })}
                  </select>
                </label>
              </div>
              <div className="mb-5 mx-3">
                <label htmlFor="diachigiaohang">
                  ?????a Ch??? Giao H??ng<span className="text-red-600">*</span>{" "}
                </label>
                <input
                  className="block w-64 border mt-1 text-15 border-solid border-black p-2 rounded-none focus:outline-none focus:border-red-1 focus:placeholder-transparent"
                  type="text"
                  id="diachigiaohang"
                  required
                  placeholder="Nh???p ?????a Ch??? Giao H??ng"
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>

            <textarea
              className="block w-full mx-3 h-44 mt-8 border border-solid p-3 border-black rounded-none outline-none focus:border-red-1"
              name="thongtinbosung"
              id="thongtinbosung"
              placeholder="Ghi ch?? v??? ????n h??ng, v?? d???: th???i gian hay ch??? d???n ?????a ??i???m giao h??ng chi ti???t h??n."
              value={noteOrder}
              onChange={(e) => setNoteOrder(e.target.value)}
            ></textarea>
          </div>

          <div className="p-10 ml-5 border border-gray border-solid">
            <h2 className="text-xl font-semibold capitalize mb-5">
              ????n H??ng c???a b???n
            </h2>
            <div className="mb-7">
              <div>
                <div className="flex justify-between mb-5">
                  <span className="font-semibold">S???n Ph???m</span>
                  <span className="font-semibold">T???m T??nh </span>
                </div>
                {cartItems.map((item) => {
                  return (
                    <div
                      key={item.product}
                      className="flex justify-between border-gray-7 py-2 border-t border-solid"
                    >
                      <span className="pr-3">
                        {item.name}{" "}
                        <span className="ml-3">
                          <i className="material-icons text-10">close</i>
                          {item.amount}
                        </span>{" "}
                      </span>
                      <span>
                        {formatPrice(Number(item.amount) * Number(item.price))}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between py-4 border-gray-7 border-t border-solid">
                <span className="font-semibold"> T???ng ti???n : </span>{" "}
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between py-4 border-gray-7 border-t border-solid">
                <span className="font-semibold"> Ph?? ship : </span>
                <span>{formatPrice(shippingFee)}</span>
              </div>
              <div className="flex justify-between pt-6 border-gray-7 border-t border-solid">
                <span className="font-semibold"> T???ng ????n H??ng : </span>
                <span>{formatPrice(totalOrder)}</span>
              </div>
            </div>
            <div className="">
              <h2 className="text-xl font-semibold capitalize mb-5">
                Ph????ng Th???c Thanh To??n
              </h2>
              <ul className="mb-5">
                <li className="mb-3">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio "
                      name="paymentMethod"
                      value="Thanh To??n Khi Nh???n H??ng"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="ml-2 capitalize">
                      Thanh To??n Khi Nh???n H??ng
                    </span>
                  </label>
                </li>
                <li className="mb-3">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio"
                      name="paymentMethod"
                      value="Chuy???n Kho???n Ng??n H??ng"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="ml-2 capitalize">
                      Chuy???n Kho???n Ng??n H??ng
                    </span>
                  </label>
                </li>
                <li className="mb-3">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio"
                      name="paymentMethod"
                      value="Paypal"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="ml-2 capitalize inline-block">
                      {" "}
                      <img src={paypal} alt="" />
                    </span>
                  </label>
                </li>
                <li className="mb-3">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio"
                      name="paymentMethod"
                      value="Thanh To??n Qua VNPAY"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="ml-2 capitalize flex items-center">
                      <span className="mr-2">Thanh To??n Qua VNPAY</span>
                      <img src={vnpayimg} alt="" className="w-10 h-10 block" />
                    </span>
                  </label>
                </li>
              </ul>

              {paymentMethod === "Paypal" ? (
                <button
                  type="submit"
                  className="px-8 py-2 bg-transparent border-2 border-solid border-black hover:border-red-1 hover:bg-red-1 hover:text-white"
                  onClick={paymentWithPaypal}
                >
                  Thanh To??n v???i Paypal
                </button>
              ) : paymentMethod === "Thanh To??n Qua VNPAY" ? (
                <button
                  type="submit"
                  className="px-8 py-2 bg-transparent border-2 border-solid border-black hover:border-red-1 hover:bg-red-1 hover:text-white"
                  onClick={paymentWithVnpay}
                >
                  Thanh To??n Qua VNPAY
                </button>
              ) : paymentMethod === "Chuy???n Kho???n Ng??n H??ng" ? (
                <button
                  type="submit"
                  className="px-8 py-2 bg-transparent border-2 border-solid border-black hover:border-red-1 hover:bg-red-1 hover:text-white"
                  onClick={paymentTranferBank}
                >
                  Chuy???n Kho???n Ng??n H??ng
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-8 py-2 bg-transparent border-2 border-solid border-black hover:border-red-1 hover:bg-red-1 hover:text-white"
                  // onClick={placeOrder}
                >
                  ?????t H??ng
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Checkout;
